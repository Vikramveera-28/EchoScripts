const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');

// Modules
const ConfigManager = require('./modules/ConfigManager');
const SpeechRecognitionController = require('./modules/SpeechRecognitionController');
const AutoLauncher = require('./modules/AutoLauncher');

// Global variables
let tray = null;
let configManager = null;
let speechController = null;
let autoLauncher = null;

/**
 * Initialize application
 */
function initializeApp() {
    console.log('Initializing application...');

    // Initialize configuration
    configManager = new ConfigManager();

    // Initialize auto-launcher
    autoLauncher = new AutoLauncher('Deepgram Speech Typer');

    // Setup auto-launch based on config
    setupAutoLaunch();

    // Initialize speech recognition controller
    if (configManager.hasApiKey()) {
        speechController = new SpeechRecognitionController(configManager);
        setupSpeechControllerEvents();
    } else {
        console.warn('Deepgram API key not configured');
    }

    // Create system tray
    createSystemTray();

    // Register global shortcut
    registerGlobalShortcut();

    console.log('Application initialized');
}

/**
 * Create system tray icon and menu
 */
function createSystemTray() {
    // Create tray icon using nativeImage for PNG support
    const { nativeImage } = require('electron');
    const iconPath = path.join(__dirname, '../../assets/icon.png');
    const icon = nativeImage.createFromPath(iconPath);

    if (icon.isEmpty()) {
        console.error('Failed to load tray icon from:', iconPath);
        // Create a simple fallback icon
        const fallbackIcon = nativeImage.createEmpty();
        tray = new Tray(fallbackIcon);
    } else {
        tray = new Tray(icon);
    }

    // Create context menu
    updateTrayMenu();

    tray.setToolTip('VocalKey');

    // Click handler
    tray.on('click', () => {
        toggleSpeechRecognition();
    });
}

/**
 * Update tray menu based on state
 */
function updateTrayMenu() {
    const isListening = speechController && speechController.getState() === 'listening';
    const apiKeyConfigured = configManager && configManager.hasApiKey();

    const contextMenu = Menu.buildFromTemplate([
        {
            label: isListening ? 'Stop Listening (Ctrl+Shift+S)' : 'Start Listening (Ctrl+Shift+S)',
            click: toggleSpeechRecognition,
            enabled: apiKeyConfigured
        },
        { type: 'separator' },
        {
            label: 'Auto-launch on startup',
            type: 'checkbox',
            checked: configManager.get('autoLaunch'),
            click: toggleAutoLaunch
        },
        { type: 'separator' },
        {
            label: 'About',
            click: showAbout
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
}

/**
 * Register global shortcut
 */
function registerGlobalShortcut() {
    const hotkey = configManager.get('hotkey');

    const success = globalShortcut.register(hotkey, () => {
        console.log(`Global shortcut triggered: ${hotkey}`);
        toggleSpeechRecognition();
    });

    if (success) {
        console.log(`Global shortcut registered: ${hotkey}`);
    } else {
        console.error(`Failed to register global shortcut: ${hotkey}`);
    }
}

/**
 * Unregister global shortcut
 */
function unregisterGlobalShortcut() {
    globalShortcut.unregisterAll();
    console.log('Global shortcuts unregistered');
}

/**
 * Toggle speech recognition on/off
 */
async function toggleSpeechRecognition() {
    if (!speechController) {
        console.error('Speech controller not initialized');
        showNotification('Error', 'Please configure Deepgram API key in config.js');
        return;
    }

    try {
        const currentState = speechController.getState();

        if (currentState === 'idle') {
            // Start listening
            await speechController.start();
        } else {
            // Stop listening
            await speechController.stop();
        }

        updateTrayMenu();
    } catch (error) {
        console.error('Error toggling speech recognition:', error);
        showNotification('Error', error.message);
    }
}

/**
 * Setup speech controller event listeners
 */
function setupSpeechControllerEvents() {
    if (!speechController) return;

    speechController.on('started', () => {
        console.log('Speech recognition started');
    });

    speechController.on('stopped', () => {
        console.log('Speech recognition stopped');
    });

    speechController.on('interim', (text) => {
        console.log(`Interim: ${text}`);
    });

    speechController.on('text', (text) => {
        console.log(`Text typed: ${text}`);
    });

    speechController.on('command', (data) => {
        console.log(`Command executed: ${data.command}`);
    });

    speechController.on('error', (error) => {
        console.error('Speech recognition error:', error);
        showNotification('Error', error.message);
    });

    speechController.on('stateChange', ({ oldState, newState }) => {
        console.log(`State changed: ${oldState} -> ${newState}`);
        updateTrayMenu();
    });
}



/**
 * Show about dialog
 */
function showAbout() {
    const { dialog } = require('electron');

    dialog.showMessageBox({
        type: 'info',
        title: 'About',
        message: 'Deepgram Speech Typer',
        detail: 'Version 1.0.0\n\nA desktop speech-to-text application powered by Deepgram.\n\nPress Ctrl+Shift+S to activate voice typing anywhere.',
        buttons: ['OK']
    });
}

/**
 * Show notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 */
function showNotification(title, message) {
    const { Notification } = require('electron');

    if (Notification.isSupported()) {
        new Notification({
            title: title,
            body: message
        }).show();
    }
}

/**
 * Setup auto-launch
 */
async function setupAutoLaunch() {
    const autoLaunchEnabled = configManager.get('autoLaunch');

    if (autoLaunchEnabled) {
        await autoLauncher.enable();
    }
}

/**
 * Toggle auto-launch
 */
async function toggleAutoLaunch() {
    const currentState = configManager.get('autoLaunch');
    const newState = !currentState;

    configManager.set('autoLaunch', newState);

    if (newState) {
        await autoLauncher.enable();
    } else {
        await autoLauncher.disable();
    }

    updateTrayMenu();
}


// App lifecycle events
app.whenReady().then(() => {
    initializeApp();
});

app.on('window-all-closed', (event) => {
    // Prevent app from quitting when all windows are closed
    event.preventDefault();
});

app.on('before-quit', () => {
    // Cleanup
    unregisterGlobalShortcut();

    if (speechController) {
        speechController.cleanup();
    }
});

app.on('will-quit', () => {
    // Final cleanup
    unregisterGlobalShortcut();
});

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, show notification
        showNotification('Already Running', 'Deepgram Speech Typer is already running in the system tray.');
    });
}
