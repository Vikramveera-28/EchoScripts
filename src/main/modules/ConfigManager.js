const path = require('path');
const { app } = require('electron');

/**
 * ConfigManager - Manages application configuration using config.js file
 */
class ConfigManager {
  constructor() {
    // Load configuration from config.js in the application root
    const configPath = this.getConfigPath();

    try {
      // Clear require cache to get fresh config
      delete require.cache[require.resolve(configPath)];
      this.config = require(configPath);
      console.log('Configuration loaded from:', configPath);
    } catch (error) {
      console.error('Error loading config.js:', error);
      console.error('Please ensure config.js exists in the application directory');

      // Use default configuration if config.js is not found
      this.config = this.getDefaultConfig();
    }
  }

  /**
   * Get the path to config.js
   * @returns {string} Absolute path to config.js
   */
  getConfigPath() {
    // In production, config.js should be in the app root directory
    // In development, it's in the project root
    if (app.isPackaged) {
      // Production: look in the app.asar.unpacked or installation directory
      return path.join(process.resourcesPath, 'config.js');
    } else {
      // Development: look in project root
      return path.join(__dirname, '../../../config.js');
    }
  }

  /**
   * Get default configuration
   * @returns {Object} Default configuration object
   */
  getDefaultConfig() {
    return {
      deepgramApiKey: '',
      hotkey: 'CommandOrControl+Shift+S',
      autoLaunch: false,
      language: 'en-US',
      voiceCommands: true,
      typingSpeed: 50,
      showFloatingUI: false,
      deepgramModel: 'nova-2',
      punctuate: true,
      interimResults: true,
      endpointing: 300,
      customCommands: {}
    };
  }

  /**
   * Get a configuration value
   * @param {string} key - Configuration key
   * @returns {*} Configuration value
   */
  get(key) {
    return this.config[key];
  }

  /**
   * Set a configuration value (in-memory only)
   * Note: Changes are not persisted to config.js file
   * @param {string} key - Configuration key
   * @param {*} value - Configuration value
   */
  set(key, value) {
    this.config[key] = value;
    console.log(`Configuration updated: ${key} = ${value}`);
  }

  /**
   * Get all configuration
   * @returns {Object} All configuration
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * Reset configuration to defaults (in-memory only)
   */
  reset() {
    this.config = this.getDefaultConfig();
  }

  /**
   * Reload configuration from config.js file
   */
  reload() {
    const configPath = this.getConfigPath();

    try {
      // Clear require cache to get fresh config
      delete require.cache[require.resolve(configPath)];
      this.config = require(configPath);
      console.log('Configuration reloaded from:', configPath);
    } catch (error) {
      console.error('Error reloading config.js:', error);
    }
  }

  /**
   * Check if API key is configured
   * @returns {boolean}
   */
  hasApiKey() {
    const apiKey = this.get('deepgramApiKey');
    return apiKey && apiKey.length > 0;
  }

  /**
   * Validate configuration
   * @returns {Object} Validation result
   */
  validate() {
    const errors = [];

    if (!this.hasApiKey()) {
      errors.push('Deepgram API key is not configured in config.js');
    }

    const language = this.get('language');
    const supportedLanguages = ['en-US', 'en-GB', 'es', 'fr', 'de', 'it', 'pt', 'nl'];
    if (!supportedLanguages.includes(language)) {
      errors.push('Unsupported language');
    }

    const typingSpeed = this.get('typingSpeed');
    if (typingSpeed < 0 || typingSpeed > 1000) {
      errors.push('Typing speed must be between 0-1000ms');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get Deepgram configuration
   * @returns {Object} Deepgram settings
   */
  getDeepgramConfig() {
    return {
      apiKey: this.get('deepgramApiKey'),
      model: this.get('deepgramModel'),
      language: this.get('language'),
      punctuate: this.get('punctuate'),
      interimResults: this.get('interimResults'),
      endpointing: this.get('endpointing')
    };
  }
}

module.exports = ConfigManager;
