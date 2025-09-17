import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['~/sanity/lib/sanity.api'], // add any other modules you need
    },
  },
});
