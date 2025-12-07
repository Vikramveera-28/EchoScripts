# EchoScript (formerly Deepgram Speech Typer)

A cross-platform desktop application (Windows & Linux) that enables voice-to-text typing in any application using Deepgram's live streaming API.

## Features

- **Global Hotkey**: Press `Ctrl+Shift+S` from anywhere to activate speech recognition
- **Universal Text Injection**: Types recognized text into any focused application
- **Real-Time Transcription**: Uses Deepgram's live streaming API for instant results
- **Voice Commands**: Execute keyboard actions like "press enter", "new line", "select all"
- **Background Utility**: Runs in system tray with minimal UI
- **Auto-Launch**: Optionally start with Windows

## Prerequisites

### General
- Node.js 20.x or higher
- Deepgram API Key ([Get one here](https://deepgram.com))

### Windows
- Windows 10/11
- Windows Build Tools (often included with Node.js or Visual Studio)

### Linux
- Ubuntu/Debian based distribution (recommended)
- System dependencies for native modules (`nut.js`, `robotjs`):
  ```bash
  sudo apt-get install build-essential libxtst-dev libpng++-dev python3
  ```

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Rebuild Native Modules**:
   ```bash
   npm run rebuild
   ```

3. **Configure Deepgram API Key**:
   - Edit `config.js` in the project root
   - Add your Deepgram API key to the `deepgramApiKey` field
   - Save the file

## Usage

1. **Start the Application**:
   ```bash
   npm start
   ```

2. **Activate Speech Recognition**:
   - Press `Ctrl+Shift`+S while in any text field
   - Start speaking
   - Text automatically types where your cursor is

3. **Voice Commands**:
   - "press enter" - Insert new line
   - "press backspace" - Delete character
   - "select all" - Select all text (Ctrl+A)
   - "new line" - Insert new line
   - "press tab" - Insert tab

## Building for Production

```bash
npm run build
```

The installer/package will be created in the `dist/` folder.

- **Windows**: Generates an NSIS installer (`.exe`)
- **Linux**: Generates an AppImage and Debian package (`.deb`)

## Configuration

All settings are configured in the `config.js` file in the application directory:

- **deepgramApiKey**: Your Deepgram API key (REQUIRED)
- **hotkey**: Customize the activation shortcut (default: `Ctrl+Shift+S`)
- **autoLaunch**: Start with Windows (default: `false`)
- **language**: Recognition language (default: `en-US`)
- **voiceCommands**: Enable/disable command recognition (default: `true`)
- **typingSpeed**: Typing speed in milliseconds per character (default: `50`)
- **deepgramModel**: AI model to use (default: `nova-2`)
- **punctuate**: Automatically add punctuation (default: `true`)

See `config.js` for all available options and detailed documentation.

## Troubleshooting

### Native Module Errors

If you encounter errors with `@nut-tree/nut-js`, install Windows Build Tools:

```bash
npm install --global windows-build-tools
```

Or install Visual Studio Build Tools 2022 with C++ development tools.

### Microphone Permission

Ensure Windows has microphone permissions enabled for Electron.

### Antivirus Warnings

Some antivirus software may flag keyboard injection. Add an exception for the app.

## License

MIT
