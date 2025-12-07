const { BrowserWindow, ipcMain } = require('electron');
const EventEmitter = require('events');
const path = require('path');

/**
 * MicrophoneManager - Captures microphone audio using Electron's native getUserMedia
 * Works on Windows without requiring Sox or any external dependencies
 */
class MicrophoneManager extends EventEmitter {
    constructor() {
        super();

        this.audioWindow = null;
        this.isRecording = false;
    }

    /**
     * Create hidden window for audio capture
     */
    createAudioWindow() {
        if (this.audioWindow) {
            return;
        }

        this.audioWindow = new BrowserWindow({
            show: false,
            width: 1,
            height: 1,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        this.audioWindow.loadFile(path.join(__dirname, '../audio-capture.html'));

        // Hide from taskbar
        this.audioWindow.setSkipTaskbar(true);

        // Setup IPC listeners
        ipcMain.on('audio-data', (event, audioBuffer) => {
            if (this.isRecording) {
                this.emit('audioData', audioBuffer);
            }
        });

        ipcMain.on('audio-started', () => {
            console.log('Microphone started');
            this.emit('started');
        });

        ipcMain.on('audio-stopped', () => {
            console.log('Microphone stopped');
            this.emit('stopped');
        });

        ipcMain.on('audio-error', (event, errorMessage) => {
            console.error('Microphone error:', errorMessage);
            this.emit('error', new Error(errorMessage));
        });
    }

    /**
     * Start capturing audio from microphone
     */
    start() {
        try {
            if (this.isRecording) {
                console.warn('Microphone is already recording');
                return;
            }

            // Create audio window if it doesn't exist
            if (!this.audioWindow) {
                this.createAudioWindow();
            }

            // Wait a bit for window to load, then start capture
            setTimeout(() => {
                this.audioWindow.webContents.send('start-capture');
                this.isRecording = true;
            }, 500);

        } catch (error) {
            console.error('Error starting microphone:', error);
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * Stop capturing audio
     */
    stop() {
        try {
            if (!this.isRecording) {
                console.warn('Microphone is not recording');
                return;
            }

            if (this.audioWindow) {
                this.audioWindow.webContents.send('stop-capture');
            }

            this.isRecording = false;

        } catch (error) {
            console.error('Error stopping microphone:', error);
            this.emit('error', error);
        }
    }

    /**
     * Check if currently recording
     * @returns {boolean}
     */
    isActive() {
        return this.isRecording;
    }

    /**
     * Get audio format information
     * @returns {Object}
     */
    getAudioFormat() {
        return {
            sampleRate: 16000,
            channels: 1,
            bitDepth: 16,
            encoding: 'linear16'
        };
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        this.stop();

        if (this.audioWindow) {
            this.audioWindow.close();
            this.audioWindow = null;
        }

        // Remove IPC listeners
        ipcMain.removeAllListeners('audio-data');
        ipcMain.removeAllListeners('audio-started');
        ipcMain.removeAllListeners('audio-stopped');
        ipcMain.removeAllListeners('audio-error');
    }
}

module.exports = MicrophoneManager;
