/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/basehref',
  build: {
    minify: false,
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      disableTypeChecking: false,
      ssr: true,
      ...(mode === 'production' ? {apiPrefix: 'basehref'} : {apiPrefix: 'basehref/api'}),
      vite: {
        inlineStylesExtension: 'scss',
      },
      nitro: {
        routeRules: {
          '/': {
            prerender: false,
          },
        },
      },
      prerender: {
        routes: async () => {
          return [];
        }
      }
    }),
    tailwindcss()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
