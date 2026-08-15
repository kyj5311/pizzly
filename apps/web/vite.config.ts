import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // public/manifest.json을 그대로 서빙(Phase 0에서 CLAUDE.md PWA 규칙에 맞춰 작성됨) — 플러그인이 별도로 생성하지 않음
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // API 응답은 캐싱 제외, 항상 최신 데이터 (CLAUDE.md PWA 규칙)
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ]
})
