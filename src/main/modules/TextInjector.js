const { keyboard, Key } = require('@nut-tree-fork/nut-js');

/**
 * TextInjector - Injects text into focused application via keyboard simulation
 */
class TextInjector {
    constructor(typingSpeed = 50) {
        this.typingSpeed = typingSpeed;

        // Configure nut.js settings
        keyboard.config.autoDelayMs = typingSpeed;
    }

    /**
     * Type text character-by-character
     * @param {string} text - Text to type
     */
    async typeText(text) {
        try {
            if (!text || text.length === 0) return;

            // Add a small delay before starting to type
            await this.delay(100);

            // Type the text
            await keyboard.type(text);
        } catch (error) {
            console.error('Error typing text:', error);
            throw error;
        }
    }

    /**
     * Press a single key
     * @param {string} keyName - Key name (e.g., 'Enter', 'Backspace')
     */
    async pressKey(keyName) {
        try {
            const key = this.getKey(keyName);
            if (key) {
                await keyboard.pressKey(key);
                await keyboard.releaseKey(key);
            } else {
                console.warn(`Unknown key: ${keyName}`);
            }
        } catch (error) {
            console.error(`Error pressing key ${keyName}:`, error);
            throw error;
        }
    }

    /**
     * Execute keyboard shortcut (e.g., 'ctrl+a')
     * @param {string} shortcut - Shortcut string
     */
    async executeShortcut(shortcut) {
        try {
            const keys = shortcut.split('+').map(k => this.getKey(k.trim()));

            if (keys.some(k => k === null)) {
                console.warn(`Invalid shortcut: ${shortcut}`);
                return;
            }

            // Press all keys
            for (const key of keys) {
                await keyboard.pressKey(key);
            }

            // Small delay while keys are held
            await this.delay(50);

            // Release all keys in reverse order
            for (const key of keys.reverse()) {
                await keyboard.releaseKey(key);
            }
        } catch (error) {
            console.error(`Error executing shortcut ${shortcut}:`, error);
            throw error;
        }
    }

    /**
     * Execute a command (key press or shortcut)
     * @param {string} command - Command string
     */
    async executeCommand(command) {
        if (command.includes('+')) {
            await this.executeShortcut(command);
        } else {
            await this.pressKey(command);
        }
    }

    /**
     * Get Key object from key name
     * @param {string} keyName - Key name
     * @returns {Key|null} Key object or null
     */
    getKey(keyName) {
        const keyMap = {
            'enter': Key.Enter,
            'backspace': Key.Backspace,
            'tab': Key.Tab,
            'space': Key.Space,
            'ctrl': Key.LeftControl,
            'control': Key.LeftControl,
            'shift': Key.LeftShift,
            'alt': Key.LeftAlt,
            'delete': Key.Delete,
            'home': Key.Home,
            'end': Key.End,
            'pageup': Key.PageUp,
            'pagedown': Key.PageDown,
            'escape': Key.Escape,
            'esc': Key.Escape,
            'a': Key.A,
            'c': Key.C,
            'v': Key.V,
            'x': Key.X,
            'z': Key.Z,
            'y': Key.Y,
            's': Key.S,
            'up': Key.Up,
            'down': Key.Down,
            'left': Key.Left,
            'right': Key.Right
        };

        return keyMap[keyName.toLowerCase()] || null;
    }

    /**
     * Set typing speed
     * @param {number} speed - Speed in milliseconds
     */
    setTypingSpeed(speed) {
        this.typingSpeed = speed;
        keyboard.config.autoDelayMs = speed;
    }

    /**
     * Delay helper
     * @param {number} ms - Milliseconds
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = TextInjector;
