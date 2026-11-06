import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures assets load correctly on GitHub Pages and any subpath
  build: {
    outDir: 'dist',
  }
});
