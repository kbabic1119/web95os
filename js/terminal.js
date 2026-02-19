/* ============================================
   MS-DOS Terminal Engine
   ============================================ */

const Terminal = {
  history: [],
  historyIndex: -1,

  commands: {
    help() {
      return [
        '<span class="cmd-highlight">Available commands:</span>',
        '',
        '  help          Show this help message',
        '  about         Display information about Kazim',
        '  projects      List all projects',
        '  contact       Show contact information',
        '  skills        List technical skills',
        '  cls           Clear the screen',
        '  dir           List files on desktop',
        '  whoami        Display current user',
        '  date          Show current date and time',
        '  ver           Show system version',
        '  history       Show command history',
        '  sudo hire-me  Try to hire Kazim',
        '  echo [text]   Echo text back',
        '',
        '<span class="cmd-highlight">Secret commands exist... try to find them.</span>'
      ].join('\n');
    },

    about() {
      return [
        '<span class="cmd-highlight">╔════════════════════════════════════╗</span>',
        '<span class="cmd-highlight">║         ABOUT KAZIM               ║</span>',
        '<span class="cmd-highlight">╚════════════════════════════════════╝</span>',
        '',
        '  Name:      Kazim',
        '  Location:  Sweden',
        '  Role:      Web Developer',
        '',
        '  I design and develop professional websites',
        '  for businesses and brands. Specializing in',
        '  landing pages, e-commerce, and corporate',
        '  websites with clean, responsive design.',
        '',
        '  Type <span class="cmd-highlight">projects</span> to see my work.',
        '  Type <span class="cmd-highlight">contact</span> to reach me.'
      ].join('\n');
    },

    projects() {
      return [
        '<span class="cmd-highlight">╔════════════════════════════════════╗</span>',
        '<span class="cmd-highlight">║         MY PROJECTS               ║</span>',
        '<span class="cmd-highlight">╚════════════════════════════════════╝</span>',
        '',
        '  [1] Solceller Sverige',
        '      Solar panel lead generation landing page',
        '      Tech: HTML, CSS, WordPress',
        '',
        '  [2] Lecler Masks',
        '      Premium beauty e-commerce website',
        '      Tech: WordPress, WooCommerce, PHP',
        '',
        '  [3] Metalo Darbai',
        '      Metal fabrication services website',
        '      Tech: HTML, CSS, JavaScript',
        '',
        '  [4] Apartamentai',
        '      Apartment rental platform',
        '      Tech: HTML, CSS, JavaScript',
        '',
        '  <span class="cmd-highlight">4 projects completed | 6+ industries</span>'
      ].join('\n');
    },

    contact() {
      return [
        '<span class="cmd-highlight">╔════════════════════════════════════╗</span>',
        '<span class="cmd-highlight">║         CONTACT                   ║</span>',
        '<span class="cmd-highlight">╚════════════════════════════════════╝</span>',
        '',
        '  Email:     kbabic1119@gmail.com',
        '  Location:  Sweden',
        '  GitHub:    github.com/yourusername',
        '  LinkedIn:  linkedin.com/in/yourusername',
        '',
        '  <span class="cmd-highlight">Open to work and collaboration!</span>'
      ].join('\n');
    },

    skills() {
      return [
        '<span class="cmd-highlight">Technical Skills:</span>',
        '',
        '  Frontend:    HTML/CSS, JavaScript, React',
        '  Backend:     PHP, Node.js, Python',
        '  CMS:         WordPress, WooCommerce',
        '  Tools:       Git, Docker, Figma',
        '  Other:       SEO, Responsive Design',
        '',
        '  <span class="cmd-highlight">Always learning, always building.</span>'
      ].join('\n');
    },

    cls() {
      const output = document.getElementById('terminal-output');
      output.innerHTML = '';
      return null;
    },

    dir() {
      return [
        ' Volume in drive C is PORTFOLIO',
        ' Volume Serial Number is K4Z1-M95',
        '',
        ' Directory of C:\\KAZIM',
        '',
        '02/17/2026  12:00 AM    &lt;DIR&gt;          .',
        '02/17/2026  12:00 AM    &lt;DIR&gt;          ..',
        '02/17/2026  12:00 AM    &lt;DIR&gt;          My Projects',
        '02/17/2026  12:00 AM           1,337   about_me.txt',
        '02/17/2026  12:00 AM             420   contact.txt',
        '02/17/2026  12:00 AM              42   secrets.txt',
        '02/17/2026  12:00 AM          16,384   pong.exe',
        '02/17/2026  12:00 AM    &lt;DIR&gt;          Recycle Bin',
        '               4 File(s)        18,183 bytes',
        '               4 Dir(s)    640,000 bytes free'
      ].join('\n');
    },

    ls() {
      return Terminal.commands.dir();
    },

    whoami() {
      return '<span class="cmd-highlight">Kazim</span> - Web Developer from Sweden';
    },

    date() {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-US');
      return `Current date: ${dateStr}\nCurrent time: ${timeStr}`;
    },

    ver() {
      return [
        '',
        'Portfolio 95 [Version 1.0.2026]',
        '(C) Copyright Kazim Systems, 2026.',
        ''
      ].join('\n');
    },

    history() {
      if (Terminal.history.length === 0) {
        return 'No commands in history.';
      }
      return Terminal.history
        .map((cmd, i) => `  ${String(i + 1).padStart(3)}  ${cmd}`)
        .join('\n');
    },

    'sudo hire-me'() {
      return [
        '',
        '<span class="cmd-highlight">[sudo] password for visitor: ********</span>',
        '',
        'ACCESS GRANTED.',
        '',
        'Initiating hire sequence...',
        '███████████████████████ 100%',
        '',
        '<span class="cmd-highlight">Kazim has been added to your team!</span>',
        '',
        'Just kidding... but you can reach me at:',
        '<span class="cmd-highlight">kbabic1119@gmail.com</span>',
        ''
      ].join('\n');
    },

    'format c:'() {
      if (typeof EasterEggs !== 'undefined') {
        setTimeout(() => EasterEggs.showBSOD(), 500);
      }
      return '<span class="cmd-error">WARNING: ALL DATA ON NON-REMOVABLE DISK DRIVE C: WILL BE LOST!</span>\nProceeding with format...';
    },

    'delete system32'() {
      if (typeof EasterEggs !== 'undefined') {
        setTimeout(() => EasterEggs.showBSOD(), 500);
      }
      return '<span class="cmd-error">Deleting system files...</span>';
    },

    'rm -rf /'() {
      if (typeof EasterEggs !== 'undefined') {
        setTimeout(() => EasterEggs.showBSOD(), 500);
      }
      return '<span class="cmd-error">Nice try.</span>';
    },

    exit() {
      setTimeout(() => {
        WindowManager.close('terminal');
      }, 300);
      return 'Closing terminal...';
    }
  },

  init() {
    const input = document.getElementById('terminal-input');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = input.value.trim();
        if (cmd) {
          this.execute(cmd);
          this.history.push(cmd);
          this.historyIndex = this.history.length;
        }
        input.value = '';
      }

      // History navigation
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          input.value = this.history[this.historyIndex];
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          input.value = '';
        }
      }
    });

    // Click on terminal focuses input
    const terminal = document.getElementById('terminal');
    if (terminal) {
      terminal.addEventListener('click', () => input.focus());
    }
  },

  execute(rawCmd) {
    const output = document.getElementById('terminal-output');
    const cmd = rawCmd.toLowerCase().trim();

    // Echo the command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'cmd-input-echo';
    cmdLine.textContent = `C:\\KAZIM>${rawCmd}`;
    output.appendChild(cmdLine);

    // Handle echo command
    if (cmd.startsWith('echo ')) {
      const text = rawCmd.substring(5);
      this.appendOutput(output, text);
      this.scrollToBottom();
      return;
    }

    // Handle type/cat commands
    if (cmd.startsWith('type ') || cmd.startsWith('cat ')) {
      const filename = cmd.split(' ')[1];
      this.handleFileRead(output, filename);
      this.scrollToBottom();
      return;
    }

    // Look up command
    let response;
    if (this.commands[cmd]) {
      response = this.commands[cmd]();
    } else {
      response = `'${rawCmd}' is not recognized as an internal or external command,\noperable program or batch file.`;
    }

    // Output response
    if (response !== null && response !== undefined) {
      this.appendOutput(output, response);
    }

    this.scrollToBottom();
  },

  handleFileRead(output, filename) {
    const files = {
      'about.txt': () => this.commands.about(),
      'about_me.txt': () => this.commands.about(),
      'contact.txt': () => this.commands.contact(),
      'secrets.txt': () => [
        '',
        '<span class="cmd-highlight" style="color:#00FF00">CLASSIFIED DOCUMENT</span>',
        '<span class="cmd-highlight" style="color:#00FF00">CLEARANCE LEVEL: VISITOR</span>',
        '',
        '<span style="color:#00FF00">We\'re living in a simulation.</span>',
        '<span style="color:#00FF00">Everything is not real...</span>',
        '<span style="color:#00FF00">or real as much as you think it is.</span>',
        '',
        '<span style="color:#00FF00">Isn\'t it, Mr. Anderson?</span>',
        '',
        '<span style="color:#00FF00">FOLLOW THE WHITE RABBIT_</span>',
        ''
      ].join('\n')
    };

    if (files[filename]) {
      this.appendOutput(output, files[filename]());
    } else {
      this.appendOutput(output, `File not found - ${filename}`);
    }
  },

  appendOutput(output, html) {
    const div = document.createElement('div');
    div.className = 'cmd-response';
    div.innerHTML = html;
    output.appendChild(div);
  },

  scrollToBottom() {
    const output = document.getElementById('terminal-output');
    output.scrollTop = output.scrollHeight;
  }
};
