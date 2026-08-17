import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetQuestList } from '../../../mocks/questList.mock';
import type { QuestListItem } from '../types';

/** BE2 담당(추천/카테고리 데이터), 보관함 여부는 BE1 담당 예정. */
export async function getQuestList(): Promise<QuestListItem[]> {
  if (USE_MOCK) return mockGetQuestList();
  return api.get<QuestListItem[]>('/quests/list');
}
