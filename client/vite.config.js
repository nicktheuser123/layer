import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/validate': 'http://localhost:3001',
      '/save-backup': 'http://localhost:3001',
      '/fetch-schemas': 'http://localhost:3001'
    }
  }
});
