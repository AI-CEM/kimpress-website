import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_POSTS } from './src/blog-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://kimpress.de';
const TODAY = new Date().toISOString().split('T')[0];

const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0' },
    { url: '/n8n-ki-agentur-deutschland.html', priority: '0.9' },
    { url: '/ki-content-agentur-deutschland.html', priority: '0.9' },
    { url: '/blog.html', priority: '0.8' }
  ];

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}${page.url}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Blog posts
  for (const post of BLOG_POSTS) {
    const postDate = post.date || TODAY;
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}/blog-post.html?slug=${post.slug}</loc>\n`;
    xml += `    <lastmod>${postDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${postDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`✅ Sitemap successfully generated with ${staticPages.length + BLOG_POSTS.length} URLs.`);

  // Generate RSS Feed for Bravebot and RSS Indexers
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
  rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  rss += `<channel>\n`;
  rss += `  <title>Kimpress — KI Agentur Hamburg &amp; KI Automatisierung</title>\n`;
  rss += `  <link>${DOMAIN}</link>\n`;
  rss += `  <description>Deutschlands pragmatischste KI Agentur aus Hamburg. KI-Automatisierung, n8n Workflows &amp; KI-Content.</description>\n`;
  rss += `  <language>de-de</language>\n`;
  rss += `  <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const post of BLOG_POSTS) {
    rss += `  <item>\n`;
    rss += `    <title>${post.title.replace(/&/g, '&amp;')}</title>\n`;
    rss += `    <link>${DOMAIN}/blog-post.html?slug=${post.slug}</link>\n`;
    rss += `    <guid>${DOMAIN}/blog-post.html?slug=${post.slug}</guid>\n`;
    rss += `    <description>${post.excerpt.replace(/&/g, '&amp;')}</description>\n`;
    rss += `    <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n`;
    rss += `  </item>\n`;
  }

  rss += `</channel>\n`;
  rss += `</rss>\n`;

  const rssPath = path.join(__dirname, 'public', 'rss.xml');
  fs.writeFileSync(rssPath, rss, 'utf8');
  console.log(`✅ RSS Feed successfully generated at public/rss.xml.`);
};

generateSitemap();
