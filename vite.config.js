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
      },
    },
  },
});
