/* ===================================================
   BLOG SHARED UTILITIES
   Used by both blog.js and blog-post.js
   =================================================== */

/* ── Starfield background (lightweight version) ─── */
export function initNeuralVoidBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const stars = Array.from({ length: 160 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  0.2 + Math.random() * 0.8,
    a:  0.04 + Math.random() * 0.22,
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.1,
    hot: Math.random() < 0.07,
  }));

  let frame = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw() {
    if (reduced) return;
    requestAnimationFrame(draw);
    frame++;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      const twinkle = s.a * (0.6 + 0.4 * Math.sin(frame * 0.018 + s.x));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (s.hot) {
        ctx.fillStyle = `rgba(255,60,30,${twinkle * 1.4})`;
        ctx.shadowColor = 'rgba(255,30,0,0.8)'; ctx.shadowBlur = 5;
      } else {
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`; ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }
  draw();
}

/* ── Nav scroll behaviour ─────────────────────────  */
export function initNavScroll() {
  const nav = document.getElementById('nav');
  const bar = document.getElementById('progress-bar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(5,5,5,0.96)'
      : 'rgba(5,5,5,0.75)';
    if (bar) bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });
}

/* ── Mobile menu ──────────────────────────────────  */
export function initMobileMenu() {
  const btn   = document.getElementById('burger-btn');
  const menu  = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-close');
  if (!btn || !menu) return;

  const openMenu = () => {
    btn.classList.add('open'); menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false'); btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    btn.classList.remove('open'); menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true'); btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  if (close) close.addEventListener('click', closeMenu);
  menu.querySelectorAll('.mobile-menu__link').forEach(l => l.addEventListener('click', closeMenu));
  menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
}
