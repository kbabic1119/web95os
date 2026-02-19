/* ============================================
   Minesweeper Game
   ============================================ */

const Minesweeper = {
  rows: 9,
  cols: 9,
  totalMines: 10,
  grid: [],
  revealed: [],
  flagged: [],
  gameOver: false,
  gameStarted: false,
  timerInterval: null,
  time: 0,
  minesLeft: 10,

  start() {
    this.reset();
    this.buildGrid();
  },

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  reset() {
    this.stop();
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    this.gameOver = false;
    this.gameStarted = false;
    this.time = 0;
    this.minesLeft = this.totalMines;

    this.updateMineCounter();
    this.updateTimer();
    this.setFace('🙂');

    // Setup face button
    const face = document.getElementById('ms-face');
    if (face) {
      face.onclick = () => {
        this.start();
      };
    }
  },

  buildGrid() {
    const gridEl = document.getElementById('ms-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    // Initialize arrays
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      this.revealed[r] = [];
      this.flagged[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = 0;
        this.revealed[r][c] = false;
        this.flagged[r][c] = false;
      }
    }

    // Create cells
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'ms-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        cell.addEventListener('click', (e) => this.handleClick(r, c));
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.handleRightClick(r, c);
        });
        cell.addEventListener('mousedown', () => {
          if (!this.gameOver) this.setFace('😮');
        });
        cell.addEventListener('mouseup', () => {
          if (!this.gameOver) this.setFace('🙂');
        });

        gridEl.appendChild(cell);
      }
    }
  },

  placeMines(firstRow, firstCol) {
    let placed = 0;
    while (placed < this.totalMines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);

      // Don't place mine on first click or adjacent cells
      if (Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1) continue;
      if (this.grid[r][c] === -1) continue;

      this.grid[r][c] = -1;
      placed++;
    }

    // Calculate numbers
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === -1) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc] === -1) {
              count++;
            }
          }
        }
        this.grid[r][c] = count;
      }
    }
  },

  handleClick(r, c) {
    if (this.gameOver || this.flagged[r][c] || this.revealed[r][c]) return;

    // First click: place mines and start timer
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.placeMines(r, c);
      this.startTimer();
    }

    // Hit a mine
    if (this.grid[r][c] === -1) {
      this.revealAll(r, c);
      this.gameOver = true;
      this.setFace('😵');
      this.stop();
      return;
    }

    // Reveal cell(s)
    this.reveal(r, c);
    this.checkWin();
  },

  handleRightClick(r, c) {
    if (this.gameOver || this.revealed[r][c]) return;

    const cell = this.getCell(r, c);
    if (!cell) return;

    if (this.flagged[r][c]) {
      this.flagged[r][c] = false;
      cell.classList.remove('flagged');
      this.minesLeft++;
    } else {
      this.flagged[r][c] = true;
      cell.classList.add('flagged');
      this.minesLeft--;
    }

    this.updateMineCounter();
  },

  reveal(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
    if (this.revealed[r][c] || this.flagged[r][c]) return;

    this.revealed[r][c] = true;
    const cell = this.getCell(r, c);
    if (!cell) return;

    cell.classList.add('revealed');

    const val = this.grid[r][c];
    if (val > 0) {
      const span = document.createElement('span');
      span.className = `ms-num-${val}`;
      span.textContent = val;
      cell.appendChild(span);
    } else if (val === 0) {
      // Recursive reveal for empty cells
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          this.reveal(r + dr, c + dc);
        }
      }
    }
  },

  revealAll(hitRow, hitCol) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.getCell(r, c);
        if (!cell) continue;

        if (this.grid[r][c] === -1) {
          cell.classList.add('revealed');
          if (r === hitRow && c === hitCol) {
            cell.classList.add('mine-hit');
          }
          cell.textContent = '💣';
        }
      }
    }
  },

  checkWin() {
    let unrevealedSafe = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.revealed[r][c] && this.grid[r][c] !== -1) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      this.gameOver = true;
      this.setFace('😎');
      this.stop();

      // Auto-flag remaining mines
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.grid[r][c] === -1 && !this.flagged[r][c]) {
            const cell = this.getCell(r, c);
            if (cell) cell.classList.add('flagged');
          }
        }
      }
      this.minesLeft = 0;
      this.updateMineCounter();
    }
  },

  getCell(r, c) {
    const gridEl = document.getElementById('ms-grid');
    if (!gridEl) return null;
    return gridEl.children[r * this.cols + c];
  },

  setFace(emoji) {
    const face = document.getElementById('ms-face');
    if (face) face.textContent = emoji;
  },

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.time++;
      if (this.time > 999) this.time = 999;
      this.updateTimer();
    }, 1000);
  },

  updateTimer() {
    const el = document.getElementById('ms-timer');
    if (el) el.textContent = String(this.time).padStart(3, '0');
  },

  updateMineCounter() {
    const el = document.getElementById('ms-mines');
    if (el) el.textContent = String(Math.max(0, this.minesLeft)).padStart(3, '0');
  }
};
