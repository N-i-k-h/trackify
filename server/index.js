import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Make sure build output is inside client/dist
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  // Resolve aliases if needed
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Helpful local dev server options (ignored in production)
  server: {
    port: 5173,
    host: true,
  }
})
