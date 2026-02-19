/* ============================================
   My Computer — Windows 95 Explorer
   ============================================ */

const Explorer = {
  history: ['root'],
  historyIndex: 0,

  // Virtual filesystem
  fs: {
    root: {
      label: 'My Computer',
      address: 'C:\\',
      items: [
        { type: 'drive',  icon: '💾', label: 'C:\\',          path: 'c_drive' },
        { type: 'folder', icon: '📁', label: 'Program Files', path: 'programs' },
        { type: 'folder', icon: '📁', label: 'My Documents',  path: 'documents' },
        { type: 'folder', icon: '📁', label: 'Desktop',       path: 'desktop' },
        { type: 'folder', icon: '📁', label: 'Projects',      path: 'projects' },
      ]
    },
    c_drive: {
      label: 'Local Disk (C:)',
      address: 'C:\\',
      items: [
        { type: 'folder', icon: '📁', label: 'Program Files', path: 'programs' },
        { type: 'folder', icon: '📁', label: 'My Documents',  path: 'documents' },
        { type: 'folder', icon: '📁', label: 'Windows',       path: 'windows_folder' },
      ]
    },
    programs: {
      label: 'Program Files',
      address: 'C:\\Program Files\\',
      items: [
        { type: 'exe', icon: '🖥️', label: 'MS-DOS Prompt.exe', action: 'terminal', desc: 'Command line interface' },
        { type: 'exe', icon: '🎮', label: 'Pong.exe',          action: 'pong',     desc: 'Classic arcade game' },
        { type: 'exe', icon: '💣', label: 'Minesweeper.exe',   action: 'minesweeper', desc: 'Puzzle game' },
        { type: 'exe', icon: '🌐', label: 'Internet Explorer.exe', action: 'ie',   desc: 'Web browser' },
      ]
    },
    documents: {
      label: 'My Documents',
      address: 'C:\\My Documents\\',
      items: [
        { type: 'txt', icon: '📄', label: 'about_me.txt',  action: 'about',   desc: 'Personal information' },
        { type: 'txt', icon: '📄', label: 'contact.txt',   action: 'contact', desc: 'Contact details' },
        { type: 'txt', icon: '🔒', label: 'secrets.txt',   action: 'secrets', desc: 'Classified' },
      ]
    },
    desktop: {
      label: 'Desktop',
      address: 'C:\\Windows\\Desktop\\',
      items: [
        { type: 'lnk', icon: '🖥️', label: 'My Computer',       action: 'projects',    desc: 'Shortcut' },
        { type: 'lnk', icon: '📝', label: 'About Me',           action: 'about',       desc: 'Shortcut' },
        { type: 'lnk', icon: '📧', label: 'Contact',            action: 'contact',     desc: 'Shortcut' },
        { type: 'lnk', icon: '🖥️', label: 'MS-DOS Prompt',      action: 'terminal',    desc: 'Shortcut' },
        { type: 'lnk', icon: '🎮', label: 'Pong.exe',           action: 'pong',        desc: 'Shortcut' },
        { type: 'lnk', icon: '💣', label: 'Minesweeper',        action: 'minesweeper', desc: 'Shortcut' },
        { type: 'lnk', icon: '🗑️', label: 'Recycle Bin',        action: 'recycle',     desc: 'Shortcut' },
        { type: 'lnk', icon: '🌐', label: 'Internet Explorer',  action: 'ie',          desc: 'Shortcut' },
      ]
    },
    projects: {
      label: 'Projects',
      address: 'C:\\My Documents\\Projects\\',
      items: [
        { type: 'folder', icon: '📁', label: 'Solceller Sverige',  path: 'proj_solceller' },
        { type: 'folder', icon: '📁', label: 'Lecler Masks',       path: 'proj_lecler' },
        { type: 'folder', icon: '📁', label: 'Metalo Darbai',      path: 'proj_metalo' },
        { type: 'folder', icon: '📁', label: 'Apartamentai',       path: 'proj_apartamentai' },
      ]
    },
    windows_folder: {
      label: 'Windows',
      address: 'C:\\Windows\\',
      items: [
        { type: 'folder', icon: '📁', label: 'System32',   path: 'system32' },
        { type: 'folder', icon: '📁', label: 'Desktop',    path: 'desktop' },
        { type: 'exe',    icon: '💀', label: 'Terminate.exe', action: 'bsod', desc: 'Do not open' },
      ]
    },
    system32: {
      label: 'System32',
      address: 'C:\\Windows\\System32\\',
      items: [
        { type: 'sys', icon: '⚙️', label: 'kernel32.dll',   desc: 'System file' },
        { type: 'sys', icon: '⚙️', label: 'user32.dll',     desc: 'System file' },
        { type: 'sys', icon: '⚙️', label: 'portfolio95.sys',desc: 'Portfolio OS core' },
        { type: 'sys', icon: '⚙️', label: 'skills.dll',     desc: 'Skill library' },
        { type: 'exe', icon: '💀', label: 'delete_me.exe',  action: 'bsod', desc: 'WARNING' },
      ]
    },
    proj_solceller: {
      label: 'Solceller Sverige',
      address: 'C:\\My Documents\\Projects\\Solceller Sverige\\',
      items: [
        { type: 'txt', icon: '📄', label: 'README.txt',     desc: 'Solar panel landing page — Sweden' },
        { type: 'txt', icon: '📄', label: 'tech-stack.txt', desc: 'HTML, CSS, WordPress' },
        { type: 'url', icon: '🌐', label: 'Live Site.url',  url: 'https://solcellersverige.se', desc: 'Open in IE' },
      ]
    },
    proj_lecler: {
      label: 'Lecler Masks',
      address: 'C:\\My Documents\\Projects\\Lecler Masks\\',
      items: [
        { type: 'txt', icon: '📄', label: 'README.txt',     desc: 'Premium beauty e-commerce' },
        { type: 'txt', icon: '📄', label: 'tech-stack.txt', desc: 'WordPress, WooCommerce, PHP' },
        { type: 'url', icon: '🌐', label: 'Live Site.url',  url: 'https://leclermasks.com', desc: 'Open in IE' },
      ]
    },
    proj_metalo: {
      label: 'Metalo Darbai',
      address: 'C:\\My Documents\\Projects\\Metalo Darbai\\',
      items: [
        { type: 'txt', icon: '📄', label: 'README.txt',     desc: 'Metal fabrication services' },
        { type: 'txt', icon: '📄', label: 'tech-stack.txt', desc: 'HTML, CSS, JavaScript' },
        { type: 'url', icon: '🌐', label: 'Live Site.url',  url: 'https://metalodarbai.lt', desc: 'Open in IE' },
      ]
    },
    proj_apartamentai: {
      label: 'Apartamentai',
      address: 'C:\\My Documents\\Projects\\Apartamentai\\',
      items: [
        { type: 'txt', icon: '📄', label: 'README.txt',     desc: 'Apartment rental platform' },
        { type: 'txt', icon: '📄', label: 'tech-stack.txt', desc: 'HTML, CSS, JavaScript' },
        { type: 'url', icon: '🌐', label: 'Live Site.url',  url: 'https://apartamentai.lt', desc: 'Open in IE' },
      ]
    },
  },

  init() {
    this.setupTreeClicks();
    this.setupNavButtons();
    this.navigate('root');
  },

  navigate(path) {
    const dir = this.fs[path];
    if (!dir) return;

    // Update history
    if (this.history[this.historyIndex] !== path) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(path);
      this.historyIndex = this.history.length - 1;
    }

    this.renderContent(path, dir);
    this.updateUI(path, dir);
  },

  renderContent(path, dir) {
    const panel = document.getElementById('explorer-content');
    if (!panel) return;

    panel.innerHTML = '';

    dir.items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'explorer-item';
      el.innerHTML = `<span class="explorer-item-icon">${item.icon}</span><span class="explorer-item-label">${item.label}</span>`;
      el.title = item.desc || item.label;

      let clickTimer = null;

      el.addEventListener('click', () => {
        // Single click: select
        document.querySelectorAll('.explorer-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');

        const status = document.getElementById('explorer-status');
        if (status) status.textContent = item.desc || item.label;

        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
          this.openItem(item);
        } else {
          clickTimer = setTimeout(() => { clickTimer = null; }, 300);
        }
      });

      el.addEventListener('dblclick', () => {
        if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
        this.openItem(item);
      });

      panel.appendChild(el);
    });
  },

  openItem(item) {
    if (item.path) {
      // Navigate into folder
      this.navigate(item.path);
    } else if (item.action) {
      if (item.action === 'bsod') {
        if (typeof EasterEggs !== 'undefined') EasterEggs.showBSOD();
      } else {
        WindowManager.open(item.action);
      }
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener');
    }
  },

  updateUI(path, dir) {
    // Address bar
    const addr = document.getElementById('explorer-address');
    if (addr) addr.value = dir.address || path;

    // Title
    const title = document.getElementById('explorer-title');
    if (title) title.textContent = dir.label || path;

    // Status bar
    const status = document.getElementById('explorer-status');
    if (status) status.textContent = `${dir.items.length} object(s)`;

    // Highlight tree item
    document.querySelectorAll('.tree-item').forEach(t => {
      t.classList.toggle('selected', t.dataset.path === path);
    });

    // Nav buttons
    const backBtn = document.getElementById('explorer-back');
    const fwdBtn  = document.getElementById('explorer-forward');
    if (backBtn) backBtn.disabled = this.historyIndex <= 0;
    if (fwdBtn)  fwdBtn.disabled  = this.historyIndex >= this.history.length - 1;
  },

  setupTreeClicks() {
    document.querySelectorAll('.tree-item').forEach(item => {
      item.addEventListener('click', () => {
        const path = item.dataset.path;
        if (path) this.navigate(path);
      });
    });
  },

  setupNavButtons() {
    const backBtn = document.getElementById('explorer-back');
    const fwdBtn  = document.getElementById('explorer-forward');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          const path = this.history[this.historyIndex];
          const dir = this.fs[path];
          if (dir) { this.renderContent(path, dir); this.updateUI(path, dir); }
        }
      });
    }

    if (fwdBtn) {
      fwdBtn.addEventListener('click', () => {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          const path = this.history[this.historyIndex];
          const dir = this.fs[path];
          if (dir) { this.renderContent(path, dir); this.updateUI(path, dir); }
        }
      });
    }
  }
};
