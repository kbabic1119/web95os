const SpaceInvaders = {
  canvas: null,
  ctx: null,
  running: false,
  animFrameId: null,
  lastTs: 0,

  // Game state
  aliens: [],
  player: { x: 184, y: 344, w: 32, h: 16 },
  bullets: [],
  score: 0,
  lives: 3,
  wave: 1,
  gameOver: false,
  won: false,

  // Alien movement
  alienDir: 1,
  alienStepTimer: 0,
  alienStepInterval: 2800,
  alienShootTimer: 0,
  alienShootInterval: 1500,

  // Auto-fire
  fireTimer: 0,
  fireInterval: 100,

  // Input
  _keys: {},
  _boundKeyDown: null,
  _boundKeyUp: null,

  // Canvas dimensions
  W: 400,
  H: 380,

  start() {
    this.canvas = document.getElementById('si-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this._boundKeyDown = (e) => this.onKeyDown(e);
    this._boundKeyUp = (e) => this.onKeyUp(e);
    document.addEventListener('keydown', this._boundKeyDown);
    document.addEventListener('keyup', this._boundKeyUp);

    // Mobile: auto-fire and button controls
    if ('ontouchstart' in window) {
      this._keys[' '] = true;

      const btnLeft = document.getElementById('si-btn-left');
      const btnRight = document.getElementById('si-btn-right');
      if (btnLeft && btnRight) {
        this._siTL = () => { this._keys['ArrowLeft'] = true; };
        this._siTLE = () => { this._keys['ArrowLeft'] = false; };
        this._siTR = () => { this._keys['ArrowRight'] = true; };
        this._siTRE = () => { this._keys['ArrowRight'] = false; };
        btnLeft.addEventListener('touchstart', this._siTL, { passive: true });
        btnLeft.addEventListener('touchend', this._siTLE);
        btnRight.addEventListener('touchstart', this._siTR, { passive: true });
        btnRight.addEventListener('touchend', this._siTRE);
      }

      this._siTouchRestart = (e) => {
        if (this.gameOver) { e.preventDefault(); this.reset(); }
      };
      this.canvas.addEventListener('touchstart', this._siTouchRestart, { passive: false });
    }

    this.reset();
    this.running = true;
    this.lastTs = 0;
    this.animFrameId = requestAnimationFrame(ts => this.loop(ts));
  },

  stop() {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this._boundKeyDown) {
      document.removeEventListener('keydown', this._boundKeyDown);
      this._boundKeyDown = null;
    }
    if (this._boundKeyUp) {
      document.removeEventListener('keyup', this._boundKeyUp);
      this._boundKeyUp = null;
    }
    if (this._siTL) {
      const btnLeft = document.getElementById('si-btn-left');
      const btnRight = document.getElementById('si-btn-right');
      if (btnLeft) { btnLeft.removeEventListener('touchstart', this._siTL); btnLeft.removeEventListener('touchend', this._siTLE); }
      if (btnRight) { btnRight.removeEventListener('touchstart', this._siTR); btnRight.removeEventListener('touchend', this._siTRE); }
      this._siTL = this._siTLE = this._siTR = this._siTRE = null;
    }
    if (this._siTouchRestart) {
      this.canvas.removeEventListener('touchstart', this._siTouchRestart);
      this._siTouchRestart = null;
    }
    this._keys = {};
  },

  reset() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.gameOver = false;
    this.won = false;
    this.alienDir = 1;
    this.alienStepTimer = 0;
    this.alienStepInterval = 2800;
    this.alienShootTimer = 0;
    this.fireTimer = 0;
    this.alienShootInterval = 1500;
    this.bullets = [];
    this.player.x = (this.W - this.player.w) / 2;
    this._buildAliens();
  },

  _buildAliens() {
    this.aliens = [];
    const cols = 11, rows = 5;
    const cellW = 36, cellH = 28;
    const startX = 4, startY = 52;
    for (let r = 0; r < rows; r++) {
      // type: row 0 = squid (10pts), rows 1-2 = crab (20pts), rows 3-4 = octopus (30pts)
      const type = r === 0 ? 0 : r <= 2 ? 1 : 2;
      for (let c = 0; c < cols; c++) {
        this.aliens.push({
          x: startX + c * cellW,
          y: startY + r * cellH,
          type,
          alive: true,
        });
      }
    }
    // Adjust step interval for current wave
    const speedBoost = (this.wave - 1) * 150;
    this.alienStepInterval = Math.max(200, 2800 - speedBoost);
    this.alienShootInterval = Math.max(400, 1500 - (this.wave - 1) * 100);
  },

  nextWave() {
    this.wave++;
    this.alienDir = 1;
    this.alienStepTimer = 0;
    this.alienShootTimer = 0;
    this.bullets = [];
    this.player.x = (this.W - this.player.w) / 2;
    this._buildAliens();
  },

  loop(ts) {
    if (!this.running) return;
    this.animFrameId = requestAnimationFrame(t => this.loop(t));

    const dt = this.lastTs ? Math.min(ts - this.lastTs, 50) : 16;
    this.lastTs = ts;

    if (!this.gameOver) {
      this.update(dt);
    }
    this.draw();
  },

  update(dt) {
    const p = this.player;
    const speed = 3;

    // Move player
    if ((this._keys['ArrowLeft'] || this._keys['a'] || this._keys['A']) && p.x > 0) {
      p.x = Math.max(0, p.x - speed);
    }
    if ((this._keys['ArrowRight'] || this._keys['d'] || this._keys['D']) && p.x + p.w < this.W) {
      p.x = Math.min(this.W - p.w, p.x + speed);
    }

    // Auto-fire when Space held
    this.fireTimer += dt;
    if (this._keys[' '] && this.fireTimer >= this.fireInterval) {
      this.fireTimer = 0;
      if (this.bullets.filter(b => !b.isAlien).length < 3) {
        this.bullets.push({ x: this.player.x + this.player.w / 2, y: this.player.y - 8, isAlien: false });
      }
    }

    // Move bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.y += b.isAlien ? 4 : -14;
      if (b.y < 0 || b.y > this.H) {
        this.bullets.splice(i, 1);
      }
    }

    // Alien step
    this.alienStepTimer += dt;
    if (this.alienStepTimer >= this.alienStepInterval) {
      this.alienStepTimer = 0;
      this._stepAliens();
    }

    // Alien shoot
    this.alienShootTimer += dt;
    if (this.alienShootTimer >= this.alienShootInterval) {
      this.alienShootTimer = 0;
      this._alienShoot();
    }

    // Bullet collisions
    this._checkCollisions();

    // Win: all aliens dead
    if (this.aliens.every(a => !a.alive)) {
      this.nextWave();
    }
  },

  _stepAliens() {
    const alive = this.aliens.filter(a => a.alive);
    if (alive.length === 0) return;

    const xs = alive.map(a => a.x);
    const rightEdge = Math.max(...xs) + 24; // alien width ~24px
    const leftEdge = Math.min(...xs);

    let drop = false;
    if (this.alienDir === 1 && rightEdge + 8 >= this.W) {
      this.alienDir = -1;
      drop = true;
    } else if (this.alienDir === -1 && leftEdge - 8 <= 0) {
      this.alienDir = 1;
      drop = true;
    }

    for (const a of this.aliens) {
      if (!a.alive) continue;
      if (drop) {
        a.y += 16;
      } else {
        a.x += this.alienDir * 4;
      }
    }

    // Check if any alien reached the player line
    if (alive.some(a => a.y + 16 >= this.player.y)) {
      this.gameOver = true;
    }
  },

  _alienShoot() {
    const alienBullets = this.bullets.filter(b => b.isAlien);
    if (alienBullets.length >= 3) return;

    // Find bottom-most alive alien in a random column
    const cols = {};
    for (const a of this.aliens) {
      if (!a.alive) continue;
      const col = Math.round(a.x / 36);
      if (!cols[col] || a.y > cols[col].y) cols[col] = a;
    }
    const shooters = Object.values(cols);
    if (shooters.length === 0) return;

    const shooter = shooters[Math.floor(Math.random() * shooters.length)];
    this.bullets.push({ x: shooter.x + 10, y: shooter.y + 16, isAlien: true });
  },

  _checkCollisions() {
    const p = this.player;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];

      if (!b.isAlien) {
        // Player bullet vs aliens
        for (const a of this.aliens) {
          if (!a.alive) continue;
          if (b.x >= a.x && b.x <= a.x + 24 && b.y >= a.y && b.y <= a.y + 16) {
            a.alive = false;
            this.bullets.splice(i, 1);
            const points = a.type === 0 ? 10 : a.type === 1 ? 20 : 30;
            this.score += points;
            // Speed up aliens
            this.alienStepInterval = Math.max(150, this.alienStepInterval - 10);
            this.alienShootInterval = Math.max(400, this.alienShootInterval - 15);
            break;
          }
        }
      } else {
        // Alien bullet vs player
        if (b.x >= p.x && b.x <= p.x + p.w && b.y >= p.y && b.y <= p.y + p.h) {
          this.bullets.splice(i, 1);
          this.lives--;
          if (this.lives <= 0) {
            this.gameOver = true;
          } else {
            p.x = (this.W - p.w) / 2;
          }
        }
      }
    }
  },

  draw() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // HUD
    ctx.fillStyle = '#00cc00';
    ctx.font = 'bold 11px "Courier New", monospace';
    const hearts = '♥'.repeat(this.lives) + '♡'.repeat(Math.max(0, 3 - this.lives));
    const score4 = String(this.score).padStart(4, '0');
    ctx.fillText(`SCORE: ${score4}`, 6, 14);
    ctx.textAlign = 'center';
    ctx.fillText(hearts, W / 2, 14);
    ctx.textAlign = 'right';
    ctx.fillText(`WAVE: ${this.wave}`, W - 6, 14);
    ctx.textAlign = 'left';

    // Separator line
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(W, 18); ctx.stroke();

    // Aliens
    for (const a of this.aliens) {
      if (!a.alive) continue;
      this._drawAlien(ctx, a.x, a.y, a.type);
    }

    // Player cannon
    this._drawPlayer(ctx, this.player.x, this.player.y);

    // Bullets
    for (const b of this.bullets) {
      ctx.fillStyle = b.isAlien ? '#ff4444' : '#ffffff';
      ctx.fillRect(b.x - 1, b.y, 2, 8);
    }

    // Ground line
    ctx.fillStyle = '#00cc00';
    ctx.fillRect(0, H - 4, W, 2);

    // Overlays
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#cc0000';
      ctx.font = 'bold 26px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 22);

      ctx.fillStyle = '#00cc00';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillText(`SCORE: ${this.score}`, W / 2, H / 2 + 8);

      ctx.fillStyle = '#888';
      ctx.font = '11px "Courier New", monospace';
      ctx.fillText('Press ENTER to restart', W / 2, H / 2 + 32);
      ctx.textAlign = 'left';
    }
  },

  _drawAlien(ctx, x, y, type) {
    if (type === 0) {
      // Squid — narrow top, two antennas
      ctx.fillStyle = '#00ccff';
      ctx.fillRect(x + 8, y, 8, 4);       // head
      ctx.fillRect(x + 4, y + 4, 16, 8);  // body
      ctx.fillRect(x, y + 8, 6, 4);       // left arm
      ctx.fillRect(x + 18, y + 8, 6, 4);  // right arm
      ctx.fillRect(x + 4, y + 12, 4, 4);  // left leg
      ctx.fillRect(x + 16, y + 12, 4, 4); // right leg
    } else if (type === 1) {
      // Crab — wide claws
      ctx.fillStyle = '#cc88ff';
      ctx.fillRect(x + 6, y, 12, 4);      // head
      ctx.fillRect(x + 2, y + 4, 20, 8);  // body
      ctx.fillRect(x, y + 6, 4, 6);       // left claw
      ctx.fillRect(x + 20, y + 6, 4, 6);  // right claw
      ctx.fillRect(x + 2, y + 12, 6, 4);  // left leg
      ctx.fillRect(x + 16, y + 12, 6, 4); // right leg
    } else {
      // Octopus — rounded with many legs
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(x + 4, y, 16, 4);      // top
      ctx.fillRect(x + 2, y + 4, 20, 8);  // body
      ctx.fillRect(x, y + 8, 4, 4);       // left bump
      ctx.fillRect(x + 20, y + 8, 4, 4);  // right bump
      ctx.fillRect(x + 2, y + 12, 4, 4);  // leg 1
      ctx.fillRect(x + 8, y + 12, 4, 4);  // leg 2
      ctx.fillRect(x + 14, y + 12, 4, 4); // leg 3
      ctx.fillRect(x + 20, y + 12, 4, 4); // leg 4
    }
  },

  _drawPlayer(ctx, x, y) {
    ctx.fillStyle = '#00cc00';
    ctx.fillRect(x + 14, y, 4, 4);        // barrel
    ctx.fillRect(x + 10, y + 4, 12, 4);   // turret
    ctx.fillRect(x, y + 8, 32, 8);        // base
  },

  onKeyDown(e) {
    this._keys[e.key] = true;

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && !this.gameOver) {
      // Fire — max 3 player bullets on screen
      if (this.bullets.filter(b => !b.isAlien).length < 3) {
        this.bullets.push({ x: this.player.x + this.player.w / 2, y: this.player.y - 8, isAlien: false });
      }
    }

    if (e.key === 'Enter' && this.gameOver) {
      this.reset();
    }
  },

  onKeyUp(e) {
    this._keys[e.key] = false;
  },
};
