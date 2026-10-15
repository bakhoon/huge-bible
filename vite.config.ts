import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages 같은 하위 경로에 올릴 때는 BASE=/huge-bible/ npm run build
const base = process.env.BASE ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '큰 글씨 성경',
        short_name: '큰글씨성경',
        description: '눈이 잘 안 보이는 분들을 위한 큰 글씨 성경 (개역한글)',
        lang: 'ko',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFFFFF',
        theme_color: '#1F4E9E',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
      },
      workbox: {
        // 앱 화면과 성경 66권 본문을 모두 미리 저장해서 인터넷 없이도 읽을 수 있게 합니다.
        globPatterns: ['**/*.{js,css,html,svg}', 'bible/krv/*.json'],
        // 한글 글꼴 조각은 많아서 처음 쓸 때 저장합니다.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 400 } }
          }
        ]
      }
    })
  ]
});
