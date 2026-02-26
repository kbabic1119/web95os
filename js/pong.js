/* ============================================
   Pong Game
   ============================================ */

const Pong = {
  canvas: null,
  ctx: null,
  running: false,
  paused: false,
  animFrameId: null,
  lastTime: 0,
  
  // Game constants - adjusted for delta time
  PADDLE_SPEED: 400, // pixels per second
  BALL_SPEED_X: 300,
  BALL_SPEED_Y: 200,
  MAX_BALL_SPEED: 800,
  AI_SPEED: 250,

  // Game objects
  ball: { x: 320, y: 200, vx: 0, vy: 0, size: 8 },
  playerPaddle: { x: 15, y: 160, width: 10, height: 60 },
  aiPaddle: { x: 615, y: 160, width: 10, height: 60 },
  score: { player: 0, ai: 0 },

  // Input
  keys: {},
  mouseY: null,

  start() {
    this.canvas = document.getElementById('pong-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.reset();
    this.running = true;
    this.paused = false;
    this.lastTime = performance.now();

    // Key handlers
    this._keyDown = (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ') {
        e.preventDefault();
        this.paused = !this.paused;
      }
    };
    this._keyUp = (e) => {
      this.keys[e.key] = false;
    };
    
    // Mouse handler
    this._mouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseY = e.clientY - rect.top;
    };

    document.addEventListener('keydown', this._keyDown);
    document.addEventListener('keyup', this._keyUp);
    // Attach mouse listener to the window so it works even if mouse drifts outside canvas slightly
    // but better to attach to canvas container or document if dragging
    document.addEventListener('mousemove', this._mouseMove);

    // Touch: drag finger on canvas to control paddle (same as mouse)
    this._touchMove = (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const scaleY = this.canvas.height / rect.height;
      this.mouseY = (e.touches[0].clientY - rect.top) * scaleY;
    };
    this._touchEnd = () => { this.mouseY = null; };
    this.canvas.addEventListener('touchstart', this._touchMove, { passive: false });
    this.canvas.addEventListener('touchmove', this._touchMove, { passive: false });
    this.canvas.addEventListener('touchend', this._touchEnd);

    this.loop(performance.now());
  },

  stop() {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    document.removeEventListener('keydown', this._keyDown);
    document.removeEventListener('keyup', this._keyUp);
    document.removeEventListener('mousemove', this._mouseMove);
    if (this._touchMove) {
      this.canvas.removeEventListener('touchstart', this._touchMove);
      this.canvas.removeEventListener('touchmove', this._touchMove);
      this.canvas.removeEventListener('touchend', this._touchEnd);
    }
    this.keys = {};
    this.mouseY = null;
  },

  reset() {
    this.resetBall();
    this.playerPaddle.y = 170;
    this.aiPaddle.y = 170;
    this.score = { player: 0, ai: 0 };
  },

  resetBall() {
    this.ball.x = 320;
    this.ball.y = 200;
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    this.ball.vx = this.BALL_SPEED_X * dirX;
    this.ball.vy = this.BALL_SPEED_Y * dirY;
  },

  loop(currentTime) {
    if (!this.running) return;

    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    if (!this.paused) {
      this.update(deltaTime);
    }
    this.draw();

    this.animFrameId = requestAnimationFrame((time) => this.loop(time));
  },

  update(dt) {
    // Limit delta time to prevent huge jumps if tab was inactive
    if (dt > 0.1) dt = 0.1;

    // Player movement - specific logic for Mouse vs Keyboard
    // If mouse moved recently, use it. Otherwise keys.
    if (this.mouseY !== null) {
        // Center paddle on mouse
        this.playerPaddle.y = this.mouseY - (this.playerPaddle.height / 2);
    } else {
        if (this.keys['w'] || this.keys['W'] || this.keys['ArrowUp']) {
            this.playerPaddle.y -= this.PADDLE_SPEED * dt;
        }
        if (this.keys['s'] || this.keys['S'] || this.keys['ArrowDown']) {
            this.playerPaddle.y += this.PADDLE_SPEED * dt;
        }
    }

    // Clamp player paddle
    this.playerPaddle.y = Math.max(0, Math.min(400 - this.playerPaddle.height, this.playerPaddle.y));

    // AI movement
    const aiCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
    const diff = this.ball.y - aiCenter;
    
    // AI Deadzone to prevent jitter
    if (Math.abs(diff) > 10) {
      const move = Math.sign(diff) * this.AI_SPEED * dt;
      // Don't overshoot
      if (Math.abs(move) > Math.abs(diff)) {
          this.aiPaddle.y += diff;
      } else {
          this.aiPaddle.y += move;
      }
    }
    this.aiPaddle.y = Math.max(0, Math.min(400 - this.aiPaddle.height, this.aiPaddle.y));

    // Ball movement
    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // Ball top/bottom bounce
    if (this.ball.y <= 0) {
        this.ball.y = 0;
        this.ball.vy *= -1;
    } else if (this.ball.y >= 400 - this.ball.size) {
        this.ball.y = 400 - this.ball.size;
        this.ball.vy *= -1;
    }

    // Ball paddle collision - player
    if (this.ball.vx < 0 && // Moving towards player
        this.ball.x <= this.playerPaddle.x + this.playerPaddle.width &&
        this.ball.x + this.ball.size >= this.playerPaddle.x &&
        this.ball.y + this.ball.size >= this.playerPaddle.y &&
        this.ball.y <= this.playerPaddle.y + this.playerPaddle.height) {
            
      this.ball.x = this.playerPaddle.x + this.playerPaddle.width;
      this.ball.vx = Math.abs(this.ball.vx) * 1.1; // Speed up
      
      // Calculate angle
      const hitPos = (this.ball.y + this.ball.size/2 - this.playerPaddle.y) / this.playerPaddle.height;
      // Map 0..1 to -1..1 (approx) for angle
      this.ball.vy = (hitPos - 0.5) * 2 * this.BALL_SPEED_Y * 1.5; 
      
      // Cap speed
      this.ball.vx = Math.min(this.ball.vx, this.MAX_BALL_SPEED);
    }
    
    // Ball paddle collision - AI
    if (this.ball.vx > 0 && // Moving towards AI
        this.ball.x + this.ball.size >= this.aiPaddle.x &&
        this.ball.x <= this.aiPaddle.x + this.aiPaddle.width &&
        this.ball.y + this.ball.size >= this.aiPaddle.y &&
        this.ball.y <= this.aiPaddle.y + this.aiPaddle.height) {

      this.ball.x = this.aiPaddle.x - this.ball.size;
      this.ball.vx = -Math.abs(this.ball.vx) * 1.1;

      const hitPos = (this.ball.y + this.ball.size/2 - this.aiPaddle.y) / this.aiPaddle.height;
      this.ball.vy = (hitPos - 0.5) * 2 * this.BALL_SPEED_Y * 1.5;

       // Cap speed
       this.ball.vx = Math.max(this.ball.vx, -this.MAX_BALL_SPEED);
    }

    // Scoring
    if (this.ball.x < -20) {
      this.score.ai++;
      this.resetBall();
    }
    if (this.ball.x > 660) {
      this.score.player++;
      this.resetBall();
    }
  },

  draw() {
    const ctx = this.ctx;
    const w = 640;
    const h = 400;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // Center dashed line
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Score
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 40px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.score.player, w / 2 - 60, 50);
    ctx.fillText(this.score.ai, w / 2 + 60, 50);

    // Player paddle
    ctx.fillStyle = '#FFF';
    ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);

    // AI paddle
    ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, this.aiPaddle.width, this.aiPaddle.height);

    // Ball
    ctx.fillRect(this.ball.x, this.ball.y, this.ball.size, this.ball.size);

    // Pause overlay
    if (this.paused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.fillText('PAUSED', w / 2, h / 2);
      ctx.font = '14px "Courier New", monospace';
      ctx.fillText('Press SPACE to continue', w / 2, h / 2 + 30);
    }
  }
};
