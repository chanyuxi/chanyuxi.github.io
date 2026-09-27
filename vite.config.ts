import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { markdownMatterPlugin } from './build/plugins/markdown-matter'

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'development' ? false : 'terser',
    sourcemap: mode === 'development',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  plugins: [markdownMatterPlugin(), react(), tailwindcss()],
  // TODO: Consider to update vite version to 8 from 7 then we can use resolve.tsconfigPaths feature.
  resolve: {
    alias: {
      '@': '/src',
      '@shared': '/shared',
    },
  },
  server: {
    port: 3987,
  },
}))
