/* ============================================
   Window Manager — drag, minimize, z-index, multi-window
   ============================================ */

const WindowManager = {
  loadingDuration: 600,
  zCounter: 100,
  windows: {}, // { windowId: { minimized, initialized } }

  open(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    if (!this.windows[windowId]) {
      this.windows[windowId] = { minimized: false, initialized: false };
    }
    const state = this.windows[windowId];

    // Restore if minimized
    if (state.minimized) {
      state.minimized = false;
      windowEl.classList.remove('hidden');
      this.bringToFront(windowId);
      this.updateTaskbarButton(windowId, false);
      if (windowId === 'pong' && typeof Pong !== 'undefined') Pong.start();
      if (windowId === 'minesweeper' && typeof Minesweeper !== 'undefined') Minesweeper.start();
      if (windowId === 'winamp' && typeof Winamp !== 'undefined') Winamp.start();
      if (windowId === 'snake' && typeof Snake !== 'undefined') Snake.start();
      if (windowId === 'spaceinvaders' && typeof SpaceInvaders !== 'undefined') SpaceInvaders.start();
      return;
    }

    // Already visible — just bring to front
    if (!windowEl.classList.contains('hidden')) {
      this.bringToFront(windowId);
      return;
    }

    // First time opening — set position
    if (!state.initialized) {
      this.positionWindow(windowEl);
      state.initialized = true;
    }

    windowEl.classList.remove('hidden', 'closing');
    this.bringToFront(windowId);
    this.addTaskbarButton(windowId, windowEl.dataset.title);

    // Show loading bar, then content
    const loading = document.getElementById(`loading-${windowId}`);
    const content = document.getElementById(`content-${windowId}`);

    if (loading && content) {
      loading.classList.remove('hidden');
      content.classList.add('hidden');

      const bar = loading.querySelector('.loading-bar');
      if (bar) {
        bar.style.animation = 'none';
        bar.offsetHeight; // force reflow
        bar.style.animation = '';
      }

      setTimeout(() => {
        loading.classList.add('hidden');
        content.classList.remove('hidden');

        if (windowId === 'terminal') {
          const input = document.getElementById('terminal-input');
          if (input) input.focus();
        }
        if (windowId === 'projects' && typeof Explorer !== 'undefined') Explorer.init();
        if (windowId === 'pong' && typeof Pong !== 'undefined') Pong.start();
        if (windowId === 'minesweeper' && typeof Minesweeper !== 'undefined') Minesweeper.start();
        if (windowId === 'winamp' && typeof Winamp !== 'undefined') Winamp.start();
        if (windowId === 'snake' && typeof Snake !== 'undefined') Snake.start();
        if (windowId === 'spaceinvaders' && typeof SpaceInvaders !== 'undefined') SpaceInvaders.start();
        if (typeof Clippy !== 'undefined') Clippy.onWindowOpen(windowId);
      }, this.loadingDuration);
    }
  },

  close(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    if (windowId === 'pong' && typeof Pong !== 'undefined') Pong.stop();
    if (windowId === 'minesweeper' && typeof Minesweeper !== 'undefined') Minesweeper.stop();
    if (windowId === 'winamp' && typeof Winamp !== 'undefined') Winamp.stop();
    if (windowId === 'snake' && typeof Snake !== 'undefined') Snake.stop();
    if (windowId === 'spaceinvaders' && typeof SpaceInvaders !== 'undefined') SpaceInvaders.stop();

    windowEl.classList.add('closing');
    setTimeout(() => {
      windowEl.classList.add('hidden');
      windowEl.classList.remove('closing');
    }, 150);

    this.removeTaskbarButton(windowId);

    if (this.windows[windowId]) {
      this.windows[windowId].minimized = false;
      this.windows[windowId].initialized = false;
    }
  },

  minimize(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl || windowEl.classList.contains('hidden')) return;

    if (windowId === 'pong' && typeof Pong !== 'undefined') Pong.stop();
    if (windowId === 'minesweeper' && typeof Minesweeper !== 'undefined') Minesweeper.stop();
    if (windowId === 'winamp' && typeof Winamp !== 'undefined') Winamp.stop();
    if (windowId === 'snake' && typeof Snake !== 'undefined') Snake.stop();
    if (windowId === 'spaceinvaders' && typeof SpaceInvaders !== 'undefined') SpaceInvaders.stop();

    if (!this.windows[windowId]) this.windows[windowId] = {};
    this.windows[windowId].minimized = true;

    windowEl.classList.add('closing');
    setTimeout(() => {
      windowEl.classList.add('hidden');
      windowEl.classList.remove('closing');
    }, 150);

    this.updateTaskbarButton(windowId, true);
  },

  bringToFront(windowId) {
    this.zCounter++;
    const windowEl = document.getElementById(`window-${windowId}`);
    if (windowEl) windowEl.style.zIndex = this.zCounter;
  },

  positionWindow(windowEl) {
    // On mobile, snap to top-left with small margin (no cascade, no drag)
    if (window.innerWidth <= 600) {
      windowEl.style.left = '10px';
      windowEl.style.top = '4px';
      windowEl.style.transform = 'none';
      return;
    }
    // Cascade: each window opens slightly offset from the last
    const openCount = Object.values(this.windows).filter(s => s.initialized).length;
    const offset = (openCount % 8) * 24;
    windowEl.style.left = `${60 + offset}px`;
    windowEl.style.top = `${44 + offset}px`;
    windowEl.style.transform = 'none';
  },

  /* ============================================
     Drag System
     ============================================ */
  setupDrag(windowEl) {
    const titlebar = windowEl.querySelector('.window-titlebar');
    if (!titlebar) return;

    let dragging = false;
    let ox, oy; // offset from window origin to mouse at drag start

    const startDrag = (clientX, clientY) => {
      if (window.innerWidth <= 600) return; // no drag on mobile
      dragging = true;
      const rect = windowEl.getBoundingClientRect();
      ox = clientX - rect.left;
      oy = clientY - rect.top;
      titlebar.style.cursor = 'grabbing';
    };

    const moveDrag = (clientX, clientY) => {
      if (!dragging) return;
      let newLeft = clientX - ox;
      let newTop = clientY - oy;
      const maxLeft = window.innerWidth - windowEl.offsetWidth;
      const maxTop = window.innerHeight - 80;
      newLeft = Math.max(0, Math.min(maxLeft, newLeft));
      newTop = Math.max(0, Math.min(maxTop, newTop));
      windowEl.style.left = `${newLeft}px`;
      windowEl.style.top = `${newTop}px`;
    };

    const endDrag = () => {
      if (dragging) { dragging = false; titlebar.style.cursor = ''; }
    };

    // Mouse
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    // Touch
    titlebar.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', endDrag);

    // Click anywhere on window → bring to front
    windowEl.addEventListener('mousedown', () => {
      const windowId = windowEl.id.replace('window-', '');
      this.bringToFront(windowId);
    });
  },

  /* ============================================
     Taskbar Buttons
     ============================================ */
  addTaskbarButton(windowId, title) {
    const container = document.getElementById('taskbar-windows');
    this.removeTaskbarButton(windowId);

    const btn = document.createElement('button');
    btn.className = 'taskbar-window-btn';
    btn.dataset.windowId = windowId;
    btn.textContent = title || windowId;
    btn.addEventListener('click', () => {
      const state = this.windows[windowId];
      if (state && state.minimized) {
        this.open(windowId); // restore
      } else {
        this.minimize(windowId);
      }
    });

    container.appendChild(btn);
  },

  updateTaskbarButton(windowId, isMinimized) {
    const btn = document.querySelector(`#taskbar-windows [data-window-id="${windowId}"]`);
    if (btn) btn.classList.toggle('minimized', isMinimized);
  },

  removeTaskbarButton(windowId) {
    const btn = document.querySelector(`#taskbar-windows [data-window-id="${windowId}"]`);
    if (btn) btn.remove();
  },

  /* ============================================
     Setup — called once after desktop loads
     ============================================ */
  setupCloseButtons() {
    document.querySelectorAll('.window-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const windowEl = e.target.closest('.win95-window');
        if (windowEl) this.close(windowEl.id.replace('window-', ''));
      });
    });

    document.querySelectorAll('.window-minimize-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const windowEl = e.target.closest('.win95-window');
        if (windowEl) this.minimize(windowEl.id.replace('window-', ''));
      });
    });

    // Enable drag on all windows
    document.querySelectorAll('.win95-window').forEach(windowEl => {
      this.setupDrag(windowEl);
    });
  }
};
