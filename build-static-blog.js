import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_POSTS, getRelatedPosts } from './src/blog-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://kimpress.de';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function categoryColor(cat) {
  const map = {
    'Automatisierung': '#FF0000',
    'AUTOMATION':     '#FF0000',
    'KI-Tools':        '#FF6B35',
    'Social Media':    '#FF0088',
    'CONTENT':         '#FF0088',
    'SEO':             '#00BB88',
  };
  return map[cat] || '#FF0000';
}

function renderRelatedCard(post) {
  const color = categoryColor(post.category);
  return `
    <a class="related-card" href="/blog-post.html?slug=${post.slug}">
      <span class="related-card__cat" style="color:${color}">${escapeHtml(post.category)}</span>
      <h4 class="related-card__title">${escapeHtml(post.title)}</h4>
      <span class="related-card__read">${post.readTime} Min →</span>
    </a>`;
}

function renderFullPostMain(post) {
  const color = categoryColor(post.category);
  const related = getRelatedPosts(post.slug, 3);
  const formattedDate = formatDate(post.date);

  return `
  <main id="post-main">
    <!-- POST HEADER -->
    <header class="post-header">
      <div class="container">
        <a href="/blog.html" class="post-back">← Zurück zum Blog</a>
        <div class="post-header__cat" style="--cat-color:${color}">${escapeHtml(post.category)}</div>
        <h1 class="post-header__title">${escapeHtml(post.title)}</h1>
        <div class="post-header__meta">
          <div class="post-author">
            <img class="post-author__avatar" src="/images/characters/portrait-01.png" alt="Cem Görül" style="object-fit: cover;" loading="lazy" />
            <div>
              <div class="post-author__name">Cem Görül</div>
              <div class="post-author__role">Kimpress — KI-Agentur</div>
            </div>
          </div>
          <div class="post-header__details">
            <span>${formattedDate}</span>
            <span class="post-dot">·</span>
            <span>${post.readTime} Min Lesezeit</span>
          </div>
        </div>
        <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
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
          <img class="post-author__avatar post-author__avatar--lg" src="/images/characters/portrait-01.png" alt="Cem Görül" style="object-fit: cover;" loading="lazy" />
          <div class="post-authorbox__text">
            <div class="post-authorbox__name">Cem Görül</div>
            <div class="post-authorbox__bio">KI-Agentur Kimpress · Hamburg. Über 15 Jahre Erfahrung in Webentwicklung, Marketing &amp; KI-Automatisierung für KMU im DACH-Raum.</div>
            <a href="/#kontakt" class="btn btn--primary" style="margin-top:1rem">Direktkontakt →</a>
          </div>
        </div>

        <!-- Share -->
        <div class="post-share">
          <span class="post-share__label">Teilen</span>
          <a class="post-share__btn" id="share-li" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${DOMAIN}/blog-post.html?slug=${post.slug}`)}" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a class="post-share__btn" id="share-tw" href="https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${DOMAIN}/blog-post.html?slug=${post.slug}`)}" target="_blank" rel="noopener" aria-label="X / Twitter">
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
          ${related.map(renderRelatedCard).join('')}
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
          <img src="/kimpress-logo.svg" alt="Kimpress" height="28" class="footer__logo" />
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
        <p>
          &copy; 2026 Kimpress &middot; Cem Görül &middot; Hamburg &middot; 
          <a href="/index.html?open=impressum" style="color: inherit; text-decoration: underline;">Impressum</a> &middot; 
          <a href="/index.html?open=datenschutz" style="color: inherit; text-decoration: underline;">Datenschutz</a>
        </p>
      </div>
    </footer>
  </main>`;
}

