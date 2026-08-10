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

1. **필수 필터**: `Quest.isActive === true` AND `Quest.duration === input.duration`
2. **상황 필터**: `Quest.situations`에 `input.situation` 포함된 것만 남김
3. **제한사항 제외**: `input.restrictions`에 속한 `category`는 후보에서 제외
4. **스코어링** (남은 후보 대상)
   - `Quest.conditions`에 `input.condition` 포함 시 `+3`
   - `Quest.category`가 `input.interests`에 포함되면 `+2`
   - 최근 24시간 내 같은 사용자가 완료한 퀘스트면 `-1` (다양성 확보, 완전 제외는 아님)
5. **정렬 및 우선순위 부여**: `matchScore` 내림차순 정렬 → 상위 3개까지 `priority` 1, 2, 3 부여
6. **결과 없음 처리**: 필터링 후 후보가 0개면 2번(상황 필터)까지만 적용한 완화 조건으로 1회 재시도 → 그래도 없으면 `QUEST_001`

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
