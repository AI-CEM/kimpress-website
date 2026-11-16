const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================================================
   NEURAL VOID — deep space starfield background
   280 micro-particles drifting through the void
   =================================================== */
function initNeuralVoid() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle definition
  const COUNT = 280;
  const stars = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  0.5 + Math.random() * 1.3,
    a:  0.15 + Math.random() * 0.45,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    hot: Math.random() < 0.12,
  }));

  let frame = 0;

  function draw() {
    if (reduced) return;
    requestAnimationFrame(draw);
    frame++;

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      const twinkle = s.a * (0.7 + 0.3 * Math.sin(frame * 0.026 + s.x));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

      if (s.hot) {
        ctx.fillStyle = `rgba(255, 60, 30, ${twinkle * 1.6})`;
        ctx.shadowColor = 'rgba(255, 30, 0, 0.9)';
        ctx.shadowBlur  = 8;
      } else {
        ctx.fillStyle = `rgba(220, 220, 255, ${twinkle})`;
        ctx.shadowColor = 'rgba(180, 180, 255, 0.4)';
        ctx.shadowBlur  = 3;
      }
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }

  draw();
}

/* ===================================================
   SCROLL REVEAL (IntersectionObserver, no GSAP dep)
   =================================================== */
function initScrollReveal() {
  if (reduced) {
    document.querySelectorAll('.sr,.sr-left').forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.sr,.sr-left').forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initNeuralVoid();
  initScrollReveal();
});
