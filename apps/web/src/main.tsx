import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// FE1/FE2가 실제 앱 엔트리로 교체 예정. 지금은 vite-plugin-pwa 빌드/서비스워커 생성 검증용 placeholder.
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <div>피즐리 (Pizzly) — 빌드 검증용 placeholder</div>
  </StrictMode>
)
