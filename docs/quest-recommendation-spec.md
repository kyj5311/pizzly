# 퀘스트 추천 엔진 입출력 스펙 (초안)

BE2 소관. 1차는 규칙 기반 매칭으로 구현하고, LLM 보강은 여지만 남겨둔다.

## 1. 입력

```ts
interface RecommendQuestInput {
  duration: 1 | 3 | 5 // 분 단위, 온보딩/홈에서 사용자가 고른 값
  situation: 'SITTING' | 'STANDING' | 'MOVING' | 'QUIET_PLACE'
  condition: 'EYE_FATIGUE' | 'WRIST_FINGER' | 'NECK_SHOULDER' | 'REST'
  interests?: QuestCategory[] // 온보딩에서 저장한 관심영역 (User.interests)
  restrictions?: QuestCategory[] // 온보딩에서 저장한 제한사항 (User.restrictions), 추천에서 제외
}

type QuestCategory = 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'BREATH_REST'
```

- `duration`/`situation`/`condition`은 필수, 매 추천 요청마다 사용자가 그 자리에서 선택하는 값
- `interests`/`restrictions`는 로그인한 사용자의 온보딩 데이터에서 서버가 채워 넣음(요청 바디로 안 받고 `userId` 기준 조회)

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

## 3. 매칭 로직 (규칙 기반)

PM 기준표에는 `condition` 전용 필드가 없다. `input.condition`(눈 피로/손목·손가락/목·어깨/휴식)은 그대로 `Quest.category`(눈 건강/손목·손가락/목·어깨/호흡·휴식)로 1:1 매핑해서 사용한다.

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

1. **필수 필터**: `Quest.isActive === true` AND `Quest.duration === input.duration`
2. **상황 필터**: `input.situation === 'QUIET_PLACE'`면 `Quest.environment`에 "조용" 포함 여부로, 그 외에는 `Quest.posture`에 매핑된 자세 라벨 포함 여부로 필터링
3. **제한사항 제외**: `input.restrictions`에 속한 `category`는 후보에서 제외
4. **스코어링** (남은 후보 대상)
   - `Quest.category === CONDITION_CATEGORY_MAP[input.condition]`이면 `+3`
   - `Quest.category`가 `input.interests`에 포함되면 `+2`
   - 최근 24시간 내 같은 사용자가 완료한 퀘스트면 `-1` (다양성 확보, 완전 제외는 아님)
5. **정렬 및 우선순위 부여**: `matchScore` 내림차순 정렬 → 상위 3개까지 `priority` 1, 2, 3 부여
6. **결과 없음 처리**: 필터링 후 후보가 0개면 2번(상황 필터)까지만 적용한 완화 조건으로 1회 재시도 → 그래도 없으면 `QUEST_001`

> ⚠️ **검증 중 발견한 이슈**: PM 엑셀의 "추천_로직_예시" 시트 6개 케이스를 위 로직에 대입하면 **1순위는 6개 전부 일치**하지만, **2순위는 대부분 불일치**한다. PM 예시의 2순위는 "동일 카테고리의 한 단계 더 짧은 시간(예: 3분 요청 시 2순위로 1분짜리)" 패턴인데, 지금 로직은 `duration`을 정확히 일치하는 후보만 필터링하기 때문에 애초에 다른 duration의 퀘스트가 후보에 들어오지 않는다. 이 부분은 알고리즘을 category 우선 + duration 단계별 폴백 방식으로 다시 설계해야 할 수 있어 사용자 확인 후 반영 예정 (아래 5장 참고).

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
- 시드 데이터: [apps/api/prisma/seed.ts](../apps/api/prisma/seed.ts) (PM 기준표 12개 퀘스트)

## 5. PM 예시 케이스 검증 (추천_로직_예시 시트)

| # | 입력(시간/상황/컨디션) | PM 기대 1순위 | PM 기대 2순위 | 현재 로직 1순위 | 현재 로직 2순위 |
|---|---|---|---|---|---|
| 1 | 1분 / 앉아있음 / 눈 건강 | EYE_01_01 | - | ✅ EYE_01_01 | ❌ (duration 불일치 후보 없어 다른 카테고리로 채워짐) |
| 2 | 3분 / 앉아있음 / 손목·손가락 | WRIST_03_01 | WRIST_01_01(1분) | ✅ WRIST_03_01 | ❌ (1분 퀘스트는 애초에 후보 아님) |
| 3 | 5분 / 서있음 / 목·어깨 | NECK_05_01 | NECK_03_01(3분) | ✅ NECK_05_01 | ❌ |
| 4 | 3분 / 조용한 장소 / 호흡·휴식 | BREATH_03_01 | BREATH_01_01(1분) | ✅ BREATH_03_01 | ❌ |
| 5 | 5분 / 앉아있음 / 눈 건강 | EYE_05_01 | EYE_03_01(3분) | ✅ EYE_05_01 | ❌ |
| 6 | 1분 / 서있음 / 목·어깨 | NECK_01_01 | - | ✅ NECK_01_01 | ❌ (duration 불일치 후보 없어 다른 카테고리로 채워짐) |

**결론**: 1순위(6/6) 전부 일치 — `condition→category` 매핑과 `situation→posture/environment` 매핑은 올바르게 작동. 2순위(0/6) 전부 불일치 — PM은 "동일 카테고리·더 짧은 duration"을 2순위로 기대하지만 현재 로직은 duration을 1차 필수 필터로 걸어버려서 후보에 들어오지 못함. 알고리즘 리비전 필요 여부는 사용자 확인 후 진행.
