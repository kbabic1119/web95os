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
      if (e.target.classList.contains('desktop-icons') || e.target.classList.contains('desktop')) {
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
    // Handle special actions (like Terminate.exe → BSOD)
    const action = icon.dataset.action;
    if (action === 'bsod' && typeof EasterEggs !== 'undefined') {
      EasterEggs.showBSOD();
      this.deselectAll();
      return;
    }

    const windowId = icon.dataset.window;
    if (windowId) {
      WindowManager.open(windowId);
    }
    this.deselectAll();
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
  }
};
