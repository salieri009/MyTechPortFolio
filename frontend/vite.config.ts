import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      '@components': resolve('./src/components'),
      '@pages': resolve('./src/pages'),
      '@services': resolve('./src/services'),
      '@mocks': resolve('./src/mocks'),
      '@store': resolve('./src/store'),
      '@styles': resolve('./src/styles'),
      '@model': resolve('./src/types'),
    },
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
