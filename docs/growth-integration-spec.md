# 성장(레벨업) 로직 연동 가이드 (GRW-01/02, BE2 → BE1)

BE2가 만든 `applyGrowth()`를 BE1의 보상 로직(REW-01~04)이 어떻게 호출해야 하는지 정리한 문서.
구현: [apps/api/src/services/growth.service.ts](../apps/api/src/services/growth.service.ts)

## 1. 호출 시점

BE1이 `RewardLog`를 생성해서 경험치 지급을 확정한 **직후**, 같은 요청 처리 흐름 안에서 호출한다. 별도 HTTP 엔드포인트가 아니라 서버 내부 함수 호출이다(같은 `apps/api` 코드베이스이므로 그냥 `import`해서 쓰면 됨).

```ts
import { applyGrowth } from '../services/growth.service'

// 예: 퀘스트 완료 → 보상 지급 컨트롤러 안에서
const rewardLog = await createRewardLog(userId, questLogId, expReward) // BE1 로직
const growthResult = await applyGrowth(userId, expReward)
```

## 2. 함수 시그니처

```ts
function applyGrowth(userId: string, expGained: number): Promise<ApplyGrowthResult>

interface ApplyGrowthResult {
  level: number
  exp: number // 누적 경험치 총합 (레벨 내 잔여치가 아님)
  stage: number // 1~4, 성장 단계(외형)
  leveledUp: boolean // 이번 호출로 레벨이 올랐는지
  stageUp: boolean // 이번 호출로 성장 단계가 바뀌었는지 (GRW-03 축하 화면 트리거 조건)
}
```

- `expGained`은 이번에 지급된 경험치만 넘긴다 (누적값 아님). 내부에서 `Pizzly.exp`에 더해서 처리한다.
- 레벨 공식: `level = floor(누적exp / 100) + 1` (MVP 임시값, 상수 `EXP_PER_LEVEL`로 분리돼 있어 나중에 조정 쉬움)
- 성장 단계: Lv1-29=1단계, 30-59=2단계, 60-99=3단계, 100+=4단계. Lv.130 이후는 새 단계 없이 그대로 4단계 유지(GRW-04는 PM 카피 영역이라 BE 로직과 무관).

## 3. 에러 처리

`applyGrowth`는 두 가지 상황에서 예외를 던진다. BE1 컨트롤러에서 잡아서 아래 에러코드로 응답하면 된다 (정의: [apps/api/src/types/error-codes.ts](../apps/api/src/types/error-codes.ts)).

| 상황 | 현재 동작 | 매핑할 에러코드 |
|---|---|---|
| 해당 `userId`의 `Pizzly` 레코드가 없음 (온보딩 ONB-03 미완료 등) | Prisma `NotFoundError` throw | `GROWTH_001` |
| `expGained`이 음수이거나 정수가 아님 | `Error('INVALID_EXP_GAINED')` throw | `GROWTH_002` |

```ts
try {
  const growthResult = await applyGrowth(userId, expReward)
  // ...
} catch (err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return sendError(res, 400, GROWTH_ERROR_CODES.GROWTH_001)
  }
  if (err instanceof Error && err.message === 'INVALID_EXP_GAINED') {
    return sendError(res, 400, GROWTH_ERROR_CODES.GROWTH_002)
  }
  throw err
}
```

## 4. 응답에 포함해야 할 값

FE2의 GRW-03(성장 축하 화면)이 "레벨업/단계업 했는지"를 알아야 축하 연출을 띄울지 판단할 수 있다. BE1의 보상 지급 응답(공통 포맷)에 `growthResult`를 그대로 실어 보내는 걸 권장한다.

```json
{
  "success": true,
  "data": {
    "reward": { "expGained": 50, "...": "..." },
    "growth": {
      "level": 31,
      "exp": 3000,
      "stage": 2,
      "leveledUp": true,
      "stageUp": true
    }
  },
  "error": null
}
```

FE2는 `growth.stageUp === true`일 때만 GRW-03 화면을 띄우면 된다.
