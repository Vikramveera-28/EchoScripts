# Voice Commands Reference

This document lists all supported voice commands that can trigger keyboard actions instead of typing text.

## Basic Commands

| Voice Command | Action | Keyboard Equivalent |
|--------------|--------|-------------------|
| "press enter" | Insert new line | Enter |
| "new line" | Insert new line | Enter |
| "press backspace" | Delete previous character | Backspace |
| "backspace" | Delete previous character | Backspace |
| "delete" | Delete previous character | Backspace |
| "press tab" | Insert tab | Tab |
| "tab" | Insert tab | Tab |

## Text Selection

| Voice Command | Action | Keyboard Equivalent |
|--------------|--------|-------------------|
| "select all" | Select all text | Ctrl+A |

## Clipboard Operations

| Voice Command | Action | Keyboard Equivalent |
|--------------|--------|-------------------|
| "copy" | Copy selected text | Ctrl+C |
| "paste" | Paste from clipboard | Ctrl+V |
| "cut" | Cut selected text | Ctrl+X |

## Undo/Redo

| Voice Command | Action | Keyboard Equivalent |
|--------------|--------|-------------------|
| "undo" | Undo last action | Ctrl+Z |
| "redo" | Redo last action | Ctrl+Y |

## Document Operations

| Voice Command | Action | Keyboard Equivalent |
|--------------|--------|-------------------|
| "save" | Save document | Ctrl+S |

## Punctuation

| Voice Command | Action | Result |
|--------------|--------|-------|
| "period" | Insert period | . |
| "comma" | Insert comma | , |
| "question mark" | Insert question mark | ? |
| "exclamation mark" | Insert exclamation mark | ! |
| "exclamation point" | Insert exclamation mark | ! |

## Usage Tips

### Mixing Text and Commands

You can mix regular speech with commands in the same session:

1. Press `Ctrl+Shift+S` to start
2. Say: "Hello world"
3. Say: "press enter"
4. Say: "This is a new line"
5. Say: "select all"
6. Say: "copy"

### Command Recognition

- Commands are detected using fuzzy matching
- Slight variations are accepted (e.g., "hit enter" might work)
- Commands are case-insensitive
- Commands must be spoken clearly and distinctly

### Disabling Commands

If you want to type command phrases as text instead:

1. Open Settings
2. Uncheck "Enable voice commands"
3. Save settings

When disabled, all speech will be typed as text.

## Adding Custom Commands

To add custom commands, you'll need to modify the code:

1. Open `src/main/modules/CommandParser.js`
2. Add your command to the `commands` object:
   ```javascript
   'your phrase': 'keyboard+action'
   ```
3. Save and restart the application

Example:
```javascript
'next line': 'enter',
'start new paragraph': 'enter+enter'
```

## Command Limitations

- Commands execute keyboard shortcuts, not application-specific actions
- Some applications may not respond to all shortcuts
- Complex multi-step commands are not supported
- Commands cannot include parameters or variables

## Future Enhancements

Planned features for future versions:

- Custom command configuration via UI
- Multi-step command sequences
- Application-specific command sets
- Command macros
- Voice-activated command recording
