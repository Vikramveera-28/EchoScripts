const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');
const EventEmitter = require('events');

/**
 * DeepgramClient - Handles Deepgram live streaming connection
 */
class DeepgramClient extends EventEmitter {
    constructor(config) {
        super();

        this.apiKey = config.apiKey;
        this.model = config.model || 'nova-2';
        this.language = config.language || 'en-US';
        this.punctuate = config.punctuate !== false;
        this.interimResults = config.interimResults !== false;
        this.endpointing = config.endpointing || 300;

        this.client = null;
        this.liveTranscription = null;
        this.isConnected = false;
    }

    /**
     * Initialize Deepgram client
     */
    initialize() {
        if (!this.apiKey) {
            throw new Error('Deepgram API key is required');
        }

        this.client = createClient(this.apiKey);
    }

    /**
     * Start live transcription session
     */
    async startSession() {
        try {
            if (!this.client) {
                this.initialize();
            }

            // Create live transcription connection
            this.liveTranscription = this.client.listen.live({
                model: this.model,
                language: this.language,
                punctuate: this.punctuate,
                interim_results: this.interimResults,
                endpointing: this.endpointing,
                smart_format: true,
                encoding: 'linear16',
                sample_rate: 16000,
                channels: 1
            });

            // Setup event listeners
            this.setupEventListeners();

            // Wait for connection to open
            await this.waitForConnection();

            this.isConnected = true;
            console.log('Deepgram session started');
        } catch (error) {
            console.error('Error starting Deepgram session:', error);
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * Setup event listeners for live transcription
     */
    setupEventListeners() {
        if (!this.liveTranscription) return;

        // Connection opened
        this.liveTranscription.on(LiveTranscriptionEvents.Open, () => {
            console.log('Deepgram connection opened');
            this.emit('open');
        });

        // Transcription results
        this.liveTranscription.on(LiveTranscriptionEvents.Transcript, (data) => {
            const transcript = data.channel?.alternatives?.[0]?.transcript;
            const isFinal = data.is_final;

            if (transcript && transcript.length > 0) {
                this.emit('transcription', {
                    text: transcript,
                    isFinal: isFinal,
                    confidence: data.channel?.alternatives?.[0]?.confidence || 0
                });
            }
        });

        // Metadata
        this.liveTranscription.on(LiveTranscriptionEvents.Metadata, (data) => {
            console.log('Deepgram metadata:', data);
        });

        // Connection closed
        this.liveTranscription.on(LiveTranscriptionEvents.Close, () => {
            console.log('Deepgram connection closed');
            this.isConnected = false;
            this.emit('close');
        });

        // Error handling
        this.liveTranscription.on(LiveTranscriptionEvents.Error, (error) => {
            console.error('Deepgram error:', error);
            this.emit('error', error);
        });

        // Warning
        this.liveTranscription.on(LiveTranscriptionEvents.Warning, (warning) => {
            console.warn('Deepgram warning:', warning);
        });
    }

    /**
     * Wait for connection to establish
     * @returns {Promise}
     */
    waitForConnection() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Connection timeout'));
            }, 5000);

            const onOpen = () => {
                clearTimeout(timeout);
                resolve();
            };

            const onError = (error) => {
                clearTimeout(timeout);
                reject(error);
            };

            this.once('open', onOpen);
            this.once('error', onError);
        });
    }

    /**
     * Send audio data to Deepgram
     * @param {Buffer} audioData - Audio buffer
     */
    sendAudio(audioData) {
        if (!this.liveTranscription || !this.isConnected) {
            console.warn('Cannot send audio: not connected');
            return;
        }

        try {
            this.liveTranscription.send(audioData);
        } catch (error) {
            console.error('Error sending audio:', error);
            this.emit('error', error);
        }
    }

    /**
     * Stop live transcription session
     */
    async stopSession() {
        if (!this.liveTranscription) return;

        try {
            // Signal end of audio stream
            this.liveTranscription.finish();

            this.isConnected = false;
            this.liveTranscription = null;

            console.log('Deepgram session stopped');
        } catch (error) {
            console.error('Error stopping Deepgram session:', error);
            this.emit('error', error);
        }
    }

    /**
     * Check if connected
     * @returns {boolean}
     */
    isSessionActive() {
        return this.isConnected && this.liveTranscription !== null;
    }

    /**
     * Update configuration
     * @param {Object} config - New configuration
     */
    updateConfig(config) {
        if (config.apiKey) this.apiKey = config.apiKey;
        if (config.model) this.model = config.model;
        if (config.language) this.language = config.language;
        if (config.punctuate !== undefined) this.punctuate = config.punctuate;
        if (config.interimResults !== undefined) this.interimResults = config.interimResults;
        if (config.endpointing) this.endpointing = config.endpointing;

        // Reinitialize client if API key changed
        if (config.apiKey) {
            this.client = null;
            this.initialize();
        }
    }
}

module.exports = DeepgramClient;
