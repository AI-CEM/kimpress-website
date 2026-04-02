import { getPostBySlug, getRelatedPosts } from './blog-data.js';
import { initNeuralVoidBg, initNavScroll, initMobileMenu } from './blog-shared.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function categoryColor(cat) {
  const map = {
    'Automatisierung': '#FF0000',
    'KI-Tools':        '#FF6B35',
    'Social Media':    '#FF0088',
    'SEO':             '#00BB88',
  };
  return map[cat] || '#FF0000';
}

function relatedCard(post) {
  return `
    <a class="related-card" href="/blog-post.html?slug=${post.slug}">
      <span class="related-card__cat" style="color:${categoryColor(post.category)}">${post.category}</span>
      <h4 class="related-card__title">${post.title}</h4>
      <span class="related-card__read">${post.readTime} Min →</span>
    </a>`;
}

function renderPost(post) {
  const color = categoryColor(post.category);
  const related = getRelatedPosts(post.slug, 3);

  document.getElementById('post-meta-title').textContent = `${post.title} — Kimpress Blog`;
  document.getElementById('post-meta-desc').setAttribute('content', post.excerpt);

  const main = document.getElementById('post-main');
  main.innerHTML = `
    <!-- POST HEADER -->
    <header class="post-header">
      <div class="container">
        <a href="/blog.html" class="post-back">← Zurück zum Blog</a>
        <div class="post-header__cat" style="--cat-color:${color}">${post.category}</div>
        <h1 class="post-header__title">${post.title}</h1>
        <div class="post-header__meta">
          <div class="post-author">
            <div class="post-author__avatar">CG</div>
            <div>
              <div class="post-author__name">Cem Görül</div>
              <div class="post-author__role">Kimpress — KI-Agentur</div>
            </div>
          </div>
          <div class="post-header__details">
            <span>${formatDate(post.date)}</span>
            <span class="post-dot">·</span>
            <span>${post.readTime} Min Lesezeit</span>
          </div>
        </div>
        <p class="post-excerpt">${post.excerpt}</p>
      </div>
    </header>

    <!-- POST BODY -->
    <div class="post-body">
      <div class="container">
        <div class="post-content">
          ${post.content}
        </div>

        <!-- Author box -->
        <div class="post-authorbox">
          <div class="post-author__avatar post-author__avatar--lg">CG</div>
          <div class="post-authorbox__text">
            <div class="post-authorbox__name">Cem Görül</div>
            <div class="post-authorbox__bio">KI-Agentur Kimpress · Hamburg. Über 12 Jahre Digital Marketing, heute spezialisiert auf KI-Automatisierung für KMU im DACH-Raum.</div>
            <a href="/#kontakt" class="btn btn--primary" style="margin-top:1rem">Direktkontakt →</a>
          </div>
        </div>

        <!-- Share -->
        <div class="post-share">
          <span class="post-share__label">Teilen</span>
          <a class="post-share__btn" id="share-li" href="#" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a class="post-share__btn" id="share-tw" href="#" target="_blank" rel="noopener" aria-label="X / Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X
          </a>
          <button class="post-share__btn" id="share-copy" aria-label="Link kopieren">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Kopieren
          </button>
        </div>
      </div>
    </div>

    <!-- RELATED POSTS -->
    ${related.length ? `
    <section class="post-related">
      <div class="container">
        <h2 class="post-related__title">Weitere Artikel</h2>
        <div class="post-related__grid">
          ${related.map(relatedCard).join('')}
        </div>
      </div>
    </section>` : ''}

    <!-- CTA -->
    <section class="blog-cta">
      <div class="container">
        <div class="blog-cta__box">
          <span class="section__label" style="margin-bottom:.5rem">Kimpress</span>
          <h2 class="blog-cta__title">Bereit KI in dein Business zu bringen?</h2>
          <p class="blog-cta__text">15 Minuten. Kostenlos. Direkte Einschätzung.</p>
          <a href="/#kontakt" class="btn btn--primary btn--lg">Jetzt anfragen →</a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer__top">
        <div class="footer__col footer__col--brand">
          <img src="/kimpress_test_logo.svg" alt="Kimpress" height="28" class="footer__logo" />
          <p class="footer__tagline">KI-Agentur für den DACH-Raum.<br>1 Operator. Maximale Wirkung.</p>
        </div>
        <div class="footer__col">
          <h4 class="footer__col-title">Navigation</h4>
          <ul class="footer__nav">
            <li><a href="/#services">Services</a></li>
            <li><a href="/#about">Über uns</a></li>
            <li><a href="/#faq">FAQ</a></li>
            <li><a href="/blog.html">Blog</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4 class="footer__col-title">Kontakt</h4>
          <div class="footer__contact">
            <p>hallo@kimpress.de</p>
            <p>Hamburg, DACH-Raum</p>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 Kimpress &middot; Cem Görül &middot; Hamburg</p>
      </div>
    </footer>
  `;

  // Share buttons
  const url   = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(post.title);
  document.getElementById('share-li').href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  document.getElementById('share-tw').href = `https://x.com/intent/tweet?text=${title}&url=${url}`;
  document.getElementById('share-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = document.getElementById('share-copy');
      btn.textContent = '✓ Kopiert!';
      setTimeout(() => { btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Kopieren`; }, 2000);
    });
  });

  // Scroll progress
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    if (bar) bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });

  // Hide loading
  const loading = document.getElementById('post-loading');
  if (loading) loading.remove();
}

document.addEventListener('DOMContentLoaded', () => {
  initNeuralVoidBg();
  initNavScroll();
  initMobileMenu();

  const slug = new URLSearchParams(window.location.search).get('slug');
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) {
    document.getElementById('post-loading').style.display = 'none';
    document.getElementById('post-404').style.display = '';
    document.title = 'Nicht gefunden — Kimpress Blog';
    return;
  }

  renderPost(post);
});
