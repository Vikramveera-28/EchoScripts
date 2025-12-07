# Installation Guide

## Prerequisites

Before installing the application, ensure you have the following:

1. **Node.js 20.x or higher**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Windows Build Tools** (Required for native modules)
   
   Option A - Using npm:
   ```bash
   npm install --global windows-build-tools
   ```

   Option B - Manual installation:
   - Install Visual Studio 2022 (Community Edition is free)
   - During installation, select "Desktop development with C++"
   - Include "MSVC" and "Windows SDK" components

3. **Deepgram API Key**
   - Sign up at [https://deepgram.com](https://deepgram.com)
   - Navigate to your dashboard
   - Copy your API key

## Installation Steps

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- Electron
- Deepgram SDK
- nut-js (keyboard automation)

- auto-launch (startup integration)
- mic (audio capture)

### 2. Rebuild Native Modules

After installation, rebuild native modules for Electron:

```bash
npm run rebuild
```

If you encounter errors, try:

```bash
npm install --global electron-rebuild
electron-rebuild -f -w @nut-tree/nut-js
```

### 3. Configure API Key

1. Open the `config.js` file in the project root directory
2. Locate the `deepgramApiKey` field (near the top of the file)
3. Replace the empty string with your Deepgram API key:
   ```javascript
   deepgramApiKey: 'your-api-key-here',
   ```
4. Save the file

**Optional**: Customize other settings in `config.js`:
- `hotkey`: Change the activation shortcut (default: `CommandOrControl+Shift+S`)
- `autoLaunch`: Enable/disable auto-start with Windows (default: `false`)
- `language`: Change recognition language (default: `en-US`)
- `voiceCommands`: Enable/disable voice commands (default: `true`)
- `typingSpeed`: Adjust typing speed in ms per character (default: `50`)

### 4. Test the Application

1. Open any text editor (Notepad, VS Code, browser, etc.)
2. Click in a text field
3. Press `Ctrl + Shift + S`
4. A floating window should appear
5. Start speaking
6. Your speech should be transcribed and typed automatically

## Troubleshooting

### Error: Cannot find module '@nut-tree/nut-js'

**Solution**: Rebuild native modules
```bash
npm run rebuild
```

### Error: Microphone permission denied

**Solution**: 
1. Open Windows Settings → Privacy → Microphone
2. Ensure "Allow apps to access your microphone" is ON
3. Restart the application

### Error: Global shortcut already registered

**Solution**: Another application is using Ctrl+Shift+S. Close other applications or change the hotkey in settings.

### Error: Deepgram connection failed

**Solution**:
1. Verify your API key is correct
2. Check internet connection
3. Verify Deepgram API status at [status.deepgram.com](https://status.deepgram.com)

### Error: VCRUNTIME140.dll missing

**Solution**: Install Visual C++ Redistributable
- Download from [Microsoft](https://aka.ms/vs/17/release/vc_redist.x64.exe)
- Install and restart

### Native module compilation errors

**Solution**: Ensure Windows Build Tools are installed
```bash
npm install --global windows-build-tools
```

Or install Visual Studio 2022 with C++ development tools.

## Building for Production

To create a distributable installer:

```bash
npm run build
```

The installer will be created in the `dist/` folder.

## First-Time Setup Checklist

- [ ] Node.js 20.x+ installed
- [ ] Windows Build Tools installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Native modules rebuilt (`npm run rebuild`)
- [ ] Deepgram API key added to `config.js`
- [ ] Application started (`npm start`)
- [ ] Microphone permissions granted
- [ ] Global hotkey tested (Ctrl+Shift+S)
- [ ] Speech recognition tested

## System Requirements

- **OS**: Windows 10 or Windows 11
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 200MB
- **Internet**: Required for Deepgram API
- **Microphone**: Required for speech input

## Optional Configuration

### Enable Auto-Start

1. Set `autoLaunch: true` in `config.js`
2. Restart the application

OR

1. Right-click system tray icon
2. Check "Auto-launch on startup"

### Customize Settings

Edit `config.js` to customize:
- Language (English, Spanish, French, etc.)
- Typing speed
- Voice commands (enable/disable)
- Auto-punctuation
- Deepgram AI model
- Endpointing delay

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all prerequisites are met
3. Review console logs for error messages
4. Check Deepgram documentation at [developers.deepgram.com](https://developers.deepgram.com)
