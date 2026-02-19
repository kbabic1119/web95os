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
        if (typeof Clippy !== 'undefined') Clippy.onWindowOpen(windowId);
      }, this.loadingDuration);
    }
  },

  close(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    if (windowId === 'pong' && typeof Pong !== 'undefined') Pong.stop();
    if (windowId === 'minesweeper' && typeof Minesweeper !== 'undefined') Minesweeper.stop();

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

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      dragging = true;
      const rect = windowEl.getBoundingClientRect();
      ox = e.clientX - rect.left;
      oy = e.clientY - rect.top;
      titlebar.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      let newLeft = e.clientX - ox;
      let newTop = e.clientY - oy;

      // Clamp within viewport
      const maxLeft = window.innerWidth - windowEl.offsetWidth;
      const maxTop = window.innerHeight - 80; // leave taskbar space
      newLeft = Math.max(0, Math.min(maxLeft, newLeft));
      newTop = Math.max(0, Math.min(maxTop, newTop));

      windowEl.style.left = `${newLeft}px`;
      windowEl.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        titlebar.style.cursor = '';
      }
    });

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
