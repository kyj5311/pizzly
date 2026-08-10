# CLAUDE.md — 피즐리(Pizzly) 프로젝트 공통 규칙

이 파일은 AI 코딩 에이전트(Claude Code 등)가 이 레포에서 코드를 생성할 때 반드시 따라야 하는 규칙입니다.
여러 명이 각자 AI 에이전트로 동시에 개발하므로, 아래 규칙에서 벗어난 스타일로 코드를 생성하지 마세요.
프로덕트가 무엇이고 왜 만드는지는 [README.md](./README.md)를 참고하세요.

## 팀 구성 및 담당 영역
| 역할 | 담당 축 |
|---|---|
| BE1 | 캐릭터·보상 데이터 (로그인/온보딩 저장, 홈 상태 API, 퀘스트 완료 기록, 보상 로직) |
| BE2 | 추천 엔진·성장·기록·PWA 인프라 (퀘스트 추천 엔진, 성장(레벨업) 로직, 기록 조회 API, 패스/프리미엄 결제 연동, 배포 인프라) |
| FE1 | 온보딩·퀘스트 수행 (로그인/온보딩 전체, 퀘스트 시간·상황·컨디션 선택~완료 전체) |
| FE2 | 홈·성장·상점·패스·기록 (홈, 성장 축하 화면 및 이미지 저장, 상점, 패스, 기록 전체) |
| PM | IA/화면 흐름, 퀘스트 콘텐츠 기준표, 카피, QA 시나리오, 서류 심사·발표 자료 |
| DS | 디자인 시스템, 캐릭터 비주얼, 화면 시안, PWA 아이콘/스플래시 |

