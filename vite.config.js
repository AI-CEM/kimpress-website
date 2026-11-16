import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html'),
        blogPost: resolve(__dirname, 'blog-post.html'),
        kiContent: resolve(__dirname, 'ki-content-agentur-deutschland.html'),
        n8nKi: resolve(__dirname, 'n8n-ki-agentur-deutschland.html'),
        immobilienVideosHamburg: resolve(__dirname, 'immobilien-videos-hamburg.html'),
        kiChatbotKanzlei: resolve(__dirname, 'ki-chatbot-kanzlei.html'),
        vergleichWerbeagentur: resolve(__dirname, 'ki-agentur-vs-klassische-werbeagentur.html'),
        vergleichBaukasten: resolve(__dirname, 'massgeschneiderte-ki-systeme-vs-baukasten-tools.html'),
        vergleichInhouse: resolve(__dirname, 'ki-agentur-vs-inhouse.html'),
      },
    },
  },
});
