import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetGrowthResult, mockSetDevLevel } from '../../../mocks/growth.mock';
import type { GrowthResult } from '../types';

/** BE2 담당 (GRW-01 레벨·경험치 반영 + GRW-02 마일스톤 판정). 엔드포인트는 API 명세 확정 후 교체. */
export async function getGrowthResult(): Promise<GrowthResult> {
  if (USE_MOCK) return mockGetGrowthResult();
  return api.get<GrowthResult>('/growth/latest');
}

/**
 * 설정 화면 "개발자 모드" 전용. QA용으로 레벨을 직접 지정한다.
 * exp를 넘기면(개발자 모드 끌 때 원래 값으로 되돌리는 용도) 그 값을 그대로 사용하고,
 * 안 넘기면 해당 레벨의 시작 경험치로 맞춘다.
 */
export async function setDevLevel(
  level: number,
  exp?: number,
): Promise<{ level: number; exp: number; growthStage: number }> {
  if (USE_MOCK) return mockSetDevLevel(level, exp);
  return api.post<{ level: number; exp: number; growthStage: number }>('/growth/dev-level', { level, exp });
}