function buildStaticBlogPages() {
  const distDir = path.join(__dirname, 'dist');
  const templatePath = path.join(distDir, 'blog-post.html');

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template not found at ${templatePath}. Run 'vite build' first.`);
    return;
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');

  console.log(`🚀 Pre-rendering ${BLOG_POSTS.length} static blog articles (Zero-JS SSG Engine)...`);

  let count = 0;

  for (const post of BLOG_POSTS) {
    const postUrl = `${DOMAIN}/blog-post.html?slug=${post.slug}`;
    const pageTitle = `${post.title} — Kimpress KI Blog`;
    const metaDesc = post.excerpt;

    const schemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${postUrl}#article`,
          "mainEntityOfPage": postUrl,
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.date,
          "dateModified": post.date,
          "author": {
            "@type": "Person",
            "@id": "https://kimpress.de/#founder",
            "name": "Cem Görül",
            "url": "https://kimpress.de"
          },
          "publisher": {
            "@type": "Organization",
            "@id": "https://kimpress.de/#organization",
            "name": "Kimpress",
            "url": "https://kimpress.de",
            "logo": {
              "@type": "ImageObject",
              "url": "https://kimpress.de/kimpress-logo.png"
            }
          },
          "articleSection": post.category,
          "inLanguage": "de-DE"
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${postUrl}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kimpress.de" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://kimpress.de/blog.html" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": postUrl }
          ]
        }
      ]
    });

    let renderedHtml = templateHtml;

    // 1. Replace Title & Meta Description
    renderedHtml = renderedHtml.replace(
      /<title[^>]*>[\s\S]*?<\/title>/i,
      `<title id="post-meta-title">${escapeHtml(pageTitle)}</title>`
    );
    renderedHtml = renderedHtml.replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" id="post-meta-desc" content="${escapeHtml(metaDesc)}" />`
    );

    // 2. Replace Canonical Tag
    renderedHtml = renderedHtml.replace(
      /<link\s+rel="canonical"[^>]*>/i,
      `<link rel="canonical" id="canonical-tag" href="${postUrl}" />`
    );

    // 3. Replace OpenGraph & Twitter Tags
    renderedHtml = renderedHtml.replace(
      /<meta\s+property="og:title"[^>]*>/i,
      `<meta property="og:title" id="og-title" content="${escapeHtml(pageTitle)}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta\s+property="og:description"[^>]*>/i,
      `<meta property="og:description" id="og-desc" content="${escapeHtml(metaDesc)}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta\s+property="og:url"[^>]*>/i,
      `<meta property="og:url" id="og-url" content="${postUrl}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta\s+name="twitter:title"[^>]*>/i,
      `<meta name="twitter:title" id="tw-title" content="${escapeHtml(pageTitle)}" />`
    );
    renderedHtml = renderedHtml.replace(
      /<meta\s+name="twitter:description"[^>]*>/i,
      `<meta name="twitter:description" id="tw-desc" content="${escapeHtml(metaDesc)}" />`
    );

    // 4. Inject JSON-LD Schema before </head>
    const schemaScriptTag = `\n  <script type="application/ld+json" id="dynamic-post-schema">\n${schemaJson}\n  </script>\n</head>`;
    renderedHtml = renderedHtml.replace(/<\/head>/i, schemaScriptTag);

    // 5. Replace <main id="post-main">...</main> with full pre-rendered content
    const fullMainContent = renderFullPostMain(post);
    renderedHtml = renderedHtml.replace(
      /<main\s+id="post-main">[\s\S]*?<\/main>/i,
      fullMainContent
    );

    // Write static HTML files:
    // Option A: dist/blog/[slug].html
    const blogDir = path.join(distDir, 'blog');
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
    fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), renderedHtml, 'utf8');

    // Option B: dist/blog/[slug]/index.html
    const slugDir = path.join(blogDir, post.slug);
    if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
    fs.writeFileSync(path.join(slugDir, 'index.html'), renderedHtml, 'utf8');

    count++;
  }

  console.log(`✅ Successfully generated ${count} pre-rendered static blog HTML pages in dist/blog/.`);
}

buildStaticBlogPages();
