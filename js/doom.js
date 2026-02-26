// ============================================
// Freedoom - JS-DOS Integration (Local Hosting)
// ============================================

class Doom {
  constructor() {
    this.playerEl = null;
    this.running = false;
    this.init();
  }

  init() {
    const btn = document.getElementById('doom-start');
    if (btn) btn.addEventListener('click', () => this.startGame());
  }

  async startGame() {
    if (this.running) return;

    document.getElementById('loading-doom').style.display = 'none';
    document.getElementById('content-doom').classList.remove('hidden');

    const showError = (msg) => {
      document.getElementById('content-doom').innerHTML = `
        <div class="doom-container">
          <div style="background:#c0c0c0; padding:20px; max-width:500px; text-align:center; font-family:Arial,sans-serif;">
            <strong style="color:#000;">⚠️ Freedoom Error</strong>
            <p style="color:#000; margin-top:10px; font-size:12px;">${msg}</p>
          </div>
        </div>
      `;
    };

    // DOOM needs a real HTTP server
    if (window.location.protocol === 'file:') {
      showError('DOOM requires a web server (GitHub Pages or localhost). You\'re opening this file directly.');
      return;
    }

    // DOOM needs SharedArrayBuffer (COOP/COEP headers via service worker)
    if (typeof SharedArrayBuffer === 'undefined') {
      showError('Your browser does not support SharedArrayBuffer — required for DOOM\'s WebAssembly threads.<br><br>Try reloading the page (the service worker may need one load to activate), or use Chrome/Firefox on desktop.');
      return;
    }

    if (typeof window.Dos !== 'function') {
      showError(`JS-DOS not loaded. Check browser console for script errors.`);
      return;
    }

    try {
      this.playerEl = document.getElementById('doom-player');
      this.playerEl.innerHTML = '';

      await window.Dos(this.playerEl, {
        url: 'games/freedoom.zip',
        pathPrefix: 'js-dos/emulators/',
        autoStart: true,
      });

      this.running = true;

      // Hide the info/controls box only after js-dos resolves
      const controls = document.querySelector('.doom-controls');
      if (controls) controls.style.display = 'none';

    } catch (error) {
      console.error('Failed to load Freedoom:', error);
      showError(error.message || String(error));
    }
  }

  stop() {
    if (this.playerEl) {
      this.playerEl.innerHTML = '';
    }
    this.running = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.doom = new Doom();
});
