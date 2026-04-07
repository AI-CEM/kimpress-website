import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================================================
   NEURAL VOID — deep space starfield background
   200 micro-particles drifting through the void
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
    r:  0.5 + Math.random() * 1.3,          // radius (bigger)
    a:  0.15 + Math.random() * 0.45,        // base opacity (brighter)
    vx: (Math.random() - 0.5) * 0.22,       // faster drift
    vy: (Math.random() - 0.5) * 0.22,
    // A few brighter "hot" particles
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
      // Drift
      s.x += s.vx;
      s.y += s.vy;
      // Wrap
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      // Twinkle: slightly faster sine variation
      const twinkle = s.a * (0.7 + 0.3 * Math.sin(frame * 0.026 + s.x));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

      if (s.hot) {
        // Red-tinted hot particle
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

    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  }

  draw();
}


/* ===================================================
   SYNTHETIC MIND — how an AI visualises itself
   Geodesic crystal · Synaptic firing · Data streams
   Depth shading · Scanline · Glitch · Breathing
   =================================================== */
function initSyntheticMind() {
  const canvas = document.getElementById('head-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const ICO_DETAIL  = 2;    // 320 faces, ~162 unique verts
  const ICO_RADIUS  = 1.12;
  const ROT_SPEED   = 0.0020;
  const PULSE_COUNT = 14;
  const TRAIL_LEN   = 5;

  // ── Renderer ───────────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.2;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  function resize() {
    const s = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight) || 500;
    renderer.setSize(s, s);
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);
  const group = new THREE.Group();
  scene.add(group);

  // ── Glow texture ───────────────────────────────────
  function makeGlowTex() {
    const sz = 64, h = sz / 2;
    const c = document.createElement('canvas');
    c.width = c.height = sz;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(h, h, 0, h, h, h);
    g.addColorStop(0,   'rgba(255,100,100,1)');
    g.addColorStop(0.4, 'rgba(255, 30, 30,0.6)');
    g.addColorStop(1,   'rgba(255,  0,  0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, sz, sz);
    return new THREE.CanvasTexture(c);
  }
  const glowTex = makeGlowTex();

  // ── Icosphere geometry ─────────────────────────────
  const icoGeo  = new THREE.IcosahedronGeometry(ICO_RADIUS, ICO_DETAIL);

  // Layer 1: Face-activation mesh (synaptic glow)
  // IcosahedronGeometry is already non-indexed in Three.js r128
  const flatGeo    = icoGeo;
  const FACE_COUNT = flatGeo.attributes.position.count / 3;  // 320
  const faceColArr  = new Float32Array(FACE_COUNT * 3 * 3);
  const faceColAttr = new THREE.BufferAttribute(faceColArr, 3);
  flatGeo.setAttribute('color', faceColAttr);
  group.add(new THREE.Mesh(flatGeo, new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 1,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  })));

  // Synapse state + fire function
  const faceAct = new Float32Array(FACE_COUNT);
  function fireSynapse() {
    const cf = Math.floor(Math.random() * FACE_COUNT);
    const spread = 2 + Math.floor(Math.random() * 5);
    for (let i = -spread; i <= spread; i++) {
      const fi = (cf + i + FACE_COUNT) % FACE_COUNT;
      faceAct[fi] = Math.max(faceAct[fi], 0.55 + Math.random() * 0.45);
    }
  }

  // Layer 2: Edge wireframe with depth colours
  const edgesGeo    = new THREE.EdgesGeometry(icoGeo);
  const edgePosBase = new Float32Array(edgesGeo.attributes.position.array);
  const edgeColArr  = new Float32Array(edgesGeo.attributes.position.count * 3);
  const edgeColAttr = new THREE.BufferAttribute(edgeColArr, 3);
  edgesGeo.setAttribute('color', edgeColAttr);
  group.add(new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.82,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));

  // Layer 3: Vertex glow particles
  const vertPosBase = new Float32Array(icoGeo.attributes.position.array);
  const vertCount   = icoGeo.attributes.position.count;
  const nodeColArr  = new Float32Array(vertCount * 3);
  const nodeColAttr = new THREE.BufferAttribute(nodeColArr, 3);
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertPosBase), 3));
  nodeGeo.setAttribute('color', nodeColAttr);
  group.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({
    size: 0.052, map: glowTex, vertexColors: true,
    blending: THREE.AdditiveBlending, transparent: true,
    depthWrite: false, sizeAttenuation: true, alphaTest: 0.01,
  })));
  group.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({
    size: 0.12, map: glowTex, vertexColors: true, opacity: 0.13,
    blending: THREE.AdditiveBlending, transparent: true,
    depthWrite: false, sizeAttenuation: true, alphaTest: 0.001,
  })));

  // Layer 4: Data pulse trails along edges
  const rawEdge = edgesGeo.attributes.position.array;
  const edgeList = [];
  for (let i = 0; i < rawEdge.length; i += 6) {
    edgeList.push({ ax: rawEdge[i], ay: rawEdge[i+1], az: rawEdge[i+2],
                    bx: rawEdge[i+3], by: rawEdge[i+4], bz: rawEdge[i+5] });
  }
  const TOTAL_TRAIL = PULSE_COUNT * TRAIL_LEN;
  const trailPosArr  = new Float32Array(TOTAL_TRAIL * 3);
  const trailColArr  = new Float32Array(TOTAL_TRAIL * 3);
  const trailPosAttr = new THREE.BufferAttribute(trailPosArr, 3);
  const trailColAttr = new THREE.BufferAttribute(trailColArr, 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', trailPosAttr);
  trailGeo.setAttribute('color', trailColAttr);
  group.add(new THREE.Points(trailGeo, new THREE.PointsMaterial({
    size: 0.075, map: glowTex, vertexColors: true,
    blending: THREE.AdditiveBlending, transparent: true,
    depthWrite: false, sizeAttenuation: true, alphaTest: 0.001,
  })));
  const pulseState = Array.from({ length: PULSE_COUNT }, () => ({
    edge:  Math.floor(Math.random() * edgeList.length),
    t:     Math.random(),
    speed: 0.007 + Math.random() * 0.011,
    trail: Array.from({ length: TRAIL_LEN }, () => new THREE.Vector3(0, 9999, 0)),
  }));

  // ── Mouse ──────────────────────────────────────────
  const mouse = { x:0, y:0 }, tilt = { x:0, y:0 };
  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.parentElement.getBoundingClientRect();
    mouse.x = (e.clientX-r.left)/r.width  - 0.5;
    mouse.y = (e.clientY-r.top) /r.height - 0.5;
  }, { passive:true });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x=0; mouse.y=0; }, { passive:true });

  // ── Animation ──────────────────────────────────────
  let autoAngle=0, time=0, scanY=-1.3, breathAngle=0, synapseTimer=0.3;
  let glitchTimer=4+Math.random()*3, glitching=false, glitchBudget=0;
  let entranceDone = false;

  function animate() {
    requestAnimationFrame(animate);
    if (!reduced) {
      time += 0.016; autoAngle += ROT_SPEED; breathAngle += 0.006;
      tilt.x += (mouse.x * 0.45 - tilt.x) * 0.05;
      tilt.y += (mouse.y * 0.30 - tilt.y) * 0.05;
      group.rotation.y = autoAngle + tilt.x;
      group.rotation.x = -tilt.y;

      if (entranceDone) group.scale.setScalar(1 + Math.sin(breathAngle) * 0.022);

      scanY += 0.009; if (scanY > 1.4) scanY = -1.4;

      glitchTimer -= 0.016;
      if (glitchTimer <= 0) { glitching=true; glitchBudget=0.07+Math.random()*0.10; glitchTimer=4+Math.random()*5; }
      if (glitching) { glitchBudget-=0.016; if (glitchBudget<=0) glitching=false; }

      synapseTimer -= 0.016;
      if (synapseTimer <= 0) {
        const bursts = 1 + Math.floor(Math.random() * 3);
        for (let b = 0; b < bursts; b++) fireSynapse();
        synapseTimer = 0.22 + Math.random() * 0.7;
      }

      // Precompute rotation matrix
      const ry=group.rotation.y, rx=group.rotation.x;
      const cy=Math.cos(ry), sy=Math.sin(ry), cx=Math.cos(rx), sx=Math.sin(rx);
      const pulse   = 0.82 + Math.sin(time * 1.8) * 0.18;
      const flicker = glitching ? (0.45 + Math.random() * 0.55) : 1.0;

      // Face synaptic decay + colour
      for (let fi = 0; fi < FACE_COUNT; fi++) {
        faceAct[fi] = Math.max(0, faceAct[fi] - 0.022);
        const b = faceAct[fi] * pulse * flicker * 0.48;
        for (let vi = 0; vi < 3; vi++) {
          const idx = (fi * 3 + vi) * 3;
          faceColArr[idx]=b; faceColArr[idx+1]=b*0.12; faceColArr[idx+2]=b*0.04;
        }
      }
      faceColAttr.needsUpdate = true;

      // Edge depth + scanline colours
      const EV = edgeColArr.length / 3;
      for (let v = 0; v < EV; v++) {
        const bx=edgePosBase[v*3], by=edgePosBase[v*3+1], bz=edgePosBase[v*3+2];
        const wx1=bx*cy+bz*sy, wz1=-bx*sy+bz*cy;
        const wy=by*cx-wz1*sx, wz=by*sx+wz1*cx;
        const depth=0.15+(wz/ICO_RADIUS+1)*0.5*0.75;
        const scan =Math.max(0,1-Math.abs(wy-scanY)*8)*1.2;
        const br=Math.min(1,(depth+scan*1.4)*pulse*flicker);
        edgeColArr[v*3]=br; edgeColArr[v*3+1]=br*Math.min(1,scan*0.45); edgeColArr[v*3+2]=br*Math.min(1,scan*0.18);
      }
      edgeColAttr.needsUpdate = true;

      // Node colours
      for (let v = 0; v < vertCount; v++) {
        const bx=vertPosBase[v*3], by=vertPosBase[v*3+1], bz=vertPosBase[v*3+2];
        const wx1=bx*cy+bz*sy, wz1=-bx*sy+bz*cy;
        const wy=by*cx-wz1*sx, wz=by*sx+wz1*cx;
        const depth=0.15+(wz/ICO_RADIUS+1)*0.5*0.75;
        const scan =Math.max(0,1-Math.abs(wy-scanY)*8)*1.2;
        const br=Math.min(1,(depth+scan*1.4)*pulse*flicker);
        nodeColArr[v*3]=br; nodeColArr[v*3+1]=br*Math.min(1,scan*0.45); nodeColArr[v*3+2]=br*Math.min(1,scan*0.18);
      }
      nodeColAttr.needsUpdate = true;

      // Pulse trails
      pulseState.forEach((p, pi) => {
        for (let t = TRAIL_LEN-1; t > 0; t--) p.trail[t].copy(p.trail[t-1]);
        p.t += p.speed;
        if (p.t >= 1) { p.t=0; p.edge=Math.floor(Math.random()*edgeList.length); }
        const e = edgeList[p.edge];
        p.trail[0].set(e.ax+(e.bx-e.ax)*p.t, e.ay+(e.by-e.ay)*p.t, e.az+(e.bz-e.az)*p.t);
        for (let t = 0; t < TRAIL_LEN; t++) {
          const idx = (pi*TRAIL_LEN+t)*3, fade = 1-t/TRAIL_LEN;
          trailPosArr[idx]=p.trail[t].x; trailPosArr[idx+1]=p.trail[t].y; trailPosArr[idx+2]=p.trail[t].z;
          trailColArr[idx]=fade; trailColArr[idx+1]=fade*0.35; trailColArr[idx+2]=fade*0.12;
        }
      });
      trailPosAttr.needsUpdate = true;
      trailColAttr.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }
  animate();

  if (!reduced) {
    group.scale.set(0.01, 0.01, 0.01);
    gsap.to(group.scale, {
      x:1, y:1, z:1, duration:1.6, ease:'power3.out', delay:0.2,
      onComplete: () => { entranceDone = true; },
    });
  }
}


