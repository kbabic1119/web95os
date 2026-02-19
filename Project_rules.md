# Project Rules

This project is Windows 95 WebOS simulation.

## Architecture Rules

All apps installed in:

```
C:/Program Files/
```

Desktop shortcuts:

```
C:/Desktop/
```

Each app has:

- index.html
- script.js
- style.css
- manifest.json
- icon.png

- Claude must never mix app code into system code.
- Claude must install apps, not hardcode them.
- System must remain modular.
