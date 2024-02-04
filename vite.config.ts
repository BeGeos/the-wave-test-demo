/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    alias: {
      $apps: new URL('./src/apps', import.meta.url).pathname,
      '$apps/*': new URL('./src/apps/*', import.meta.url).pathname,
      $db: new URL('./src/db', import.meta.url).pathname,
      '$db/*': new URL('./src/db/*', import.meta.url).pathname,
      $routes: new URL('./src/routes.ts', import.meta.url).pathname,
      $constants: new URL('./src/constants.ts', import.meta.url).pathname,
    },

    exclude: ['build', 'node_modules'],
  },
});
