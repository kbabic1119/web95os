# Freedoom Setup Instructions

## ✅ What's Already Done

- ✅ Freedoom downloaded to `freedoom-0.12.1/`
- ✅ WAD files extracted (`freedoom1.wad`, `freedoom2.wad`)
- ✅ Bundle folder created: `freedoom-bundle/`

## 📥 Next Step - Download JS-DOS Doom Engine

Since js-dos.com CDN is blocked in your region, you need to **manually download** the Doom engine:

### Option 1: Download from Alternative Source
1. Go to: https://dos.zone/player/
2. Find Doom game
3. Download the bundle/ZIP file
4. Extract and copy the engine files to `freedoom-bundle/`

### Option 2: Use GitHub Release
1. Go to: https://github.com/caiiiycuk/js-dos/releases
2. Download latest WASM build
3. Extract Doom engine files
4. Copy to `freedoom-bundle/`

### Option 3: Use VPN/Proxy
1. Use a VPN or proxy service
2. Download from: https://cdn.js-dos.com/8.3.15/current/wasm/doom.zip
3. Extract contents
4. Copy all files to `freedoom-bundle/`

## 🎮 Create Final Bundle

After downloading the Doom engine:

1. Copy all engine files to `freedoom-bundle/`
2. Make sure `freedoom1.wad` is in the same folder
3. Create a ZIP: `freedoom.zip` containing all files
4. Place `freedoom.zip` in `web95os/games/`

## 📁 Final Folder Structure

```
web95os/
├── games/
│   ├── freedoom.zip    ← Final bundle (create this)
│   ├── freedoom-bundle/
│   │   ├── freedoom1.wad
│   │   ├── freedoom2.wad
│   │   └── [JS-DOS engine files]
│   └── freedoom-0.12.1/
│       ├── freedoom1.wad
│       └── freedoom2.wad
├── js/
│   └── doom.js
├── css/
├── index.html
└── README.md
```

## ✅ Test

1. Open `index.html` in your browser
2. Click the **Freedoom** desktop icon (👹)
3. Click **Start Game**
4. Game should load!

## 🎮 Controls

- **Arrow Keys** - Move
- **CTRL** - Shoot
- **SPACE** - Open doors
- **ESC** - Menu

## 🔧 Troubleshooting

If game doesn't load:
1. Check browser console (F12) for errors
2. Verify `games/freedoom.zip` exists
3. Make sure you're running from a web server (not file://)
4. Try GitHub Pages deployment

## 📝 Notes

- Freedoom is **100% free and open-source** (BSD license)
- Safe to host on GitHub Pages
- No copyright issues
- Works with any Doom engine port
