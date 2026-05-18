import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Minimal Warm',
        short_name: '待辦',
        description: '暖極簡風格的個人待辦事項 PWA',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-Hant',
        background_color: '#faf3e3',
        theme_color: '#faf3e3',
        icons: [
          { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
          { src: '/icon-192.png', type: 'image/png', sizes: '192x192', purpose: 'any' },
          { src: '/icon-512.png', type: 'image/png', sizes: '512x512', purpose: 'any' },
          // Maskable variant — the 512 icon has enough padding around its
          // glyph that iOS / Android adaptive icon masks won't clip it.
          { src: '/icon-512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.googleapis.com' ||
              url.origin === 'https://fonts.gstatic.com' ||
              url.origin === 'https://cdn.jsdelivr.net',
            handler: 'CacheFirst',
            options: {
              cacheName: 'mw-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Enable SW in `npm run dev` so we can test install flow locally.
        enabled: false,
      },
    }),
  ],
  server: { port: 5173, host: true },
});
