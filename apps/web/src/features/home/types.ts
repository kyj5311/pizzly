/** 홈 도메인 타입 (소유자: FE2) */
export interface HomeStatus {
  characterLevel: number;
  growthCurrent: number;
  growthTarget: number;
  tokenBalance: number;
  /** HOM-03, P1 */
  todayCompletedCount: number;
  totalCompletedCount: number;
  /** HOM-04, P1 */
  hasPass: boolean;
  passExpiresInDays?: number;
}
