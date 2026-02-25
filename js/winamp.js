/* ============================================
   Winamp 2.x — Classic Music Player
   ============================================ */

const Winamp = {
  audio: null,
  currentTrack: 0,
  tracks: [],
  isPlaying: false,
  visInterval: null,

  start() {
    this.audio = document.getElementById('winamp-audio');
    if (!this.audio) return;
    this.gatherTracks();
    this.attachListeners();
    if (this.tracks.length > 0) this.loadTrack(0);
    this.audio.volume = 0.8;
    const vol = document.getElementById('volume-slider');
    if (vol) vol.value = 80;
    this.startVis();
  },

  stop() {
    if (this.audio) { this.audio.pause(); this.isPlaying = false; }
    this.stopVis();
  },

  gatherTracks() {
    const els = document.querySelectorAll('.playlist-track');
    this.tracks = Array.from(els).map(el => ({
      path: el.dataset.path,
      name: el.querySelector('.track-name').textContent,
      time: el.querySelector('.track-time').textContent,
      element: el,
    }));
  },

  attachListeners() {
    const on = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);

    on('btn-play',   () => this.play());
    on('btn-pause',  () => this.pause());
    on('btn-stop',   () => this.stopTrack());
    on('btn-prev',   () => this.previous());
    on('btn-next',   () => this.next());
    on('btn-eject',  () => {});

    // Toggle buttons
    on('btn-shuffle',  (e) => e.currentTarget.classList.toggle('active'));
    on('btn-repeat',   (e) => e.currentTarget.classList.toggle('active'));
    on('btn-eq-on',    (e) => e.currentTarget.classList.toggle('active'));
    on('btn-eq-auto',  (e) => e.currentTarget.classList.toggle('active'));

    // EQ / PL show/hide
    on('wa-btn-eq-show', () => {
      const eq = document.getElementById('wa-eq');
      if (eq) eq.style.display = eq.style.display === 'none' ? '' : 'none';
    });
    on('wa-btn-pl-show', () => {
      const pl = document.getElementById('wa-pl');
      if (pl) pl.style.display = pl.style.display === 'none' ? '' : 'none';
    });

    // No-op buttons
    ['btn-presets','btn-pl-add','btn-pl-rem','btn-pl-sel','btn-pl-misc','btn-pl-list','btn-pl-opts']
      .forEach(id => on(id, () => {}));

    // Volume
    const vol = document.getElementById('volume-slider');
    if (vol) vol.addEventListener('input', e => { this.audio.volume = e.target.value / 100; });

    // Seek
    const seek = document.getElementById('position-slider');
    if (seek) seek.addEventListener('input', e => {
      if (this.audio.duration) this.audio.currentTime = (e.target.value / 100) * this.audio.duration;
    });

    // Audio events
    this.audio.addEventListener('timeupdate', () => this.updateTime());
    this.audio.addEventListener('ended',      () => this.next());

    // Playlist track clicks
    document.querySelectorAll('.playlist-track').forEach((el, i) => {
      el.addEventListener('click', () => { this.loadTrack(i); this.play(); });
    });
  },

  loadTrack(index) {
    if (index < 0 || index >= this.tracks.length) return;
    this.currentTrack = index;
    const track = this.tracks[index];

    // Fix: set src directly on audio element (not on <source> child)
    this.audio.src = track.path;
    this.audio.load();

    document.querySelectorAll('.playlist-track').forEach((el, i) =>
      el.classList.toggle('active', i === index));

    const title = document.getElementById('track-title');
    if (title) title.textContent = `*** ${index + 1}. ${track.name.toUpperCase()} ***`;

    const plTime = document.getElementById('wa-pl-time');
    if (plTime) plTime.textContent = `-- ${track.time}`;
  },

  play() {
    if (!this.audio.src || this.audio.src === location.href) return;
    this.audio.play()
      .then(() => { this.isPlaying = true; })
      .catch(err => console.log('Winamp play failed:', err));
  },

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  },

  stopTrack() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    const t = document.getElementById('winamp-time');
    if (t) t.textContent = '0:00';
    const s = document.getElementById('position-slider');
    if (s) s.value = 0;
  },

  previous() {
    const i = this.currentTrack > 0 ? this.currentTrack - 1 : this.tracks.length - 1;
    this.loadTrack(i);
    if (this.isPlaying) this.play();
  },

  next() {
    const i = (this.currentTrack + 1) % this.tracks.length;
    this.loadTrack(i);
    if (this.isPlaying) this.play();
  },

  updateTime() {
    if (!this.audio.duration || isNaN(this.audio.duration)) return;
    const t = document.getElementById('winamp-time');
    if (t) t.textContent = this.fmt(this.audio.currentTime);
    const s = document.getElementById('position-slider');
    if (s) s.value = (this.audio.currentTime / this.audio.duration) * 100;
  },

  fmt(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  },

  // Canvas spectrum visualizer
  startVis() {
    const canvas = document.getElementById('wa-vis');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const BARS = 18;
    const heights = new Array(BARS).fill(2);
    const peaks  = new Array(BARS).fill(2);

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      const bw = Math.floor(W / BARS) - 1;
      for (let i = 0; i < BARS; i++) {
        if (this.isPlaying) {
          heights[i] += (Math.random() * 12 - 4);
          heights[i] = Math.max(2, Math.min(H - 2, heights[i]));
          if (heights[i] > peaks[i]) peaks[i] = heights[i];
          else peaks[i] = Math.max(2, peaks[i] - 1);
        } else {
          heights[i] = Math.max(2, heights[i] - 2);
          peaks[i]   = Math.max(2, peaks[i] - 1);
        }

        const bx = i * (bw + 1);
        const bh = heights[i];

        const grad = ctx.createLinearGradient(0, H - bh, 0, H);
        grad.addColorStop(0, '#00ff00');
        grad.addColorStop(0.6, '#00cc00');
        grad.addColorStop(1, '#004400');
        ctx.fillStyle = grad;
        ctx.fillRect(bx, H - bh, bw, bh);

        // Peak dot
        ctx.fillStyle = '#00ff44';
        ctx.fillRect(bx, H - peaks[i] - 1, bw, 2);
      }
    };

    this.visInterval = setInterval(draw, 50);
  },

  stopVis() {
    if (this.visInterval) { clearInterval(this.visInterval); this.visInterval = null; }
    const canvas = document.getElementById('wa-vis');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  },
};
