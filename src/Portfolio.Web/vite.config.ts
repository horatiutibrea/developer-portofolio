import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4200,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    ...(process.env.CI ? [] : [mkcert()]),
  ],
});
