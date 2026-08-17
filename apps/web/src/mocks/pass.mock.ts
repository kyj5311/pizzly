import type { PassStatus } from '../features/pass/types';

/** FE2 소유. BE1/BE2 연동 전까지 패스 화면을 끝까지 돌리기 위한 데이터. */
const STATUS: PassStatus = {
  active: true,
  progressDays: 15,
  totalDays: 30,
  benefits: [
    '패스 전용 보상 지급',
    '랜덤 상자에서 토큰 등장 확률 UP',
    '추가 경험치 획득',
    '특별 아이템 포함',
  ],
};

export async function mockGetPassStatus(): Promise<PassStatus> {
  await new Promise((r) => setTimeout(r, 150));
  return STATUS;
}

export async function mockPurchasePass(): Promise<{ success: true }> {
  await new Promise((r) => setTimeout(r, 200));
  return { success: true };
}
