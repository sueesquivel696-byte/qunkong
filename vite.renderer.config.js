import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: '.',
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'renderer-dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: 'index.renderer.html',
    },
  },
});
