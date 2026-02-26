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

  startGame() {
    if (this.running) return;

    document.getElementById('loading-doom').style.display = 'none';
    document.getElementById('content-doom').classList.remove('hidden');

    // DOOM needs a real HTTP server (service worker can't fetch file:// URLs)
    if (window.location.protocol === 'file:') {
      document.getElementById('content-doom').innerHTML = `
        <div class="doom-container">
          <div style="background:#c0c0c0; padding:20px; max-width:500px; text-align:center; font-family:Arial,sans-serif;">
            <div style="font-size:32px; margin-bottom:12px;">🖥️</div>
            <strong style="color:#000; display:block; margin-bottom:10px;">DOOM requires a web server</strong>
            <p style="color:#555; font-size:12px; margin-bottom:12px;">
              You're opening this file directly. DOOM uses WebAssembly threads which need HTTP headers that only work over a server.
            </p>
            <p style="color:#000; font-size:12px;">
              ✅ Works on <strong>GitHub Pages</strong><br>
              ✅ Works on <strong>localhost</strong> (VS Code Live Server, etc.)
            </p>
          </div>
        </div>
      `;
      return;
    }

    try {
      if (typeof window.Dos !== 'function') {
        throw new Error(`JS-DOS not loaded (window.Dos=${typeof window.Dos}). Check browser console (F12) for script errors.`);
      }

      this.playerEl = document.getElementById('doom-player');
      this.playerEl.innerHTML = '';

      window.Dos(this.playerEl, {
        url: 'games/freedoom.zip',
        pathPrefix: 'js-dos/emulators/',
        autoStart: true,
      });

      this.running = true;

      // Hide the info/controls box — game is running now
      const controls = document.querySelector('.doom-controls');
      if (controls) controls.style.display = 'none';

    } catch (error) {
      console.error('Failed to load Freedoom:', error);
      document.getElementById('content-doom').innerHTML = `
        <div class="doom-container">
          <div style="background:#c0c0c0; padding:20px; max-width:500px; text-align:center;">
            <strong style="color:#000;">⚠️ Freedoom Error</strong>
            <p style="color:#000; margin-top:10px; font-size:12px;">${error.message || error}</p>
          </div>
        </div>
      `;
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
