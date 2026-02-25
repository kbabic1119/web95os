/* ============================================
   Easter Eggs: BSOD, Konami Code, Matrix Rain
   ============================================ */

const EasterEggs = {
  konamiSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
  konamiIndex: 0,

  init() {
    this.setupKonamiCode();
    this.setupBSOD();
    this.setupDialup();
  },

  /* ============================================
     BSOD (Blue Screen of Death)
     ============================================ */
  setupBSOD() {
    const bsod = document.getElementById('bsod-screen');
    if (!bsod) return;

    const dismiss = (e) => {
      if (!bsod.classList.contains('hidden')) {
        e.preventDefault();
        bsod.classList.add('hidden');
      }
    };

    bsod.addEventListener('click', dismiss);
    document.addEventListener('keydown', (e) => {
      if (!bsod.classList.contains('hidden')) {
        dismiss(e);
      }
    });
  },

  showBSOD() {
    const bsod = document.getElementById('bsod-screen');
    if (bsod) {
      bsod.classList.remove('hidden');
    }
    if (typeof Clippy !== 'undefined') Clippy.onBSOD();
  },

  /* ============================================
     Konami Code → Matrix Rain
     ============================================ */
  setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === this.konamiSequence[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.konamiIndex = 0;
          this.startMatrixRain();
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  },

  /* ============================================
     Matrix Rain Effect
     ============================================ */
  startMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '20000';
    canvas.style.opacity = '1';
    canvas.style.transition = 'opacity 1s ease';

    const ctx = canvas.getContext('2d');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    // Characters: Katakana + Latin
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

    let frameCount = 0;
    const maxFrames = 300; // ~5 seconds at 60fps

    const drawMatrix = () => {
      // Semi-transparent black to create fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Brighten the leading character
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#FFF';
        } else {
          ctx.fillStyle = '#0F0';
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frameCount++;

      if (frameCount < maxFrames) {
        requestAnimationFrame(drawMatrix);
      } else {
        // Fade out
        canvas.style.opacity = '0';
        setTimeout(() => {
          canvas.classList.add('hidden');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1000);
      }
    };

    // Initial black fill
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix();
  },

  /* ============================================
     Dial-up Modem Connection
     ============================================ */
  setupDialup() {
    const icon = document.querySelector('[data-action="dialup"]');
    if (!icon) return;

    const trigger = () => this.triggerDialup();

    icon.addEventListener('click', trigger);
    icon.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  },

  triggerDialup() {
    const overlay = document.getElementById('dialup-overlay');
    if (!overlay) return;

    overlay.classList.remove('hidden');

    // Generate modem sounds using Web Audio API
    this.generateDialupSound();

    // Close overlay and open IE after 6 seconds
    setTimeout(() => {
      overlay.classList.add('hidden');

      // Open Internet Explorer window
      if (typeof WindowManager !== 'undefined') {
        WindowManager.open('ie');
      }
    }, 6000);
  },

  generateDialupSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Helper function to play a tone
      const playTone = (freq, startTime, duration, volume = 0.15) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.frequency.value = freq;
        osc.type = 'square';
        gain.gain.value = volume;

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // DTMF dial tones (simulating dialing a phone number)
      const dtmfTones = [
        [697, 1209], // 1
        [697, 1336], // 2
        [697, 1477], // 3
        [770, 1209], // 4
        [770, 1336], // 5
        [852, 1209], // 7
      ];

      let time = now + 0.1;
      dtmfTones.forEach((tones) => {
        playTone(tones[0], time, 0.15, 0.08);
        playTone(tones[1], time, 0.15, 0.08);
        time += 0.2;
      });

      // Handshake noise (chaotic high-frequency noise)
      time = now + 1.5;
      for (let i = 0; i < 40; i++) {
        const freq = 1000 + Math.random() * 2500;
        const duration = 0.05 + Math.random() * 0.15;
        playTone(freq, time, duration, 0.05);
        time += duration * 0.5;
      }

      // Final carrier tone (stable connection)
      playTone(2100, time, 1.0, 0.1);
    } catch (e) {
      console.log('Audio playback not supported or blocked:', e);
    }
  }
};
