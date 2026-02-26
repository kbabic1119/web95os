const Snake = {
  canvas: null,
  ctx: null,
  running: false,
  animFrameId: null,
  lastTick: 0,
  tickInterval: 150,
  baseInterval: 150,
  gridSize: 20,
  cellSize: 20,

  snake: [],
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  food: { x: 0, y: 0 },
  score: 0,
  gameOver: false,

  _boundKey: null,

  start() {
    this.canvas = document.getElementById('snake-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this._boundKey = this.onKey.bind(this);
    document.addEventListener('keydown', this._boundKey);

    // Mobile: left/right turn buttons + tap canvas to restart
    if ('ontouchstart' in window) {
      const btnLeft = document.getElementById('snake-btn-left');
      const btnRight = document.getElementById('snake-btn-right');
      if (btnLeft && btnRight) {
        this._snakeTL = (e) => { e.preventDefault(); this.turnLeft(); };
        this._snakeTR = (e) => { e.preventDefault(); this.turnRight(); };
        btnLeft.addEventListener('touchstart', this._snakeTL, { passive: false });
        btnRight.addEventListener('touchstart', this._snakeTR, { passive: false });
      }
      this._snakeTouchRestart = (e) => {
        if (this.gameOver) { e.preventDefault(); this.reset(); }
      };
      this.canvas.addEventListener('touchstart', this._snakeTouchRestart, { passive: false });
    }

    this.reset();
    this.running = true;
    this.animFrameId = requestAnimationFrame(ts => this.loop(ts));
  },

  stop() {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this._boundKey) {
      document.removeEventListener('keydown', this._boundKey);
      this._boundKey = null;
    }
    if (this._snakeTL) {
      const btnLeft = document.getElementById('snake-btn-left');
      const btnRight = document.getElementById('snake-btn-right');
      if (btnLeft) btnLeft.removeEventListener('touchstart', this._snakeTL);
      if (btnRight) btnRight.removeEventListener('touchstart', this._snakeTR);
      this._snakeTL = this._snakeTR = null;
    }
    if (this._snakeTouchRestart) {
      this.canvas.removeEventListener('touchstart', this._snakeTouchRestart);
      this._snakeTouchRestart = null;
    }
  },

  // Rotate 90° counter-clockwise relative to current direction
  turnLeft() {
    const d = this.nextDir;
    const turned = { x: d.y, y: -d.x };
    if (turned.x !== -this.dir.x || turned.y !== -this.dir.y) this.nextDir = turned;
  },

  // Rotate 90° clockwise relative to current direction
  turnRight() {
    const d = this.nextDir;
    const turned = { x: -d.y, y: d.x };
    if (turned.x !== -this.dir.x || turned.y !== -this.dir.y) this.nextDir = turned;
  },

  reset() {
    const mid = Math.floor(this.gridSize / 2);
    this.snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.tickInterval = this.baseInterval;
    this.lastTick = 0;
    this.gameOver = false;
    this.placeFood();
  },

  placeFood() {
    const g = this.gridSize;
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * g), y: Math.floor(Math.random() * g) };
    } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
    this.food = pos;
  },

  loop(ts) {
    if (!this.running) return;
    this.animFrameId = requestAnimationFrame(t => this.loop(t));

    if (!this.gameOver && ts - this.lastTick >= this.tickInterval) {
      this.lastTick = ts;
      this.update();
    }
    this.draw();
  },

  update() {
    this.dir = { ...this.nextDir };
    const head = this.snake[0];
    const newHead = { x: head.x + this.dir.x, y: head.y + this.dir.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= this.gridSize || newHead.y < 0 || newHead.y >= this.gridSize) {
      this.gameOver = true;
      return;
    }

    // Self collision
    if (this.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(newHead);

    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 10;
      this.tickInterval = Math.max(60, this.tickInterval - 2);
      this.placeFood();
    } else {
      this.snake.pop();
    }
  },

  draw() {
    const ctx = this.ctx;
    const c = this.cellSize;
    const g = this.gridSize;
    const w = g * c;
    const h = g * c;

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Grid lines (subtle)
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= g; i++) {
      ctx.beginPath(); ctx.moveTo(i * c, 0); ctx.lineTo(i * c, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * c); ctx.lineTo(w, i * c); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(this.food.x * c + 2, this.food.y * c + 2, c - 4, c - 4);

    // Snake
    this.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#00cc00' : '#007700';
      ctx.fillRect(seg.x * c + 1, seg.y * c + 1, c - 2, c - 2);
    });

    // Score
    ctx.fillStyle = '#00cc00';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText('SCORE: ' + this.score, 6, 16);

    // Game over overlay
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#cc0000';
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', w / 2, h / 2 - 20);

      ctx.fillStyle = '#00cc00';
      ctx.font = 'bold 14px "Courier New", monospace';
      ctx.fillText('SCORE: ' + this.score, w / 2, h / 2 + 10);

      ctx.fillStyle = '#888';
      ctx.font = '11px "Courier New", monospace';
      ctx.fillText('Press ENTER to restart', w / 2, h / 2 + 34);

      ctx.textAlign = 'left';
    }
  },

  onKey(e) {
    const keyMap = {
      ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 }
    };

    if (e.key === 'Enter' && this.gameOver) {
      this.reset();
      return;
    }

    const newDir = keyMap[e.key];
    if (!newDir) return;

    // Prevent arrow keys from scrolling the page
    if (e.key.startsWith('Arrow')) e.preventDefault();

    // Prevent reversing
    if (newDir.x !== -this.dir.x || newDir.y !== -this.dir.y) {
      this.nextDir = newDir;
    }
  }
};
