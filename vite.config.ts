import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { markdownMatterPlugin } from './build/plugins/markdown-matter'

export default defineConfig(({ mode }) => ({
  plugins: [markdownMatterPlugin(), react(), tailwindcss()],
  server: {
    port: 3987,
  },
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
