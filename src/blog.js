import { BLOG_POSTS, CATEGORIES } from './blog-data.js';
import { initNeuralVoidBg, initNavScroll, initMobileMenu } from './blog-shared.js';

/* ── Helpers ──────────────────────────────────────── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function categoryColor(cat) {
  const map = {
    'Content':         '#FF0088',
    'CONTENT':         '#FF0088',
    'Automatisierung': '#FF0000',
    'AUTOMATION':      '#FF0000',
    'KI-Tools':        '#FF6B35',
    'Social Media':    '#9D4EDD',
    'SEO':             '#00BB88',
    'KI Marketing':    '#FF6B35',
  };
  return map[cat] || '#FF0000';
}

function postCard(post) {
  const color = categoryColor(post.category);
  const postUrl = `/blog/${post.slug}`;
  return `
    <article class="bcard" onclick="window.location='${postUrl}'" role="button" tabindex="0"
             onkeydown="if(event.key==='Enter')window.location='${postUrl}'"
             aria-label="${post.title}">
      <div class="bcard__cat" style="--cat-color:${color}">${post.category}</div>
      <h3 class="bcard__title">${post.title}</h3>
      <p class="bcard__excerpt">${post.excerpt}</p>
      <div class="bcard__meta">
        <span class="bcard__date">${formatDate(post.date)}</span>
        <span class="bcard__dot">·</span>
        <span class="bcard__read">${post.readTime} Min Lesezeit</span>
      </div>
      <div class="bcard__arrow" aria-hidden="true">→</div>
    </article>`;
}

function featuredCard(post) {
  const color = categoryColor(post.category);
  const postUrl = `/blog/${post.slug}`;
  return `
    <a class="bfeatured" href="${postUrl}" aria-label="${post.title}">
      <div class="bfeatured__badge" style="--cat-color:${color}">
        <span class="bfeatured__badge-label">Featured</span>
        <span class="bfeatured__badge-cat">${post.category}</span>
      </div>
      <h2 class="bfeatured__title">${post.title}</h2>
      <p class="bfeatured__excerpt">${post.excerpt}</p>
      <div class="bfeatured__meta">
        <span>${formatDate(post.date)}</span>
        <span class="bcard__dot">·</span>
        <span>${post.readTime} Min Lesezeit</span>
        <span class="bfeatured__cta">Artikel lesen →</span>
      </div>
    </a>`;
}

/* ── State ────────────────────────────────────────── */
let activeCategory = 'Alle';
let searchQuery    = '';

function getFilteredPosts() {
  return BLOG_POSTS.filter(p => {
    const postCatNorm = (p.category || '').toLowerCase();
    const activeCatNorm = activeCategory.toLowerCase();
    const catOk  = activeCategory === 'Alle' ||
      postCatNorm === activeCatNorm ||
      (activeCatNorm === 'automatisierung' && postCatNorm === 'automation') ||
      (activeCatNorm === 'content' && postCatNorm === 'content');
    const query  = searchQuery.toLowerCase();
    const textOk = !query ||
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    return catOk && textOk;
  });
}

/* ── Render ───────────────────────────────────────── */
function renderCats() {
  const container = document.getElementById('blog-cats');
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="bcat${cat === activeCategory ? ' bcat--active' : ''}"
            data-cat="${cat}" aria-pressed="${cat === activeCategory}">${cat}</button>
  `).join('');

  container.querySelectorAll('.bcat').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderCats();
      renderGrid();
    });
  });
}

function renderGrid() {
  const filtered  = getFilteredPosts();
  const grid      = document.getElementById('blog-grid');
  const empty     = document.getElementById('blog-empty');
  const featured  = document.getElementById('blog-featured');

  // Featured (only when no filter/search active)
  const showFeatured = activeCategory === 'Alle' && !searchQuery;
  const featuredPost = BLOG_POSTS.find(p => p.featured);
  if (featured) {
    featured.style.display = showFeatured && featuredPost ? '' : 'none';
    featured.querySelector('.container').innerHTML =
      showFeatured && featuredPost ? featuredCard(featuredPost) : '';
  }

  // Regular grid — exclude ONLY the single active featured post so all other articles appear!
  const gridPosts = showFeatured && featuredPost
    ? filtered.filter(p => p.slug !== featuredPost.slug)
    : filtered;

  if (gridPosts.length === 0) {
    grid.innerHTML = '';
    empty.style.display = '';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = gridPosts.map(postCard).join('');
    // Stagger animation
    grid.querySelectorAll('.bcard').forEach((el, i) => {
      el.style.animationDelay = `${i * 60}ms`;
      el.classList.add('bcard--anim');
    });
  }
}

/* ── URL param: pre-select category ──────────────── */
function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat && CATEGORIES.includes(cat)) activeCategory = cat;
}

/* ── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNeuralVoidBg();
  initNavScroll();
  initMobileMenu();

  applyUrlParams();
  renderCats();
  renderGrid();

  // Live search
  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.trim();
      renderGrid();
    });
  }

  // Scroll progress bar
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    if (bar) bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });
});
