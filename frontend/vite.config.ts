import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcss from 'postcss';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: postcss,
  },
});
