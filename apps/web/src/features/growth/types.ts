/** 성장 도메인 타입 (소유자: FE2, 판정 로직은 BE2) */
export type GrowthMilestone = 30 | 60 | 100;

export interface GrowthResult {
  gainedExp: number;
  previousLevel: number;
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
  /** GRW-02 — 이번 완료로 새로 도달한 마일스톤. 없으면 undefined */
  reachedMilestone?: GrowthMilestone;
}

export const MILESTONE_MESSAGE: Record<GrowthMilestone, string> = {
  30: '중간 크기로 성장했어요!',
  60: '근육이 성장했어요!',
  100: '피즐리베어로 성장했어요!',
};
