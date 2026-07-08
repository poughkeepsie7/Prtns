import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // exposes to Docker network
    port: 5173,
    proxy: {
      '/api': 'http://server:3000'  // in dev, forwards /api calls to Express
    }
  }
})