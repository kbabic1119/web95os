/* ============================================
   Clippy Assistant — context-aware, interactive
   ============================================ */

const Clippy = {
  shown: false,
  dismissed: false,
  timer: null,
  tipTimer: null,

  // Generic tips shown randomly
  genericTips: [
    "It looks like you're browsing a portfolio! Click <strong>Internet Explorer</strong> to see my live projects.",
    "Did you know? You can drag windows around by their title bar!",
    "Try typing <strong>help</strong> in the MS-DOS Prompt to see available commands.",
    "It looks like you're looking for a developer! Send me a message via <strong>Contact</strong>.",
    "Press the <strong>_</strong> button on any window to minimize it to the taskbar.",
    "Type <strong>sudo hire-me</strong> in the terminal. Go on, try it.",
    "Double-click <strong>Secrets.txt</strong> on the desktop... if you dare.",
    "It looks like you're having fun! Try the <strong>Konami Code</strong> for a surprise.",
    "You can open multiple windows at once now. It's 1995 — we have multitasking!",
    "Click <strong>Internet Explorer</strong> to browse all my live projects!",
  ],

  // Context-specific tips triggered by window opening
  contextTips: {
    pong:        "It looks like you're playing Pong! Press <strong>SPACE</strong> to pause. Use W/S or mouse to move.",
    minesweeper: "It looks like you're playing Minesweeper! <strong>Right-click</strong> to place flags.",
    terminal:    "It looks like you're in MS-DOS! Type <strong>help</strong> to see all commands.",
    projects:    "It looks like you're browsing files! Double-click any folder to open it.",
    ie:          "It looks like you're on the Internet! Click a site to open it in a new tab.",
    contact:     "It looks like you want to get in touch! Fill out the form or email directly.",
    secrets:     "It looks like you found the secret file... <em>Follow the white rabbit.</em>",
    recycle:     "The Recycle Bin is empty. Zero bugs found. Warranty: void.",
  },

  init() {
    // Show Clippy 10 seconds after desktop loads
    this.timer = setTimeout(() => {
      if (!this.dismissed) this.show();
    }, 10000);
  },

  show() {
    const clippy = document.getElementById('clippy');
    if (!clippy || this.shown) return;

    clippy.classList.remove('hidden');
    this.shown = true;

    this.setupBubbleClick();
    this.setupCloseButton();
    this.setupCharacterClick();

    // Auto-hide bubble after 15 seconds
    setTimeout(() => this.hideBubble(), 15000);

    // Rotate tips every 30 seconds
    this.tipTimer = setInterval(() => {
      if (!document.getElementById('clippy-bubble').classList.contains('hidden')) return;
      this.showRandomTip();
    }, 30000);
  },

  setupBubbleClick() {
    const bubble = document.getElementById('clippy-bubble');
    if (!bubble) return;
    bubble.addEventListener('click', (e) => {
      if (e.target.id === 'clippy-bubble-close') return;
      this.openIE();
    });
  },

  setupCloseButton() {
    const closeBtn = document.getElementById('clippy-bubble-close');
    if (!closeBtn) return;
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideBubble();
    });
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

  // Called by WindowManager when a window opens
  onWindowOpen(windowId) {
    if (!this.shown || !this.contextTips[windowId]) return;
    // Wait a beat before showing context tip
    setTimeout(() => {
      const tip = this.contextTips[windowId];
      this.showTip(tip, false); // false = don't auto-open IE on click
    }, 1200);
  },

  showRandomTip() {
    const tip = this.genericTips[Math.floor(Math.random() * this.genericTips.length)];
    this.showTip(tip, true);
  },

  showTip(html, clickOpensIE) {
    const bubble = document.getElementById('clippy-bubble');
    const text   = document.getElementById('clippy-bubble-text');
    if (!bubble || !text) return;

    text.innerHTML = html;
    bubble.classList.remove('hidden');

    // Wobble the character
    const char = document.getElementById('clippy-character');
    if (char) {
      char.classList.add('clippy-wobble');
      setTimeout(() => char.classList.remove('clippy-wobble'), 600);
    }

    // Auto-hide after 12s
    clearTimeout(this._autoHide);
    this._autoHide = setTimeout(() => this.hideBubble(), 12000);

    // Rewire bubble click
    const bubble2 = document.getElementById('clippy-bubble');
    const newBubble = bubble2.cloneNode(true);
    bubble2.parentNode.replaceChild(newBubble, bubble2);

    newBubble.addEventListener('click', (e) => {
      if (e.target.closest('.clippy-bubble-close')) { this.hideBubble(); return; }
      if (clickOpensIE) this.openIE();
    });

    const closeBtn2 = newBubble.querySelector('.clippy-bubble-close');
    if (closeBtn2) {
      closeBtn2.addEventListener('click', (e) => { e.stopPropagation(); this.hideBubble(); });
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
    const clippy = document.getElementById('clippy');
    if (clippy) clippy.classList.add('hidden');
  }
};
