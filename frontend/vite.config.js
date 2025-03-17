import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // Output directory for the production build
    assetsDir: 'assets', // Directory for static assets in the build output
    emptyOutDir: true, // Clear the output directory before building
  },
  server: {
    port: 3000, // Development server port
  },
  publicDir: 'public', // Specify the public directory (default is 'public')
});