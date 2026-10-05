import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: 'src/content/index.ts'
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife'
      }
    }
  }
});
