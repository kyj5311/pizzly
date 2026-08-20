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

export async function mockSetDevLevel(
  level: number,
  exp?: number,
): Promise<{ level: number; exp: number; growthStage: number }> {
  await new Promise((r) => setTimeout(r, 150));
  const growthStage = level >= 100 ? 4 : level >= 60 ? 3 : level >= 30 ? 2 : 1;
  return { level, exp: exp ?? (level - 1) * 100, growthStage };
}

export async function mockSetDevToken(token: number): Promise<{ token: number }> {
  await new Promise((r) => setTimeout(r, 150));
  return { token };
}
