/* ============================================
   Clippy Assistant — context-aware, interactive
   ============================================ */

const Clippy = {
  shown: false,
  dismissed: false,
  timer: null,
  tipTimer: null,
  _autoHide: null,

  // Generic tips (shown on rotation every 30s)
  genericTips: [
    "Did you know? You can drag any window by its title bar. Very cutting-edge for 1995.",
    "Try typing <strong>sudo hire-me</strong> in the MS-DOS Prompt. I hear good things happen.",
    "It looks like you need a developer! Send a message via <strong>Contact</strong>. Kazim responds fast.",
    "Press <strong>_</strong> on any window to minimize it to the taskbar. We call it multitasking.",
    "Double-click <strong>Secrets.txt</strong> on the desktop... if you dare. 👀",
    "Try the <strong>Konami Code</strong>: ↑↑↓↓←→←→BA — something interesting happens.",
    "You can open multiple windows at once. It's 1995, we have multitasking now.",
    "Tip: <strong>Terminate.exe</strong> on the desktop does exactly what you think it does. 💀",
    "Open <strong>My Computer</strong> to browse real projects. It's worth a look.",
    "It looks like you have excellent taste in web projects. Just an observation.",
  ],

  // Context tips per window — historical facts + personality
  contextTips: {
    projects:      "It looks like you're exploring! This virtual filesystem has <strong>real live projects</strong> inside. Click a folder. 📁",
    contact:       "It looks like you want to hire a developer! Smart move. Fill out the form — Kazim definitely reads it. 😉",
    terminal:      "A hacker! Type <strong>help</strong> to see all commands. Or just try <strong>sudo hire-me</strong>. Trust me on this one.",
    ie:            "Internet Explorer 1.0 launched in <strong>1995</strong>. It finally died in 2022 — <em>27 years of suffering.</em> Pour one out. 🍺",
    pong:          "Pong was created in <strong>1972</strong> — over 50 years of bouncing a square ball. The original esport. 🏓",
    minesweeper:   "Minesweeper shipped with Windows 3.1 in <strong>1990</strong>. Microsoft said it was to teach mouse clicks. Sure it was.",
    snake:         "Snake got famous on Nokia phones in <strong>1998</strong>. No WiFi, no problem — just a pixelated noodle and pure joy. 🐍",
    spaceinvaders: "Space Invaders (<strong>1978</strong>) caused a literal <em>coin shortage in Japan.</em> That is a real historical fact.",
    doom:          `DOOM was released <strong>December 10, 1993</strong> — that's ${new Date().getFullYear() - 1993} years ago. It still rips and tears. 🤘`,
    paint:         "MS Paint launched in <strong>1985</strong>. Survived 40 years of 'why does this still exist?' Absolute legend. 🖌️",
    winamp:        "<em>Winamp really whips the llama's ass!</em> Released <strong>1997</strong>. Still the greatest music player ever made.",
    secrets:       "You found the secret file... <em>The truth is out there.</em> Follow the white rabbit. 🐇",
    recycle:       "Recycle Bin is empty. Zero bugs in this portfolio. I'm choosing to believe this. 🙏",
  },

  // Special event reactions
  dialupTip: "Connecting at <strong>56k</strong>? I remember those days. This page would've taken 3 minutes to load a single JPEG. 📞",
  bsodTip:   "It looks like Windows has encountered a fatal error. <em>This is fine.</em> 🔥 Click anywhere on the blue screen to continue.",

  init() {
    // Show Clippy 5 seconds after desktop loads
    this.timer = setTimeout(() => {
      if (!this.dismissed) this.show();
    }, 5000);
  },

  show() {
    const clippy = document.getElementById('clippy');
    if (!clippy || this.shown) return;

    clippy.classList.remove('hidden');
    this.shown = true;

    this.setupCharacterClick();
    this.setupContextMenu();

    // Show greeting on first appearance
    this.showTip("If you recognize everything on this desktop — you're an absolute legend. Welcome back to 1995. 🏆", false);

    // Rotate generic tips every 30s — only when bubble is hidden AND no windows are open
    this.tipTimer = setInterval(() => {
      const bubble = document.getElementById('clippy-bubble');
      const anyWindowOpen = document.querySelectorAll('.win95-window:not(.hidden)').length > 0;
      if (bubble && bubble.classList.contains('hidden') && !anyWindowOpen) {
        this.showRandomTip();
      }
    }, 30000);
  },

  setupCharacterClick() {
    const character = document.getElementById('clippy-character');
    if (!character) return;
    character.addEventListener('click', () => {
      const bubble = document.getElementById('clippy-bubble');
      if (bubble.classList.contains('hidden')) {
        this.showRandomTip();
      } else {
        this.hideBubble();
      }
    });
  },

  setupContextMenu() {
    const clippy = document.getElementById('clippy');
    const character = document.getElementById('clippy-character');
    if (!clippy || !character) return;

    // Build menu
    const menu = document.createElement('div');
    menu.className = 'clippy-context-menu hidden';
    menu.innerHTML = `
      <div class="clippy-menu-item" data-action="tip">💡 Show a tip</div>
      <div class="clippy-menu-item" data-action="hide">👋 Hide Clippy</div>
      <div class="clippy-menu-sep"></div>
      <div class="clippy-menu-item" data-action="dismiss">🙅 Stop bothering me!</div>
    `;
    clippy.appendChild(menu);

    character.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      menu.classList.remove('hidden');
    });

    menu.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      menu.classList.add('hidden');
      if (action === 'tip') {
        this.showRandomTip();
      } else if (action === 'hide') {
        this.hideBubble();
        clippy.style.opacity = '0.25';
        setTimeout(() => { clippy.style.opacity = ''; }, 5000);
      } else if (action === 'dismiss') {
        this.showTip("Fine! I'll leave you alone. But you'll miss me. 😢", false);
        setTimeout(() => this.dismiss(), 3000);
      }
    });

    // Close menu when clicking anywhere else
    document.addEventListener('click', () => menu.classList.add('hidden'));
  },

  // Called by WindowManager when a window opens
  onWindowOpen(windowId) {
    if (!this.shown || this.dismissed) return;
    const tip = this.contextTips[windowId];
    if (!tip) return;
    setTimeout(() => this.showTip(tip, false), 1200);
  },

  // Called by Desktop when dial-up starts
  onDialup() {
    if (!this.shown || this.dismissed) return;
    setTimeout(() => this.showTip(this.dialupTip, false), 600);
  },

  // Called by EasterEggs when BSOD triggers
  onBSOD() {
    if (this.dismissed) return;
    if (!this.shown) {
      if (this.timer) clearTimeout(this.timer);
      this.show();
    }
    setTimeout(() => this.showTip(this.bsodTip, false), 800);
  },

  showRandomTip() {
    const tip = this.genericTips[Math.floor(Math.random() * this.genericTips.length)];
    this.showTip(tip, false);
  },

  showTip(html, clickOpensIE) {
    const bubble = document.getElementById('clippy-bubble');
    if (!bubble) return;
    const text = bubble.querySelector('.clippy-bubble-text');
    if (!text) return;

    text.innerHTML = html;
    bubble.classList.remove('hidden');

    // Wobble character
    const char = document.getElementById('clippy-character');
    if (char) {
      char.classList.add('clippy-wobble');
      setTimeout(() => char.classList.remove('clippy-wobble'), 600);
    }

    // Auto-hide after 12s
    clearTimeout(this._autoHide);
    this._autoHide = setTimeout(() => this.hideBubble(), 12000);

    // Rewire bubble click (clone to remove old listeners)
    const newBubble = bubble.cloneNode(true);
    bubble.parentNode.replaceChild(newBubble, bubble);

    newBubble.addEventListener('click', (e) => {
      if (e.target.closest('.clippy-bubble-close')) { this.hideBubble(); return; }
      if (clickOpensIE) this.openIE();
    });

    const closeBtn = newBubble.querySelector('.clippy-bubble-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.hideBubble(); });
    }
  },

  hideBubble() {
    const bubble = document.getElementById('clippy-bubble');
    if (bubble) bubble.classList.add('hidden');
  },

  openIE() {
    this.hideBubble();
    if (typeof WindowManager !== 'undefined') WindowManager.open('ie');
  },

  dismiss() {
    this.dismissed = true;
    if (this.timer) clearTimeout(this.timer);
    if (this.tipTimer) clearInterval(this.tipTimer);
    clearTimeout(this._autoHide);
    const clippy = document.getElementById('clippy');
    if (clippy) clippy.classList.add('hidden');
  }
};
