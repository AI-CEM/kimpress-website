import './style.css'

/* ============================================================
   KIMPRESS — main.js
   GSAP ScrollTrigger + CSS Intersection Observer fade-ups
   Nav scroll state · Floating card parallax
   ============================================================ */

/* ---- GSAP ScrollTrigger registration ---------------------- */
gsap.registerPlugin(ScrollTrigger)

/* ---- Nav: add .scrolled class on scroll ------------------- */
const nav = document.getElementById('nav')

const navObserver = new IntersectionObserver(
  ([entry]) => {
    nav.classList.toggle('scrolled', !entry.isIntersecting)
  },
  { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
)
navObserver.observe(document.getElementById('hero'))

/* ---- Fade-up via Intersection Observer -------------------- */
const fadeEls = document.querySelectorAll('.fade-up')

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        fadeObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
)

fadeEls.forEach((el) => fadeObserver.observe(el))

/* ---- GSAP: Hero headline staggered entrance --------------- */
const heroLines = document.querySelectorAll('.hero-headline br')
if (heroLines.length) {
  // Split headline by <br> — wrap each text node in a span
  const headline = document.querySelector('.hero-headline')
  if (headline) {
    gsap.fromTo(
      headline,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    )
  }
}

gsap.fromTo(
  '.hero-tag',
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 }
)

gsap.fromTo(
  '.hero-sub',
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.55 }
)

gsap.fromTo(
  '.btn-primary',
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.75 }
)

gsap.fromTo(
  '.hero-micro',
  { opacity: 0 },
  { opacity: 1, duration: 0.6, ease: 'power1.out', delay: 1 }
)

gsap.fromTo(
  '.hero-cards',
  { opacity: 0, x: 40 },
  { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', delay: 0.4 }
)

/* ---- GSAP: Scroll parallax on hero glow ------------------- */
gsap.to('.hero-glow', {
  y: -120,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
})

/* ---- GSAP: Demo cards entrance on scroll ------------------ */
gsap.fromTo(
  '.demo-card',
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.demo-grid',
      start: 'top 82%',
    },
  }
)

/* ---- GSAP: Offer cards entrance on scroll ----------------- */
gsap.fromTo(
  '.offer-card',
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.65,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.offer-grid',
      start: 'top 80%',
    },
  }
)

/* ---- GSAP: Prozess steps on scroll ------------------------ */
gsap.fromTo(
  '.prozess-step',
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.prozess-grid',
      start: 'top 80%',
    },
  }
)

/* ---- GSAP: Kontakt section entrance ----------------------- */
gsap.fromTo(
  '.kontakt-inner',
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.kontakt-section',
      start: 'top 78%',
    },
  }
)

/* ---- Subtle card parallax on mousemove -------------------- */
const cards = document.querySelectorAll('.card')

document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  const dx = (e.clientX - cx) / cx   // -1 to 1
  const dy = (e.clientY - cy) / cy   // -1 to 1

  cards.forEach((card, i) => {
    const depth = (i + 1) * 5
    gsap.to(card, {
      x: dx * depth,
      y: dy * depth,
      duration: 1.2,
      ease: 'power1.out',
      overwrite: 'auto',
    })
  })
})
