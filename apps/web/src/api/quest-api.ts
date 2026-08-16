import { apiClient, USE_MOCK } from './api-client';
import { pickQuest } from '../mocks/recommend.mock';
import type { Quest, QuestCompleteResult, QuestContext } from '../types/quest';
import type { Restriction } from '../types/onboarding';

/**
 * [QST-04] 퀘스트 추천.
 * ※ 서버 추천 엔진(BE2) 미구현 상태 — 엔드포인트는 확정되면 교체한다.
 */
export async function recommendQuest(
  context: QuestContext,
  options: { excludeId?: number; restrictions?: Restriction[] } = {},
): Promise<Quest | null> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return pickQuest(context, options);
  }
  return apiClient.post<Quest | null>('/api/quests/recommend', {
    ...context,
    excludeId: options.excludeId,
  });
}

/**
 * [QST-07] 퀘스트 완료.
 * 서버: POST /api/quests/complete — 바디 { questId }
 */
export async function completeQuest(
  questId: number,
  elapsedSeconds: number,
): Promise<QuestCompleteResult> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      pizzly: { level: 1, exp: 20, token: 11, growthStage: 1 },
      reward: { exp: 20, token: 1 },
    };
  }
  return apiClient.post<QuestCompleteResult>('/api/quests/complete', {
    questId,
    elapsedSeconds,
  });
}
