// ============================================
// Simple Paint App
// ============================================

class Paint {
  constructor() {
    this.canvas = document.getElementById('paint-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.currentTool = 'brush';
    this.currentColor = '#000000';
    this.currentSize = 5;
    this.lastX = 0;
    this.lastY = 0;
    
    this.init();
  }
  
  init() {
    // Set white background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Setup event listeners
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());
    
    // Tool buttons
    document.getElementById('paint-brush').addEventListener('click', () => this.setTool('brush'));
    document.getElementById('paint-eraser').addEventListener('click', () => this.setTool('eraser'));
    
    // Size buttons
    document.querySelectorAll('.paint-size').forEach(btn => {
      btn.addEventListener('click', (e) => this.setSize(e.target.dataset.size));
    });
    
    // Color buttons
    document.querySelectorAll('.paint-color').forEach(color => {
      color.addEventListener('click', (e) => this.setColor(e.target.dataset.color));
    });
    
    // Action buttons
    document.getElementById('paint-clear').addEventListener('click', () => this.clear());
    document.getElementById('paint-save').addEventListener('click', () => this.save());
  }
  
  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  
  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getPos(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.drawDot(pos.x, pos.y);
  }
  
  draw(e) {
    if (!this.isDrawing) return;
    
    const pos = this.getPos(e);
    
    if (this.currentTool === 'eraser') {
      this.ctx.fillStyle = '#ffffff';
    } else {
      this.ctx.fillStyle = this.currentColor;
    }
    
    // Draw line from last position
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.currentSize;
    this.ctx.strokeStyle = this.ctx.fillStyle;
    this.ctx.stroke();
    
    this.lastX = pos.x;
    this.lastY = pos.y;
  }
  
  drawDot(x, y) {
    if (this.currentTool === 'eraser') {
      this.ctx.fillStyle = '#ffffff';
    } else {
      this.ctx.fillStyle = this.currentColor;
    }
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.currentSize / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  stopDrawing() {
    this.isDrawing = false;
  }
  
  setTool(tool) {
    this.currentTool = tool;
    
    // Update UI
    document.querySelectorAll('.paint-tool').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`paint-${tool}`).classList.add('active');
  }
  
  setSize(size) {
    this.currentSize = parseInt(size);
    
    // Update UI
    document.querySelectorAll('.paint-size').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
  }
  
  setColor(color) {
    this.currentColor = color;
    this.currentTool = 'brush';
    
    // Update UI
    document.querySelectorAll('.paint-color').forEach(c => {
      c.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.paint-tool').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById('paint-brush').classList.add('active');
  }
  
  clear() {
    if (confirm('Clear the canvas?')) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  save() {
    const link = document.createElement('a');
    link.download = 'painting.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

// Initialize Paint when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.paint = new Paint();
});
