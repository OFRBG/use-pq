import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: 'dot',
    coverage: {
      clean: true,
      reporter: ['clover', 'json', 'lcovonly'],
    },
  },
})
