import { readFileSync } from 'node:fs'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { cn as cnCompiler } from 'cn/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

import { poetryCharacterSetPlugin } from './build/plugins/character-set-extractor/poetry'
import { markdownMatterPlugin } from './build/plugins/markdown-matter'

const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

const aliases = {
  '@': '/src',
  '@shared': '/shared',
}

const manualChunks = {
  'data-vendor': ['@tanstack/react-query', 'axios', 'zod'],
  'react-vendor': ['react', 'react-dom', 'react-router'],
  'ui-vendor': ['@base-ui/react', 'class-variance-authority', 'cn/engine', 'lucide-react'],
}

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development'

  return {
    build: {
      minify: !isDevelopment,
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
      sourcemap: isDevelopment,
    },
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    esbuild: {
      drop: isDevelopment ? [] : ['console'],
    },
    plugins: [
      poetryCharacterSetPlugin,
      cnCompiler({
        content: ['src/**/*.{ts,tsx}'],
        out: 'src/libs/cn-tables.ts',
      }),
      markdownMatterPlugin(),
      Icons({
        compiler: 'jsx',
        jsx: 'react',
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: aliases,
    },
    server: {
      port: 3987,
    },
  }
})
