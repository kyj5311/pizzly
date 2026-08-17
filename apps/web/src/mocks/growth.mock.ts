import type { GrowthResult } from '../features/growth/types';

/** FE2 소유. BE2 연동 전까지 성장 축하 화면을 끝까지 돌리기 위한 데이터. */
const RESULT: GrowthResult = {
  gainedExp: 170,
  previousLevel: 25,
  currentLevel: 26,
  currentExp: 1420,
  nextLevelExp: 2000,
};

export async function mockGetGrowthResult(): Promise<GrowthResult> {
  await new Promise((r) => setTimeout(r, 150));
  return RESULT;
}
