import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
});