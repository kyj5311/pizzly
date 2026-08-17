# 배포 체크리스트 (BE2 소관, PWA 배포·HTTPS·인프라)

계정 생성·프로젝트 연결·환경변수 등록은 실제 계정 소유자(팀원)가 직접 해야 하는 작업이라, 이 문서는
그 단계를 그대로 따라 할 수 있는 체크리스트다. 설정 파일은 레포에 이미 준비돼 있다.

- [apps/api/render.yaml](../apps/api/render.yaml)
- [apps/web/vercel.json](../apps/web/vercel.json)

## 1. 사전 준비

- [ ] GitHub 레포(`kyj5311/pizzly`)가 Render/Vercel 계정에서 접근 가능한 상태인지 확인 (조직/개인 계정 권한)
- [ ] 실제 서비스용 값 확정: `DATABASE_URL`(운영 DB), `JWT_SECRET`, Cloudinary 키 3종
- [ ] MySQL 운영 DB 준비 (Render의 관리형 MySQL이 없으므로 PlanetScale, Railway, 또는 별도 관리형 MySQL 필요 — 어디로 할지 팀 결정 필요)

## 2. apps/api → Render 배포

1. Render 대시보드 → New → Web Service → 이 레포 선택
2. Root Directory: `apps/api` (또는 `render.yaml`이 레포 루트에 있으면 자동 인식 — 지금은 `apps/api/render.yaml`에 있으므로 Render가 자동으로 못 찾으면 대시보드에서 수동 설정)
3. Build Command: `npm install && npm run prisma:generate && npm run build`
4. Start Command: `npm run start`
5. Health Check Path: `/health` (이미 구현됨, `{"status":"ok"}` 200 응답 확인됨)
6. 환경변수 등록 (`render.yaml`에 나열된 키 전부, 값은 `sync: false`라 대시보드에서 직접 입력 필요)
   - `NODE_ENV=production`, `PORT=4000`, `DATABASE_URL`, `JWT_SECRET`, `TEST_ACCOUNT_ID`, `TEST_ACCOUNT_PASSWORD`, `CLOUDINARY_*`
7. 배포 후 확인
   - [ ] `https://{render-domain}/health` → 200 `{"status":"ok"}`
   - [ ] `https://{render-domain}/api/quests/recommend` → POST 요청 시 정상 응답 (Bearer 토큰 필요)
   - [ ] 최초 배포 시 `npx prisma migrate deploy`를 한 번 실행해서 운영 DB에 마이그레이션 반영 필요 (Render Shell 또는 배포 훅에서)

## 3. apps/web → Vercel 배포

1. Vercel 대시보드 → Add New → Project → 이 레포 선택
2. Root Directory: `apps/web`으로 설정 (모노레포라 필수)
3. Framework Preset: Vite (자동 인식됨), Build Command/Output Directory는 `apps/web/vercel.json`에 이미 지정돼 있음
4. 환경변수 등록: `VITE_API_BASE_URL` = 2단계에서 나온 Render API 도메인 (예: `https://pizzly-api.onrender.com`)
5. 배포 후 확인
   - [ ] 배포된 URL 접속 시 placeholder 화면(FE1/FE2가 실제 화면으로 교체 예정) 정상 렌더링
   - [ ] `/manifest.json` 직접 접속 시 정상 응답
   - [ ] 브라우저 개발자도구 → Application → Manifest에서 아이콘/이름 정상 인식되는지 확인
   - [ ] 브라우저 개발자도구 → Application → Service Workers에 `sw.js` 등록 확인

## 4. PWA 설치 조건 점검

- [x] HTTPS — Vercel/Render 배포 환경 기본 제공 (로컬 http에서는 설치 프롬프트 자체가 안 뜸, 배포 후에만 확인 가능)
- [x] `manifest.json` 필수 항목(name/short_name/start_url/display/background_color/theme_color/icons) — 작성 완료
- [ ] **아이콘 실물 파일 없음** — `apps/web/public/icons/`에 192x192, 512x512, maskable 버전 PNG가 아직 없음(DS 에셋 대기 중). 지금 배포하면 manifest는 유효해도 설치 프롬프트에 아이콘이 깨져 보일 수 있음 — DS 에셋 도착 즉시 채워 넣어야 함
- [x] 서비스워커 — `vite-plugin-pwa`로 `generateSW` 방식 적용, 정적 자산 캐싱 / API 응답 캐싱 제외 확인됨(로컬 빌드로 검증)
- [ ] `beforeinstallprompt` 노출 시점 조정 — FE 쪽에서 "홈 화면 진입 이후 적절한 시점"에 띄우도록 구현 필요 (CLAUDE.md 규칙, 아직 미구현 — FE1/FE2 영역)

## 5. 참고

- 지금 `apps/web`은 실제 화면 없이 vite-plugin-pwa 빌드 검증용 placeholder(`src/main.tsx`)만 있는 상태. FE1/FE2가 실제 앱을 채워 넣어도 `vite.config.ts`의 PWA 설정은 그대로 유지하면 됨.
- `apps/api`의 운영 MySQL을 어디에 둘지(PlanetScale/Railway/기타)는 아직 팀 결정이 필요함 — Render 자체는 관리형 MySQL을 제공하지 않음.
