import { apiClient, USE_MOCK } from './api-client';
import { pickQuest } from '../mocks/recommend.mock';
import type { Quest, QuestCompleteResult, QuestContext, QuestDuration, QuestSituation } from '../types/quest';
import type { Restriction, WellnessArea } from '../types/onboarding';

// FE1 내부 값(WellnessArea/QuestSituation)과 서버 값 이름이 달라서 API 경계에서만 변환한다.
// (BE2가 만든 추천 엔진은 condition=EYE_FATIGUE 처럼 컨디션 전용 이름, situation=QUIET_PLACE 를 씀)
const CONDITION_TO_SERVER: Record<WellnessArea, string> = {
  EYE: 'EYE_FATIGUE',
  WRIST: 'WRIST_FINGER',
  NECK_SHOULDER: 'NECK_SHOULDER',
  REST: 'REST',
};

const SITUATION_TO_SERVER: Record<QuestSituation, string> = {
  SITTING: 'SITTING',
  STANDING: 'STANDING',
  MOVING: 'MOVING',
  QUIET: 'QUIET_PLACE',
};

const DURATION_SEC: Record<QuestDuration, number> = { 1: 60, 3: 180, 5: 300 };

interface ServerRecommendedQuest {
  questId: string;
  questCode: string;
  title: string;
  category: string;
  duration: QuestDuration;
  priority: number;
  matchScore: number;
}

interface ServerQuestDetail {
  id: string;
  steps: string[];
  guideType: 'PIZZLY_SIGNATURE' | 'GENERAL' | 'EITHER';
}

// 같은 QST-01~03 조건으로 "다른 퀘스트 볼래요"를 누르면 재요청 없이 같은 응답 안에서 다음 순위로 넘어간다.
let cachedList: ServerRecommendedQuest[] = [];
let cachedContextKey = '';
let shownIds = new Set<string>();

function contextKey(context: QuestContext): string {
  return `${context.durationMin}-${context.situation}-${context.condition}`;
}

async function getQuestDetail(questId: string): Promise<ServerQuestDetail> {
  return apiClient.get<ServerQuestDetail>(`/api/quests/${questId}`);
}

/**
 * [QST-04] 퀘스트 추천.
 */
export async function recommendQuest(
  context: QuestContext,
  options: { excludeId?: string; restrictions?: Restriction[] } = {},
): Promise<Quest | null> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return pickQuest(context, options);
  }

  const key = contextKey(context);
  if (key !== cachedContextKey) {
    const res = await apiClient.post<{ quests: ServerRecommendedQuest[] }>('/api/quests/recommend', {
      duration: context.durationMin,
      situation: SITUATION_TO_SERVER[context.situation],
      condition: CONDITION_TO_SERVER[context.condition],
    });
    cachedList = res.quests;
    cachedContextKey = key;
    shownIds = new Set();
  }

  if (options.excludeId) shownIds.add(options.excludeId);

  const picked = cachedList.find((quest) => !shownIds.has(quest.questId));
  if (!picked) return null;

  const detail = await getQuestDetail(picked.questId);

  return {
    id: picked.questId,
    title: picked.title,
    area: context.condition,
    durationSec: DURATION_SEC[picked.duration],
    slots: [picked.duration],
    situations: [context.situation],
    excludeIf: [],
    guideType: detail.guideType === 'GENERAL' ? 'GENERAL' : 'SIGNATURE',
    steps: detail.steps,
  };
}

/**
 * [QST-07] 퀘스트 완료.
 * 서버: POST /api/quests/complete — 바디 { questId, elapsedSeconds }
 */
export async function completeQuest(
  questId: string,
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
