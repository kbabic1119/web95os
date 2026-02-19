/* ============================================
   Boot Sequence — BIOS POST
   ============================================ */

const Boot = {
  skipped: false,

  biosLines: [
    { text: 'AMIBIOS (C)2026 Kazim Systems Corp.', cls: 'bios-header', delay: 60 },
    { text: '', cls: '', delay: 80 },
    { text: 'BIOS Date: 02/12/26  Ver: 1.0.2026 Rel: 00', cls: '', delay: 60 },
    { text: '', cls: '', delay: 60 },
    { text: 'CPU : Kazim Processor at 133MHz', cls: '', delay: 80 },
    { text: 'Memory Test: ', cls: '', delay: 120, append: '640640K OK', appendCls: 'ok' },
    { text: '', cls: '', delay: 60 },
    { text: 'Detecting Primary Master   ... ', cls: '', delay: 100, append: 'SSD-PORTFOLIO-95', appendCls: 'ok' },
    { text: 'Detecting Primary Slave    ... ', cls: '', delay: 80,  append: 'None', appendCls: '' },
    { text: 'Detecting Secondary Master ... ', cls: '', delay: 80,  append: 'CDROM-SKILLS-v12', appendCls: 'ok' },
    { text: '', cls: '', delay: 60 },
    { text: 'Press DEL to run SETUP, ESC to skip Memory Test', cls: 'warn', delay: 140 },
    { text: '', cls: '', delay: 80 },
    { text: '12 skills detected.  4 projects loaded.', cls: '', delay: 100 },
    { text: '', cls: '', delay: 80 },
    { text: 'Loading Portfolio OS...', cls: 'highlight', delay: 200 },
  ],

  init() {
    const bootScreen   = document.getElementById('boot-screen');
    const bootText     = document.getElementById('boot-text');
    const progressCont = document.getElementById('boot-progress-container');
    const progressBar  = document.getElementById('boot-progress-bar');

    const skip = () => {
      if (this.skipped) return;
      this.skipped = true;
      this.finish(bootScreen);
    };

    document.addEventListener('keydown', skip, { once: false });
    bootScreen.addEventListener('click', skip, { once: false });

    this.runBIOS(bootText, progressCont, progressBar, bootScreen);
  },

  async runBIOS(textEl, progressCont, progressBar, bootScreen) {
    for (const line of this.biosLines) {
      if (this.skipped) return;

      const lineEl = document.createElement('span');
      lineEl.className = 'boot-line';
      if (line.cls) lineEl.classList.add(line.cls);
      lineEl.textContent = line.text;
      textEl.appendChild(lineEl);

      await this.wait(line.delay);
      if (this.skipped) return;

      if (line.append) {
        const span = document.createElement('span');
        span.className = line.appendCls || '';
        span.textContent = line.append;
        lineEl.appendChild(span);
        await this.wait(60);
      }

      textEl.appendChild(document.createTextNode('\n'));
    }

    if (this.skipped) return;

    progressCont.classList.add('visible');
    await this.wait(80);
    if (this.skipped) return;
    progressBar.classList.add('fill');
    await this.wait(700);
    if (this.skipped) return;

    this.finish(bootScreen);
  },

  finish(bootScreen) {
    this.skipped = true;
    bootScreen.classList.add('fade-out');
    setTimeout(() => {
      bootScreen.classList.add('hidden');
      Desktop.show();
    }, 500);
  },

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
