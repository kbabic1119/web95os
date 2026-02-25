# Web95OS Icon System

## Overview
This project uses **emoji-based icons exclusively** (no PNG files needed).

## Icon Classes

| Class | Size | Usage |
|-------|------|-------|
| `.icon-img` | 48×48px | Desktop icons |
| `.window-titlebar-icon` | 16×16px | Window titlebar |
| `.start-icon` | 14px | Start menu items |

## Adding New Icons

1. Choose an emoji from [Emojipedia](https://emojipedia.org)
2. Add to HTML: `<div class="icon-img">🎮</div>`
3. No file management needed - emojis render natively in all modern browsers

## Current Icons

| Emoji | Application | Location |
|-------|-------------|----------|
| 🖥️ | My Computer | Desktop, Start Menu |
| 📧 | Contact | Desktop |
| 💻 | MS-DOS Prompt | Desktop, Start Menu |
| 🎮 | Pong.exe | Desktop, Start Menu |
| 🗑️ | Recycle Bin | Desktop |
| 🔒 | Secrets.txt | Desktop |
| 💀 | Terminate.exe | Desktop |
| 🌐 | Internet Explorer | Desktop, Start Menu |
| 💣 | Minesweeper | Desktop, Start Menu |
| 👹 | Freedoom | Desktop |
| 🎨 | Paint | Desktop |

## Example Usage

### Desktop Icon
```html
<div class="desktop-icon" data-window="myapp" tabindex="0">
  <div class="icon-img">🎵</div>
  <span class="icon-label">My Application</span>
</div>
```

### Window Titlebar Icon
```html
<div class="window-titlebar">
  <div class="window-titlebar-icon">🎵</div>
  <span class="window-titlebar-text">My Application</span>
  <!-- ... buttons ... -->
</div>
```

### Start Menu Item
```html
<div class="start-menu-item" data-window="myapp">
  <span class="start-icon">🎵</span>
  <span>My Application</span>
</div>
```

## Notes

- No CSS classes needed for individual icons
- Sizing is handled by the container classes listed above
- Emojis are part of Unicode - no image files to manage
- Cross-platform compatibility: works on all modern browsers
