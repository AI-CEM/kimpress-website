import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { BLOG_POSTS } from './src/blog-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n============================================================');
console.log('🛡️  KIMPRESS ZERO-HALLUCINATION & WORKFLOW VERIFICATION SUITE');
console.log('============================================================\n');

let totalErrors = 0;
const checkedSlugs = new Set();

// 1. FORBIDDEN HALLUCINATIONS & SYNTHETIC BUZZWORDS
const FORBIDDEN_PATTERNS = [
  { pattern: /GPT-5(?:\.[0-9]+)?(?:\s+(?:Terra|Luna|Alpha|Beta))?/i, label: 'Hallucinated/Unreleased GPT-5 Model' },
  { pattern: /Llama\s*4/i, label: 'Unreleased Llama 4 Model' },
  { pattern: /Veo\s*3(?:\.[0-9]+)?/i, label: 'Unreleased Veo 3 Model' },
  { pattern: /n8n\s*v3(?:\.[0-9]+)?/i, label: 'Unreleased n8n v3 claim' },
  { pattern: /Sora\s+eingestellt/i, label: 'Disproven fake news: Sora eingestellt' },
  { pattern: /(?:im|unserem)\s+(?:Hamburger\s+)?Labor\s+getestet/i, label: 'Synthetic lab claim without logged dataset' },
  { pattern: /(?:200|500|1000)\s+(?:Diktate|Dateien|Audiofiles)\s+getestet/i, label: 'Synthetic sample volume claim' },
  { pattern: /Kimpress\s+Reality-Test/i, label: 'Synthetic reality-test placeholder' }
];

console.log(`[1/4] Scanning ${BLOG_POSTS.length} articles for metadata integrity and uniqueness...`);

BLOG_POSTS.forEach((post, index) => {
  const postNum = index + 1;
  const prefix = `  [Article ${postNum}: ${post.slug}]`;

  // Required fields
  const requiredFields = ['slug', 'title', 'excerpt', 'date', 'readTime', 'category', 'content'];
  for (const field of requiredFields) {
    if (!post[field]) {
      console.error(`❌ ${prefix} Missing required field '${field}'`);
      totalErrors++;
    }
  }

  // Slug check
  if (checkedSlugs.has(post.slug)) {
    console.error(`❌ ${prefix} Duplicate slug detected: '${post.slug}'`);
    totalErrors++;
  }
  checkedSlugs.add(post.slug);

  // Date format check
  if (post.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
    console.error(`❌ ${prefix} Invalid date format: '${post.date}' (Must be YYYY-MM-DD)`);
    totalErrors++;
  }
});

console.log(`[2/4] Scanning articles for forbidden hallucinations and fake claims...`);

BLOG_POSTS.forEach((post, index) => {
  const postNum = index + 1;
  const prefix = `  [Article ${postNum}: ${post.slug}]`;
  const fullText = `${post.title} ${post.excerpt} ${post.content}`;

  for (const item of FORBIDDEN_PATTERNS) {
    if (item.pattern.test(fullText)) {
      console.error(`❌ ${prefix} FORBIDDEN CLAIM DETECTED: "${item.label}"`);
      totalErrors++;
    }
  }
});

console.log(`[3/4] Extracting and sandbox-compiling embedded code snippets...`);

const tempDir = path.join(__dirname, '.temp_code_verify');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

let codeBlocksTested = 0;

BLOG_POSTS.forEach((post, index) => {
  const postNum = index + 1;
  const prefix = `  [Article ${postNum}: ${post.slug}]`;

  // 1. Python Code Blocks
  const pythonBlocks = [...post.content.matchAll(/<code class="language-python">([\s\S]*?)<\/code>/g)];
  pythonBlocks.forEach((match, i) => {
    codeBlocksTested++;
    const code = match[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    const tempFile = path.join(tempDir, `post_${postNum}_py_${i}.py`);
    fs.writeFileSync(tempFile, code);

    try {
      execSync(`python3 -m py_compile "${tempFile}"`, { stdio: 'pipe' });
      console.log(`    ✅ Python block ${i + 1} compiled without syntax errors`);
    } catch (err) {
      console.error(`❌ ${prefix} Python syntax error in code block ${i + 1}:\n${err.stderr ? err.stderr.toString() : err.message}`);
      totalErrors++;
    }
  });

  // 2. JavaScript Code Blocks
  const jsBlocks = [...post.content.matchAll(/<code class="language-javascript">([\s\S]*?)<\/code>/g)];
  jsBlocks.forEach((match, i) => {
    codeBlocksTested++;
    const code = match[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    const tempFile = path.join(tempDir, `post_${postNum}_js_${i}.js`);
    fs.writeFileSync(tempFile, code);

    try {
      execSync(`node --check "${tempFile}"`, { stdio: 'pipe' });
      console.log(`    ✅ JavaScript block ${i + 1} passed syntax check`);
    } catch (err) {
      console.error(`❌ ${prefix} JavaScript syntax error in code block ${i + 1}:\n${err.stderr ? err.stderr.toString() : err.message}`);
      totalErrors++;
    }
  });

  // 3. JSON Code Blocks
  const jsonBlocks = [...post.content.matchAll(/<code class="language-json">([\s\S]*?)<\/code>/g)];
  jsonBlocks.forEach((match, i) => {
    codeBlocksTested++;
    const code = match[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    try {
      JSON.parse(code);
      console.log(`    ✅ JSON block ${i + 1} parsed successfully`);
    } catch (err) {
      console.error(`❌ ${prefix} JSON parse error in code block ${i + 1}: ${err.message}`);
      totalErrors++;
    }
  });
});

// Clean up temp directory
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch {}

console.log(`[4/4] Verification Summary: Tested ${BLOG_POSTS.length} articles and ${codeBlocksTested} embedded code blocks.`);

if (totalErrors > 0) {
  console.error(`\n🚨 BUILD BLOCKED: Found ${totalErrors} violation(s)! Clean up errors before deploying.`);
  process.exit(1);
} else {
  console.log(`\n🎉 100% VERIFIED & APPROVED: All articles, models, and code blocks passed inspection!\n`);
  process.exit(0);
}
