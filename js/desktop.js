/* ============================================
   Desktop (Icons, Taskbar, Clock, Start Menu)
   ============================================ */

const Desktop = {
  selectedIcon: null,

  show() {
    const desktop = document.getElementById('desktop');
    desktop.classList.remove('hidden');
    desktop.classList.add('fade-in');
    this.init();
  },

  init() {
    this.setupIcons();
    this.setupStartMenu();
    this.setupClock();
    this.setupClickOutside();
    this.setupRecycleBin();
    WindowManager.setupCloseButtons();
  },

  setupIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    let clickTimer = null;

    icons.forEach(icon => {
      // Single click: select
      icon.addEventListener('click', (e) => {
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
          // Double click detected
          this.openIcon(icon);
          return;
        }

        clickTimer = setTimeout(() => {
          clickTimer = null;
          this.selectIcon(icon);
        }, 250);
      });

      // Double click fallback
      icon.addEventListener('dblclick', (e) => {
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        this.openIcon(icon);
      });

      // Keyboard: Enter to open
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.openIcon(icon);
        }
      });
    });

    // Click on desktop background deselects
    document.getElementById('desktop').addEventListener('click', (e) => {
      if (e.target.classList.contains('desktop-icons') || e.target.classList.contains('desktop-icon-area') || e.target.classList.contains('desktop') || e.target.classList.contains('desktop-icons-right')) {
        this.deselectAll();
      }
    });
  },

  selectIcon(icon) {
    this.deselectAll();
    icon.classList.add('selected');
    this.selectedIcon = icon;
  },

  deselectAll() {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    this.selectedIcon = null;
  },

  openIcon(icon) {
    // Handle special actions
    const action = icon.dataset.action;
    if (action === 'bsod' && typeof EasterEggs !== 'undefined') {
      EasterEggs.showBSOD();
      this.deselectAll();
      return;
    }
    if (action === 'dialup') {
      this.showDialup();
      this.deselectAll();
      return;
    }

    const windowId = icon.dataset.window;
    if (windowId) {
      WindowManager.open(windowId);
    }
    this.deselectAll();
  },

  showDialup() {
    const overlay = document.getElementById('dialup-overlay');
    const statusEl = document.getElementById('dialup-status-text');
    const speedEl = document.getElementById('dialup-speed-text');
    const progressEl = document.getElementById('dialup-progress-bar');
    const cancelBtn = document.getElementById('dialup-cancel-btn');
    const closeBtn = document.getElementById('dialup-close-btn');

    // Reset state
    if (progressEl) progressEl.style.width = '0%';
    if (statusEl) statusEl.textContent = 'Dialing...';
    if (speedEl) speedEl.textContent = 'Negotiating...';
    overlay.classList.remove('hidden');

    if (typeof Clippy !== 'undefined') Clippy.onDialup();
    this.playDialupSound();

    const steps = [
      { delay: 0,    progress: 5,   status: 'Dialing 555-1234...',              speed: 'Connecting...' },
      { delay: 1600, progress: 20,  status: 'Waiting for answer...',             speed: 'Connecting...' },
      { delay: 2800, progress: 40,  status: 'Verifying username and password...', speed: 'Negotiating...' },
      { delay: 4200, progress: 65,  status: 'Logging on to the network...',      speed: 'Negotiating...' },
      { delay: 5400, progress: 90,  status: 'Connected!',                        speed: '56,000 bps' },
      { delay: 6200, progress: 100, status: 'Connected to America Online',       speed: '56,000 bps' },
    ];

    this._dialupTimers = [];
    steps.forEach(({ delay, progress, status, speed }) => {
      const t = setTimeout(() => {
        if (statusEl) statusEl.textContent = status;
        if (speedEl) speedEl.textContent = speed;
        if (progressEl) progressEl.style.width = progress + '%';
      }, delay);
      this._dialupTimers.push(t);
    });

    // Auto-close after sound finishes
    const autoClose = setTimeout(() => this.closeDialup(), 7500);
    this._dialupTimers.push(autoClose);

    const close = () => this.closeDialup();
    if (cancelBtn) cancelBtn.onclick = close;
    if (closeBtn) closeBtn.onclick = close;
  },

  closeDialup() {
    const overlay = document.getElementById('dialup-overlay');
    overlay.classList.add('hidden');
    if (this._dialupTimers) {
      this._dialupTimers.forEach(clearTimeout);
      this._dialupTimers = [];
    }
    if (this._dialupAudioCtx) {
      try { this._dialupAudioCtx.close(); } catch(e) {}
      this._dialupAudioCtx = null;
    }
  },

  playDialupSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._dialupAudioCtx = ctx;
      let t = ctx.currentTime + 0.05;

      const tone = (freq, start, dur, vol = 0.12) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(vol, start + 0.01);
        g.gain.setValueAtTime(vol, start + dur - 0.01);
        g.gain.linearRampToValueAtTime(0, start + dur);
        o.start(start); o.stop(start + dur + 0.05);
      };

      const chirp = (f1, f2, start, dur, vol = 0.18) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(f1, start);
        o.frequency.linearRampToValueAtTime(f2, start + dur);
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(vol, start + 0.01);
        g.gain.setValueAtTime(vol, start + dur - 0.02);
        g.gain.linearRampToValueAtTime(0, start + dur);
        o.start(start); o.stop(start + dur + 0.05);
      };

      // 1. Dial tone (350 + 440 Hz)
      tone(350, t, 0.35); tone(440, t, 0.35);
      t += 0.35;

      // 2. DTMF: 5,5,5,1,2,3,4
      const rows = [697, 770, 852, 941];
      const cols = [1209, 1336, 1477];
      const digits = [[1,1],[1,1],[1,1],[0,0],[0,1],[0,2],[1,0]];
      digits.forEach(([r, c]) => {
        tone(rows[r], t, 0.1); tone(cols[c], t, 0.1);
        t += 0.18;
      });
      t += 0.15;

      // 3. Ring-back (440 + 480 Hz), two bursts
      for (let i = 0; i < 2; i++) {
        tone(440, t, 0.35, 0.1); tone(480, t, 0.35, 0.1);
        t += 0.55;
      }
      t += 0.1;

      // 4. ANSam answer tone (2100 Hz)
      tone(2100, t, 0.4, 0.15);
      t += 0.4;

      // 5. Handshake screech — rapid frequency chirps
      const screeches = [
        [300, 3400, 0.18], [3400, 1200, 0.14], [1200, 2800, 0.16],
        [2800, 600,  0.12], [600,  3200, 0.20], [3200, 900,  0.14],
        [900,  2400, 0.18], [2400, 500,  0.13], [500,  3000, 0.22],
        [3000, 1100, 0.15],
      ];
      screeches.forEach(([f1, f2, dur]) => {
        chirp(f1, f2, t, dur, 0.22);
        t += dur;
      });

      // 6. White noise burst (negotiating data)
      const noiseDur = 1.4;
      const bufLen = Math.ceil(ctx.sampleRate * noiseDur);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buf;
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass'; bpf.frequency.value = 1800; bpf.Q.value = 1.2;
      const ng = ctx.createGain();
      noiseNode.connect(bpf); bpf.connect(ng); ng.connect(ctx.destination);
      ng.gain.setValueAtTime(0, t);
      ng.gain.linearRampToValueAtTime(0.35, t + 0.1);
      ng.gain.setValueAtTime(0.35, t + noiseDur - 0.2);
      ng.gain.linearRampToValueAtTime(0, t + noiseDur);
      noiseNode.start(t); noiseNode.stop(t + noiseDur);

      // More chirps on top of noise
      chirp(1200, 2100, t + 0.2, 0.28, 0.16);
      chirp(2100, 600,  t + 0.6, 0.22, 0.16);
      chirp(600,  2400, t + 0.95, 0.32, 0.16);
      t += noiseDur;

      // 7. Connected — steady carrier
      tone(2100, t, 0.7, 0.08);
      tone(1200, t, 0.7, 0.08);

    } catch (e) {
      console.log('Dial-up audio unavailable:', e);
    }
  },

  setupStartMenu() {
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    const shutdownBtn = document.getElementById('start-shutdown');

    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !startMenu.classList.contains('hidden');
      if (isOpen) {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      } else {
        startMenu.classList.remove('hidden');
        startBtn.classList.add('active');
      }
    });

    // Start menu items open windows
    startMenu.querySelectorAll('.start-menu-item[data-window]').forEach(item => {
      item.addEventListener('click', () => {
        const windowId = item.dataset.window;
        WindowManager.open(windowId);
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      });
    });

    // Shut Down joke
    if (shutdownBtn) {
      shutdownBtn.addEventListener('click', () => {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
        // Show BSOD as a joke
        if (typeof EasterEggs !== 'undefined') {
          EasterEggs.showBSOD();
        }
      });
    }
  },

  setupClickOutside() {
    document.addEventListener('click', (e) => {
      const startMenu = document.getElementById('start-menu');
      const startBtn = document.getElementById('start-btn');

      if (!startMenu.classList.contains('hidden') &&
        !startMenu.contains(e.target) &&
        !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      }
    });
  },

  setupClock() {
    const clockEl = document.getElementById('taskbar-clock');
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${hours}:${minutes}`;
    };

    updateClock();
    setInterval(updateClock, 10000);
  },

  fixRecycleBin() {
    const bugMsg = document.getElementById('recycle-bug-msg');
    const statusMsg = document.getElementById('recycle-status-msg');
    const btn = document.getElementById('empty-bin-btn');

    if (bugMsg) bugMsg.innerHTML = 'This portfolio contains <strong>0 bugs</strong>. ;)';
    if (statusMsg) statusMsg.textContent = 'All fixed!';
    if (btn) btn.textContent = 'Empty Recycle Bin (Done)';
  },

  setupRecycleBin() {
    const btn = document.getElementById('empty-bin-btn');
    if (btn) {
      btn.addEventListener('click', () => this.fixRecycleBin());
    }
  }
};