/* ===================================================
   GSAP SCROLL ANIMATIONS
   =================================================== */
function scrollAnimations() {
  if (reduced) return;

  // Hero entrance — immediate, no conflict with IntersectionObserver
  gsap.from('.hero__headline',  { opacity: 0, y: 40, duration: 1,   ease: 'power3.out', delay: 0.15 });
  gsap.from('.hero__subline',   { opacity: 0, y: 30, duration: 1,   ease: 'power3.out', delay: 0.35 });
  // Animate the full actions container so both buttons enter together (prevents vertical offset)
  gsap.from('.hero__actions',   { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.55 });
  gsap.from('.hero__badge',     { opacity: 0, y: 12, duration: 0.7, ease: 'power3.out', delay: 0.65 });
  gsap.from('.hero__trust',     { opacity: 0, y: 16, duration: 0.8, ease: 'power3.out', delay: 0.75 });

  // Section titles — these do NOT have .sr class so no conflict
  document.querySelectorAll('.section__title, .section__label, .section__subtitle').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
    });
  });

  // Kontakt section — no .sr class on these elements
  gsap.from('.kontakt__text', {
    scrollTrigger: { trigger: '.kontakt', start: 'top 80%', toggleActions: 'play none none none' },
    opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
  });
  gsap.from('.kontakt__sub', {
    scrollTrigger: { trigger: '.kontakt', start: 'top 85%', toggleActions: 'play none none none' },
    opacity: 0, y: 16, duration: 0.6, delay: 0.1, ease: 'power3.out',
  });
  gsap.from('.kontakt__buttons', {
    scrollTrigger: { trigger: '.kontakt', start: 'top 75%', toggleActions: 'play none none none' },
    opacity: 0, y: 16, duration: 0.7, delay: 0.2, ease: 'power3.out',
  });

  // NOTE: .card, .process__step, .faq__item, .about elements all have .sr class
  // and are handled by initScrollReveal() IntersectionObserver — do NOT add GSAP
  // animations for those here as they would conflict (GSAP inline style > CSS class).
}

