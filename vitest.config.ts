import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      clean: true,
      reporter: ['html', 'clover', 'json', 'lcovonly'],
    },
  },
})
