import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'mui';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('@tanstack') || id.includes('axios')) return 'query';
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
