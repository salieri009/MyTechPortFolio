import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.stories.*',
      ],
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
})

