import { QUEST_MASTER } from './quest.mock';
import type { Quest, QuestContext } from '../types/quest';
import type { Restriction } from '../types/onboarding';

/**
 * 추천 로직 (임시 · 규칙 기반).
 * ※ BE2 추천 엔진이 완성되면 이 파일 대신 서버 응답을 쓴다.
 * ※ 필터 우선순위: 시간 슬롯 → 상황 → 제한사항 → 컨디션(영역)
 */
export function pickQuest(
  context: QuestContext,
  options: { excludeId?: string; restrictions?: Restriction[] } = {},
): Quest | null {
  const { excludeId, restrictions = [] } = options;

  const candidates = QUEST_MASTER.filter((quest) => {
    if (quest.id === excludeId) return false;
    if (!quest.slots.includes(context.durationMin)) return false;
    if (!quest.situations.includes(context.situation)) return false;
    if (quest.excludeIf.some((limit) => restrictions.includes(limit))) return false;
    return true;
  });

  // 선택한 컨디션과 같은 영역을 우선 추천, 없으면 나머지에서 고른다
  const sameArea = candidates.filter((quest) => quest.area === context.condition);
  const pool = sameArea.length > 0 ? sameArea : candidates;

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