세부 역할 분담은 [개발 계획 노션 페이지](https://app.notion.com/p/3b7be414a288811fa42cce622d640e6e) 참고.

## 기술 스택
| 영역 | 선택 |
|---|---|
| 프론트엔드 | React 18 + TypeScript + Vite |
| 스타일링 | Tailwind CSS v4 (@tailwindcss/vite) |
| PWA | vite-plugin-pwa (Workbox 기반) |
| 상태 관리 | React Context + useState (필요시 Zustand) |
| 백엔드 | Node.js(LTS 20.x) + Express + TypeScript |
| DB | MySQL 8 (Prisma ORM) |
| 이미지 저장 | Cloudinary (무료 티어) |
| 인증 | JWT (Bearer 토큰) — 정식 소셜 로그인(Google 등) 대신 사전 준비된 테스트 계정으로 로그인 |
| 패키지 매니저 | npm (yarn/pnpm 혼용 금지) |
| 로컬 런타임 | Node 20 LTS |

## 모노레포 구조
```
pizzly/
├── apps/
│   ├── web/                  # 프론트엔드 (React + Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── public/
│   │       ├── manifest.json
│   │       └── icons/
│   └── api/                  # 백엔드 (Express)
│       └── src/
│           ├── routes/
│           ├── controllers/
│           ├── services/     # 도메인 분리: quest, reward, growth 등
│           ├── models/
│           ├── middlewares/
│           ├── types/
│           └── utils/
├── .env.example
├── README.md
└── CLAUDE.md
```

## 코드 컨벤션
- 변수·함수: camelCase (예: `getQuestList`)
- 컴포넌트·클래스·타입: PascalCase (예: `QuestCard`, `PizzlyAvatar`)
- 상수: UPPER_SNAKE_CASE (예: `MAX_LEVEL`)
- 파일명: 컴포넌트는 PascalCase(`QuestCard.tsx`), 그 외는 kebab-case(`api-client.ts`)
- API 엔드포인트: 소문자 + 하이픈, 복수형 명사 (예: `/api/quests`, `/api/pizzly-status`)
- Lint/Format: ESLint(airbnb-typescript 또는 standard) + Prettier, 저장 시 자동 포맷 적용

## API / 데이터 규약
공통 응답 포맷(성공):
```json
{ "success": true, "data": { }, "error": null }
```
공통 응답 포맷(실패):
```json
{ "success": false, "data": null, "error": { "code": "QUEST_001", "message": "..." } }
```
- HTTP 상태코드: 200 / 201 / 400 / 401 / 404 / 500 만 사용
- 에러코드: `{도메인}_{번호}` 형식 (예: `AUTH_001`, `QUEST_001`, `GROWTH_001`, `REWARD_001`)
- 날짜/시간: ISO 8601 (예: `2026-08-25T09:00:00+09:00`)
- 인증: `Authorization: Bearer {JWT}` 헤더. 회원가입 없이 사전 준비된 테스트 계정으로 로그인
- 타이머/진행 상태: 클라이언트에서 초단위 관리, 서버는 완료 시점 결과값만 수신(`elapsedSeconds` 등)

## Git 협업 규칙
- 브랜치: `main`(배포용, 보호) / `dev`(통합용) / `feature/{이름}-{기능}` (예: `feature/be2-quest-engine`)
- 커밋: Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`)
- PR: 최소 1인 승인 후 머지, `dev`로만 머지(직접 `main` 머지 금지), 변경 화면 스크린샷 첨부 권장
- 머지 방식: Squash and merge

## 디자인 시스템
- 토큰: Figma Variables → `apps/web/src/index.css`의 `@theme { --color-*, --font-*, --spacing-* }` 블록 (Tailwind v4)
- 공통 컴포넌트명: PascalCase, 디자인 파일과 1:1 일치 (`Button`, `Card`, `Badge`, `ProgressBar` 등)
- props: camelCase, 공통 props명 통일 (`variant`, `size`, `disabled`)
- 아이콘: `lucide-react` 통일, 임의 SVG 혼용 금지
- 캐릭터 에셋: 피즐리 성장 단계별 SVG/Lottie 파일명은 단계 번호로 통일 (예: `pizzly-lv1.svg`)
- PWA 아이콘: 192x192, 512x512 필수 + maskable 아이콘 별도 준비
- 앱 타이틀: "피즐리 (Pizzly)"로 통일, `manifest.json`의 `short_name`/`name`에도 동일 반영

> 참고: 디자이너(DS) 입원으로 8/11~12까지 정식 디자인 시안이 나오지 않습니다. 그 전까지는 기본 버튼·카드 등 임시 스타일로 화면을 먼저 구현하고, DS 시안 도착 시 컴포넌트 스타일만 교체합니다.

## 환경변수 / 시크릿 관리
- `.env`(개인 로컬, 실키값) / `.env.example`(레포 커밋, 키 이름만·값은 빈칸)
- `.gitignore`에 `.env` 전체 제외, `.env.example`만 커밋 허용
- LLM API·Cloudinary 등 비공개 키는 팀 노션 비공개 페이지에만 기록, 채팅방·레포 노출 금지
- 배포 환경변수는 Vercel/Render 대시보드에서 별도 등록

## PWA 규칙
- `manifest.json` 필수 항목: `name`, `short_name`, `start_url`, `display(standalone)`, `background_color`, `theme_color`, `icons(192/512)`
- 서비스워커: 정적 자산(아이콘·폰트) 캐싱 우선, API 응답은 캐싱 제외(항상 최신 데이터)
- HTTPS: 배포 환경(Vercel/Render) 기본 적용 확인 필수(PWA 설치 조건)
- 설치 프롬프트: `beforeinstallprompt` 이벤트는 홈 화면 진입 이후 적절한 시점에 노출(첫 진입 즉시 X)

## 기타 확정 사항
- 로그인: Google 등 정식 소셜 로그인 미구현, 사전 준비된 테스트 계정으로 접속
- SNS 공유: 실제 SNS API 연동 없이 이미지 저장(다운로드)만 구현. 발표 시 "추후 SNS 직접 공유 기능 추가 예정"으로 안내

## 참고 문서
- [개발 계획](https://app.notion.com/p/3b7be414a288811fa42cce622d640e6e)
- [컨벤션 체크리스트 초안](https://app.notion.com/p/3b7be414a28881d49d8ee6c2a3a13cb3)
