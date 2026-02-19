/* ============================================
   Easter Eggs: BSOD, Konami Code, Matrix Rain
   ============================================ */

const EasterEggs = {
  konamiSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
  konamiIndex: 0,

  init() {
    this.setupKonamiCode();
    this.setupBSOD();
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
  }
};
