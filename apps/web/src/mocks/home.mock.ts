import type { HomeStatus } from '../features/home/types';

/** FE2 소유. BE1 연동 전까지 홈 화면을 끝까지 돌리기 위한 데이터. */
const STATUS: HomeStatus = {
  characterLevel: 8,
  growthCurrent: 8,
  growthTarget: 30,
  tokenBalance: 230,
  todayCompletedCount: 3,
  totalCompletedCount: 32,
  hasPass: true,
  passExpiresInDays: 15,
};

export async function mockGetHomeStatus(): Promise<HomeStatus> {
  await new Promise((r) => setTimeout(r, 150));
  return STATUS;
}