/* ===================================================
   NAV SCROLL + PROGRESS BAR
   =================================================== */
function navScroll() {
  const nav  = document.getElementById('nav');
  const bar  = document.getElementById('progress-bar');
  const links = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;

    // glass nav on scroll
    nav.style.background = scrolled > 60
      ? 'rgba(5,5,5,0.96)'
      : 'rgba(5,5,5,0.75)';

    // scroll progress bar
    if (bar) bar.style.width = (scrolled / total * 100) + '%';

    // active nav link highlight
    const sections = ['services','process','about','proof','faq','kontakt'];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${id}"]`);
        if (active) active.classList.add('active');
        break;
      }
    }
  }, { passive: true });
}

/* ===================================================
   HAMBURGER MENU
   =================================================== */
function initMobileMenu() {
  const btn   = document.getElementById('burger-btn');
  const menu  = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-close');
  const mLinks= document.querySelectorAll('.mobile-menu__link');
  if (!btn || !menu) return;

  function openMenu() {
    btn.classList.add('open');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  if (close) close.addEventListener('click', closeMenu);
  mLinks.forEach(l => l.addEventListener('click', closeMenu));
  menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
}

/* ===================================================
   MODAL SYSTEM
   =================================================== */
function initModals() {
  const pairs = [
    ['open-contact-modal', 'modal-contact',    'close-contact'],
    ['open-impressum',     'modal-impressum',  'close-impressum'],
    ['open-datenschutz',   'modal-datenschutz','close-datenschutz'],
  ];

  pairs.forEach(([openId, overlayId, closeId]) => {
    const openBtn  = document.getElementById(openId);
    const overlay  = document.getElementById(overlayId);
    const closeBtn = document.getElementById(closeId);
    if (!overlay) return;

    function openModal() {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  });

  // Contact nav CTA also opens modal
  const navCta = document.getElementById('nav-cta');
  if (navCta) {
    navCta.href = '#';
    navCta.addEventListener('click', e => {
      e.preventDefault();
      const modal = document.getElementById('modal-contact');
      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

/* ===================================================
   FAQ ACCORDION
   =================================================== */
function initFAQ() {
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq__item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      // open clicked (if wasn't open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
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

/* ===================================================
   ANIMATED STAT COUNTERS
   Counts up from 0 when the stats bar enters the viewport
   Supports: "48h", "10×", "100%", "24h"
   =================================================== */
function initCounters() {
  const stats = document.querySelectorAll('.stat__number');
  if (!stats.length || reduced) return;

  // Parse the raw display text into { prefix, value, suffix }
  function parseTarget(text) {
    const t = text.trim();
    // Match: optional prefix letters, then number, then optional suffix
    const m = t.match(/^([a-zA-Z]*)(\d+(?:\.\d+)?)([^\d]*)$/);
    if (!m) return { prefix: '', value: 0, suffix: t, raw: t };
    return { prefix: m[1], value: parseFloat(m[2]), suffix: m[3], raw: t };
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, duration = 1800) {
    const target = parseTarget(el.textContent);
    if (target.value === 0) return; // nothing to count
    const start = performance.now();
    el.textContent = target.prefix + '0' + target.suffix;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * target.value);
      el.textContent = target.prefix + current + target.suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => io.observe(el));
}

/* ===================================================
   INIT
   =================================================== */
/* ===================================================
   SERVICE OVERLAYS — deep dive on card click
   =================================================== */
function initServiceOverlays() {
  const serviceMap = {
    content:    'svc-ol-content',
    social:     'svc-ol-social',
    web:        'svc-ol-web',
    chatbot:    'svc-ol-chatbot',
    automation: 'svc-ol-automation',
    beratung:   'svc-ol-beratung',
  };

  function openOverlay(serviceKey) {
    const id = serviceMap[serviceKey];
    if (!id) return;
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    history.replaceState(null, '', `#service-${serviceKey}`);
    // Reset scroll position
    const scrollEl = overlay.querySelector('.svc-overlay__scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
    // Focus close button for a11y
    const closeBtn = overlay.querySelector('.svc-overlay__close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
  }

  function closeAllOverlays() {
    document.querySelectorAll('.svc-overlay.is-open').forEach(o => {
      o.classList.remove('is-open');
      o.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname);
  }

  // Card clicks
  document.querySelectorAll('[data-service]').forEach(card => {
    card.addEventListener('click', () => openOverlay(card.dataset.service));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openOverlay(card.dataset.service);
      }
    });
  });

  // Close buttons
  document.querySelectorAll('.svc-overlay__close').forEach(btn => {
    btn.addEventListener('click', closeAllOverlays);
  });

  // Overlay CTA buttons → open contact modal
  document.querySelectorAll('.svc-ol-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllOverlays();
      setTimeout(() => {
        const contactBtn = document.getElementById('open-contact-modal');
        if (contactBtn) contactBtn.click();
      }, 300);
    });
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllOverlays();
  });

  // Hash-based deep linking on page load
  const hash = window.location.hash;
  if (hash && hash.startsWith('#service-')) {
    const key = hash.replace('#service-', '');
    if (serviceMap[key]) openOverlay(key);
  }
}

/* ===================================================
   CONTACT FORM — Formspree submission
   Replace the endpoint with your actual Formspree form ID
   Get yours free at: https://formspree.io/forms
   =================================================== */
function initContactForm() {
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwqvlbg'; // ← CONFIGURE THIS

  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    const name  = form.querySelector('#fn')?.value.trim();
    const email = form.querySelector('#fe')?.value.trim();
    if (!name || !email) {
      showFormFeedback(form, 'error', 'Bitte Name und E-Mail ausfüllen.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormFeedback(form, 'error', 'Bitte eine gültige E-Mail-Adresse eingeben.');
      return;
    }

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet…';
    }
    clearFormFeedback(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        showFormFeedback(form, 'success', '✓ Nachricht gesendet! Ich melde mich innerhalb von 24h.');
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        const msg  = data?.errors?.[0]?.message || 'Fehler beim Senden. Bitte direkt per E-Mail schreiben.';
        showFormFeedback(form, 'error', msg);
      }
    } catch {
      showFormFeedback(form, 'error', 'Keine Verbindung. Bitte direkt schreiben: hallo@kimpress.de');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Anfrage senden →';
      }
    }
  });
}

