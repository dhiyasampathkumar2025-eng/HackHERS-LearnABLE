// background.js - Glittering particles for dark rainbow theme (modular)
(function() {
  const NUM_PARTICLES = 60; // Backend can adjust
  const COLORS = [
    '#ff005e', '#ffbe00', '#00ff87', '#00cfff', '#7b2ff2', '#f953c6', '#fff', '#ffe985'
  ];
  const canvas = document.getElementById('glitter-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
  }
  window.addEventListener('resize', resize);
  resize();

  function random(min, max) { return Math.random() * (max - min) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function makeParticle() {
    const size = random(1, 4);
    return {
      x: random(0, w),
      y: random(0, h),
      dx: random(-0.08, 0.08),
      dy: random(-0.04, 0.04),
      size,
      color: pick(COLORS),
      alpha: 0,
      phase: random(0, Math.PI * 2),
      twinkle: random(1.5, 3.5),
      life: random(6, 12),
      age: 0
    };
  }

  let particles = Array.from({length: NUM_PARTICLES}, makeParticle);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      // Twinkle alpha
      p.alpha = 0.5 + 0.5 * Math.sin((Date.now()/1000) * p.twinkle + p.phase);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Move
      p.x += p.dx;
      p.y += p.dy;
      p.age += 0.016;
      // Respawn if out of bounds or old
      if (p.x < -10 || p.x > w+10 || p.y < -10 || p.y > h+10 || p.age > p.life) {
        Object.assign(p, makeParticle());
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();
