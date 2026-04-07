import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:      resolve(__dirname, 'index.html'),
        blog:      resolve(__dirname, 'blog.html'),
        blogPost:  resolve(__dirname, 'blog-post.html'),
      },
    },
  },
});
