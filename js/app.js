/* ============================================
   App - Main Orchestrator
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize easter eggs (needs to listen from start)
  EasterEggs.init();

  // Initialize terminal (event listeners)
  Terminal.init();

  // Initialize Clippy (will auto-show 10s after desktop loads)
  Clippy.init();

  // Start boot sequence
  Boot.init();
});
