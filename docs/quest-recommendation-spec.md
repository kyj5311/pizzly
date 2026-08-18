# 퀘스트 추천 엔진 입출력 스펙 (초안)

BE2 소관. 1차는 규칙 기반 매칭으로 구현하고, LLM 보강은 여지만 남겨둔다.

## 1. 입력

```ts
interface RecommendQuestInput {
  duration: 1 | 3 | 5 // 분 단위, 온보딩/홈에서 사용자가 고른 값
  situation: 'SITTING' | 'STANDING' | 'MOVING' | 'QUIET_PLACE'
  condition: 'EYE_FATIGUE' | 'WRIST_FINGER' | 'NECK_SHOULDER' | 'REST'
  interests?: QuestCategory[] // 온보딩에서 저장한 관심영역 (Onboarding.interests)
  restrictions?: QuestCategory[] // 온보딩에서 저장한 제한사항 (Onboarding.restrictions), 추천에서 제외
}

type QuestCategory = 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'BREATH_REST'
```

- `duration`/`situation`/`condition`은 필수, 매 추천 요청마다 사용자가 그 자리에서 선택하는 값 (QST-01 시간 → QST-02 상황 → QST-03 컨디션 순으로 선택, `condition`이 추천 직전 마지막으로 정하는 가장 구체적인 신호)
- `restrictions`는 로그인한 사용자의 온보딩 데이터에서 서버가 채워 넣음(요청 바디로 안 받고 `userId` 기준 조회)
- `interests`는 온보딩 데이터로 계속 저장은 하지만, 3장 알고리즘이 `condition`으로 카테고리를 확정하는 방식으로 바뀌면서 현재 추천 매칭에는 사용하지 않음 (다른 화면에서 활용 여지는 있음)

## 2. 출력

```ts
interface RecommendQuestOutput {
  quests: RecommendedQuest[]
}

interface RecommendedQuest {
  questId: string
  questCode: string // PM 기준표 ID (예: EYE_05_01), QA 교차 확인용
  title: string
  category: QuestCategory
  duration: 1 | 3 | 5
  priority: number // 1이 최우선, 추천 리스트 내 순서
  matchScore: number // 내부 스코어링 값 (디버깅/QA용, 클라이언트 노출 여부는 FE1과 협의)
}
```

- 공통 응답 포맷 준수: `{ success: true, data: { quests: [...] }, error: null }`
- 조건에 맞는 퀘스트가 하나도 없으면 `QUEST_001` 에러 반환 (빈 배열로 200을 주지 않음)

## 3. 매칭 로직 (규칙 기반, category-lock + duration 폴백)

`input.condition`으로 **카테고리를 먼저 하나로 고정**한다. 다른 카테고리는 아예 후보에 들어오지 않는다 (PM 기준표에 `condition` 전용 필드가 없고, `input.condition`이 `Quest.category`와 1:1 대응하기 때문).

```ts
const CONDITION_CATEGORY_MAP: Record<QuestCondition, QuestCategory> = {
  EYE_FATIGUE: 'EYE',
  WRIST_FINGER: 'WRIST',
  NECK_SHOULDER: 'NECK_SHOULDER',
  REST: 'BREATH_REST'
}
```

`input.situation`(앉아있음/서있음/이동 중/조용한 장소)은 PM 기준표의 `posture`(자세)와 `environment`(환경) 두 필드로 나뉘어 저장돼 있어 아래처럼 매핑한다.

```ts
// SITTING/STANDING/MOVING → Quest.posture 배열에 매핑값 포함 여부로 판단
// QUIET_PLACE → Quest.environment 텍스트에 "조용" 포함 여부로 판단
const POSTURE_LABEL_MAP: Record<'SITTING' | 'STANDING' | 'MOVING', string> = {
  SITTING: '앉아 있음',
  STANDING: '서 있음',
  MOVING: '이동 중'
}
```

