import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Fuel Calculator',
        short_name: 'Fuel Calculator',
        theme_color: '#7e1e20',
        start_url: '/',
        display: 'fullscreen',
        orientation: 'portrait',
        icons: [
          {
            src: 'assets/images/app-icon-128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'assets/images/app-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/images/app-icon-256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'assets/images/app-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
