/**
 * Configuration File for Deepgram Speech Typer
 * 
 * IMPORTANT: Edit this file to add your Deepgram API key before using the application.
 * Get your API key from: https://console.deepgram.com/
 */

module.exports = {
    // ========================
    // REQUIRED CONFIGURATION
    // ========================

    /**
     * Your Deepgram API key
     * REQUIRED: This must be set for the application to work
     * Example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
     */
    deepgramApiKey: '516743421ba047c58e6444150833a5dc53d08bb4',

    // ========================
    // GENERAL SETTINGS
    // ========================

    /**
     * Global hotkey to activate speech recognition
     * Default: 'CommandOrControl+Shift+S'
     * 
     * Modifiers: CommandOrControl, Alt, Shift, Super
     * Keys: A-Z, 0-9, F1-F24, etc.
     * Example: 'CommandOrControl+Alt+V'
     */
    hotkey: 'CommandOrControl+Shift+S',

    /**
     * Auto-launch application on system startup
     * Default: false
     */
    autoLaunch: false,

    /**
     * Language for speech recognition
     * Default: 'en-US'
     * 
     * Supported languages:
     * - 'en-US' (English - United States)
     * - 'en-GB' (English - United Kingdom)
     * - 'es' (Spanish)
     * - 'fr' (French)
     * - 'de' (German)
     * - 'it' (Italian)
     * - 'pt' (Portuguese)
     * - 'nl' (Dutch)
     */
    language: 'en-US',

    /**
     * Enable voice commands (e.g., "new line", "backspace", "delete")
     * Default: true
     */
    voiceCommands: true,

    /**
     * Typing speed in milliseconds per character
     * Default: 50
     * Range: 0-1000 (lower = faster typing)
     */
    typingSpeed: 50,

    /**
     * Show floating UI indicator when listening
     * Default: false (UI has been removed in this version)
     * Note: This setting is kept for backwards compatibility but has no effect
     */
    showFloatingUI: false,

    // ========================
    // DEEPGRAM SETTINGS
    // ========================

    /**
     * Deepgram AI model to use
     * Default: 'nova-2'
     * 
     * Options:
     * - 'nova-2' (Latest, most accurate)
     * - 'nova' (Previous generation)
     * - 'enhanced' (Older model)
     * - 'base' (Fastest, less accurate)
     */
    deepgramModel: 'nova-2',

    /**
     * Automatically add punctuation to transcribed text
     * Default: true
     */
    punctuate: true,

    /**
     * Show interim (partial) results while speaking
     * Default: true
     */
    interimResults: true,

    /**
     * Endpointing delay in milliseconds
     * Default: 300
     * 
     * How long to wait after speech stops before finalizing transcription
     * Range: 100-2000
     */
    endpointing: 300,

    /**
     * Custom voice commands (advanced)
     * Default: {}
     * 
     * Add your own custom voice commands here
     * Example:
     * customCommands: {
     *   'open terminal': { action: 'hotkey', keys: ['CommandOrControl', 'T'] },
     *   'save file': { action: 'hotkey', keys: ['CommandOrControl', 'S'] }
     * }
     */
    customCommands: {}
};