1. **카테고리 고정**: `targetCategory = CONDITION_CATEGORY_MAP[input.condition]`. `targetCategory`가 `input.restrictions`에 속하면 바로 빈 배열 반환 (→ `QUEST_001`)
2. **카테고리 내 후보 조회**: `Quest.isActive === true` AND `Quest.category === targetCategory`인 퀘스트만 조회 (duration 무관하게 해당 카테고리 전체)
3. **duration tier 폴백 순서 결정**: `input.duration`부터 시작해 그보다 짧은 duration으로 내려가는 목록. 예) 요청 5분 → `[5, 3, 1]`, 요청 3분 → `[3, 1]`, 요청 1분 → `[1]`
4. **tier별 상황 필터 + 다양성 정렬**: 각 tier에서 `posture`/`environment`가 `input.situation`과 맞는 퀘스트만 남기고, 최근 24시간 내 같은 사용자가 완료한 퀘스트는 뒤로 밀어서 정렬(완전 제외는 아님 — 후보가 그것뿐이면 그래도 추천)
5. **우선순위 채우기**: tier를 앞에서부터(정확한 duration → 한 단계 짧은 duration → …) 순서대로 순회하며 최대 3개(`MAX_RECOMMENDATIONS`)까지 `priority` 1, 2, 3 부여. `matchScore`는 QA용 디버그 값(정확한 duration일수록, 최근 미완료일수록 높음)
6. **결과 없음 처리**: 모든 tier를 다 돌아도 후보가 0개면 `QUEST_001`

> 참고: `situation === 'MOVING'`(이동 중)을 지원하는 퀘스트가 현재 시드 36개 중 하나도 없어서, 지금은 이 조합으로 요청하면 항상 `QUEST_001`이 된다. 콘텐츠 갭이며 PM에게 알릴 필요 있음.

```
// LLM 보강 여지:
// - 위 규칙 기반 스코어링 결과에 사용자 자유 텍스트(예: "눈이 너무 아파요") 입력을 추가로 받는 경우,
//   LLM으로 condition/category를 보조 추론해서 1차 필터 입력값을 보정하는 용도로 사용 가능
// - 추천 사유 문구("지금 앉아서 눈 피로 풀기 좋아요" 등)를 LLM으로 생성해 matchScore와 별개로 붙이는 것도 고려 가능
// - MVP 단계에서는 미구현, 규칙 기반 결과만으로 우선 출시
```

## 4. 관련 데이터

- 참고 스키마: [apps/api/prisma/schema.prisma](../apps/api/prisma/schema.prisma) `Quest` 모델
- 참고 엔드포인트: [apps/api/src/routes/quest.routes.ts](../apps/api/src/routes/quest.routes.ts)
- 시드 데이터: [apps/api/prisma/seed.ts](../apps/api/prisma/seed.ts) (PM 기준표 36개 퀘스트, 영역×시간당 3개씩)

## 5. PM 예시 케이스 검증 (추천_로직_예시 시트)

category-lock + duration 폴백 방식으로 재설계 후 재검증한 결과.

| # | 입력(시간/상황/컨디션) | PM 기대 1순위 | PM 기대 2순위 | 현재 로직 결과 |
|---|---|---|---|---|
| 1 | 1분 / 앉아있음 / 눈 건강 | EYE_01_01 | - | ✅ [EYE_01_01] (1분보다 짧은 tier가 없어 1개만 반환) |
| 2 | 3분 / 앉아있음 / 손목·손가락 | WRIST_03_01 | WRIST_01_01(1분) | ✅ [WRIST_03_01, WRIST_01_01] |
| 3 | 5분 / 서있음 / 목·어깨 | NECK_05_01 | NECK_03_01(3분) | ✅ [NECK_05_01, NECK_03_01, NECK_01_01] — PM 표엔 2칸뿐이라 안 보이지만 1분 tier까지 남은 자리(3순위)를 채움. 1·2순위는 일치, 상충 아님 |
| 4 | 3분 / 조용한 장소 / 호흡·휴식 | BREATH_03_01 | BREATH_01_01(1분) | ✅ [BREATH_03_01, BREATH_01_01] |
| 5 | 5분 / 앉아있음 / 눈 건강 | EYE_05_01 | EYE_03_01(3분) | ✅ [EYE_05_01, EYE_03_01, EYE_01_01] — 3번과 동일하게 3순위 추가 |
| 6 | 1분 / 서있음 / 목·어깨 | NECK_01_01 | - | ✅ [NECK_01_01] |

**결론**: 6/6 케이스 모두 PM이 명시한 1·2순위와 일치. 3·5번은 `MAX_RECOMMENDATIONS = 3` 설계상 자연스럽게 3순위까지 채워지는데, PM 표는 컬럼이 2개뿐이라 안 보였을 뿐 어긋나는 내용은 아님 — 3순위 노출 여부는 FE1과 UI 협의 필요.

(참고: `npm install` 전이라 이 표는 실제 코드 실행이 아니라 로직을 손으로 대입해 확인한 결과다. `npm install` 이후 자동화된 테스트로 다시 검증 권장.)
