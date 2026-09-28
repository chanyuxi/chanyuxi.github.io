import { readFileSync } from 'node:fs'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { cn as cnCompiler } from 'cn/vite'
import { defineConfig } from 'vite'

import { markdownMatterPlugin } from './build/plugins/markdown-matter'

const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'development' ? false : 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'data-vendor': ['@tanstack/react-query', 'axios', 'zod'],
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'ui-vendor': ['@base-ui/react', 'class-variance-authority', 'cn/engine', 'lucide-react'],
        },
      },
    },
    sourcemap: mode === 'development',
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  esbuild: {
    drop: mode === 'development' ? [] : ['console'],
  },
  plugins: [
    cnCompiler({
      content: ['src/**/*.{ts,tsx}'],
      out: 'src/libs/cn-tables.ts',
    }),
    markdownMatterPlugin(),
    react(),
    tailwindcss(),
  ],
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
