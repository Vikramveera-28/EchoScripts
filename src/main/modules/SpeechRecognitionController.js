const EventEmitter = require('events');
const DeepgramClient = require('./DeepgramClient');
const MicrophoneManager = require('./MicrophoneManager');
const CommandParser = require('./CommandParser');
const TextInjector = require('./TextInjector');

/**
 * SpeechRecognitionController - Orchestrates the entire speech-to-text workflow
 */
class SpeechRecognitionController extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;
        this.state = 'idle'; // idle, listening, processing, error

        // Initialize modules
        this.deepgramClient = new DeepgramClient(config.getDeepgramConfig());
        this.microphoneManager = new MicrophoneManager();
        this.commandParser = new CommandParser();
        this.textInjector = new TextInjector(config.get('typingSpeed'));

        // Transcription buffer for interim results
        this.lastInterimText = '';
        this.finalTextBuffer = '';

        // Setup event listeners
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for all modules
     */
    setupEventListeners() {
        // Microphone events
        this.microphoneManager.on('audioData', (audioData) => {
            this.handleAudioData(audioData);
        });

        this.microphoneManager.on('error', (error) => {
            console.error('Microphone error:', error);
            this.handleError(error);
        });

        // Deepgram events
        this.deepgramClient.on('transcription', (data) => {
            this.handleTranscription(data);
        });

        this.deepgramClient.on('error', (error) => {
            console.error('Deepgram error:', error);
            this.handleError(error);
        });

        this.deepgramClient.on('close', () => {
            console.log('Deepgram connection closed');
        });
    }

    /**
     * Start speech recognition
     */
    async start() {
        try {
            if (this.state === 'listening') {
                console.warn('Already listening');
                return;
            }

            console.log('Starting speech recognition...');
            this.setState('listening');

            // Reset buffers
            this.lastInterimText = '';
            this.finalTextBuffer = '';

            // Start Deepgram session
            await this.deepgramClient.startSession();

            // Start microphone
            this.microphoneManager.start();

            this.emit('started');
            console.log('Speech recognition started');
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Stop speech recognition
     */
    async stop() {
        try {
            if (this.state === 'idle') {
                console.warn('Not currently listening');
                return;
            }

            console.log('Stopping speech recognition...');

            // Stop microphone
            this.microphoneManager.stop();

            // Stop Deepgram session
            await this.deepgramClient.stopSession();

            this.setState('idle');
            this.emit('stopped');

            console.log('Speech recognition stopped');
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
            this.handleError(error);
        }
    }

    /**
     * Handle audio data from microphone
     * @param {Buffer} audioData - Audio buffer
     */
    handleAudioData(audioData) {
        if (this.state === 'listening' && this.deepgramClient.isSessionActive()) {
            // Send audio to Deepgram
            this.deepgramClient.sendAudio(audioData);
        }
    }

    /**
     * Handle transcription from Deepgram
     * @param {Object} data - Transcription data
     */
    async handleTranscription(data) {
        try {
            const { text, isFinal, confidence } = data;

            console.log(`Transcription [${isFinal ? 'FINAL' : 'INTERIM'}]: "${text}" (confidence: ${confidence})`);

            if (isFinal) {
                // Process final transcription
                await this.processFinalTranscription(text);
                this.lastInterimText = '';
            } else {
                // Update interim transcription
                this.lastInterimText = text;
                this.emit('interim', text);
            }
        } catch (error) {
            console.error('Error handling transcription:', error);
            this.handleError(error);
        }
    }

    /**
     * Process final transcription
     * @param {string} text - Transcribed text
     */
    async processFinalTranscription(text) {
        if (!text || text.trim().length === 0) {
            return;
        }

        // Check if voice commands are enabled
        const voiceCommandsEnabled = this.config.get('voiceCommands');

        if (voiceCommandsEnabled) {
            // Parse for commands
            const parsed = this.commandParser.parse(text);

            if (parsed.type === 'command') {
                console.log(`Executing command: ${parsed.value}`);
                await this.textInjector.executeCommand(parsed.value);
                this.emit('command', { command: parsed.value, originalText: parsed.originalText });
                return;
            }
        }

        // Not a command, type the text
        console.log(`Typing text: "${text}"`);

        // Add space before new text if not first word
        const textToType = this.finalTextBuffer.length > 0 ? ' ' + text : text;

        await this.textInjector.typeText(textToType);
        this.finalTextBuffer += textToType;

        this.emit('text', text);
    }

    /**
     * Handle errors
     * @param {Error} error - Error object
     */
    handleError(error) {
        this.setState('error');
        this.emit('error', error);

        // Attempt to stop and cleanup
        this.stop().catch(err => {
            console.error('Error during cleanup:', err);
        });
    }

    /**
     * Set state
     * @param {string} newState - New state
     */
    setState(newState) {
        const oldState = this.state;
        this.state = newState;
        this.emit('stateChange', { oldState, newState });
    }

    /**
     * Get current state
     * @returns {string}
     */
    getState() {
        return this.state;
    }

    /**
     * Toggle recognition (start if idle, stop if listening)
     */
    async toggle() {
        if (this.state === 'idle') {
            await this.start();
        } else {
            await this.stop();
        }
    }

    /**
     * Update configuration
     * @param {Object} newConfig - New configuration
     */
    updateConfig(newConfig) {
        this.config = newConfig;

        // Update modules
        this.deepgramClient.updateConfig(newConfig.getDeepgramConfig());
        this.textInjector.setTypingSpeed(newConfig.get('typingSpeed'));
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        this.stop().catch(err => {
            console.error('Error during cleanup:', err);
        });

        this.removeAllListeners();
        this.deepgramClient.removeAllListeners();
        this.microphoneManager.removeAllListeners();
    }
}

module.exports = SpeechRecognitionController;
