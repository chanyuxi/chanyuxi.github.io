import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    sourcemap: mode === 'development',
    minify: mode === 'development' ? false : 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
}))
