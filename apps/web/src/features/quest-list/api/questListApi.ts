import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetQuestList, mockSetQuestSaved } from '../../../mocks/questList.mock';
import type { QuestListItem } from '../types';

/** BE2 담당(추천/카테고리 데이터 + 보관함 여부) */
export async function getQuestList(): Promise<QuestListItem[]> {
  if (USE_MOCK) return mockGetQuestList();
  return api.get<QuestListItem[]>('/quests/list');
}

export async function setQuestSaved(id: string, saved: boolean): Promise<void> {
  if (USE_MOCK) return mockSetQuestSaved(id, saved);
  if (saved) {
    await api.post<{ saved: boolean }>(`/quests/${id}/bookmark`);
  } else {
    await api.delete<{ saved: boolean }>(`/quests/${id}/bookmark`);
  }
}