function showFormFeedback(form, type, message) {
  clearFormFeedback(form);
  const div = document.createElement('div');
  div.id = 'form-feedback';
  const isSuccess = type === 'success';
  div.style.cssText = [
    'padding: 12px 16px',
    'border-radius: 8px',
    'font-size: 0.85rem',
    'font-weight: 500',
    'margin-top: 12px',
    'text-align: center',
    isSuccess
      ? 'background:rgba(0,200,80,0.1);border:1px solid rgba(0,200,80,0.3);color:#4ade80'
      : 'background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.3);color:#f87171',
  ].join(';');
  div.textContent = message;
  form.appendChild(div);
}

function clearFormFeedback(form) {
  form.querySelector('#form-feedback')?.remove();
}

/* ===================================================
   FOOTER SERVICE LINKS — open overlay on click
   =================================================== */
function initFooterServiceLinks() {
  document.querySelectorAll('[data-open-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.openService;
      const serviceMap = {
        content: 'svc-ol-content', social: 'svc-ol-social', web: 'svc-ol-web',
        chatbot: 'svc-ol-chatbot', automation: 'svc-ol-automation', beratung: 'svc-ol-beratung',
      };
      const overlay = document.getElementById(serviceMap[key]);
      if (!overlay) return;
      overlay.classList.add('is-open');
      overlay.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      const scrollEl = overlay.querySelector('.svc-overlay__scroll');
      if (scrollEl) scrollEl.scrollTop = 0;
      const closeBtn = overlay.querySelector('.svc-overlay__close');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNeuralVoid();        // starfield background
  navScroll();             // nav glass + progress bar
  initMobileMenu();        // hamburger menu
  initModals();            // modal overlays
  initFAQ();               // accordion
  initScrollReveal();      // scroll reveal
  initCounters();          // animated stat numbers
  scrollAnimations();      // GSAP scroll entrance animations
  initServiceOverlays();   // service deep-dive overlays
  initContactForm();       // contact form submission
  initFooterServiceLinks();// footer service buttons → open overlays

  // Three.js sphere
  if (typeof THREE !== 'undefined') {
    initSyntheticMind();
  } else {
    window.addEventListener('load', initSyntheticMind);
  }
});
