import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetGrowthResult, mockSetDevLevel } from '../../../mocks/growth.mock';
import type { GrowthResult } from '../types';

/** BE2 담당 (GRW-01 레벨·경험치 반영 + GRW-02 마일스톤 판정). 엔드포인트는 API 명세 확정 후 교체. */
export async function getGrowthResult(): Promise<GrowthResult> {
  if (USE_MOCK) return mockGetGrowthResult();
  return api.get<GrowthResult>('/growth/latest');
}

/** 설정 화면 "개발자 모드" 전용. QA용으로 레벨을 직접 지정한다. */
export async function setDevLevel(level: number): Promise<{ level: number; exp: number; growthStage: number }> {
  if (USE_MOCK) return mockSetDevLevel(level);
  return api.post<{ level: number; exp: number; growthStage: number }>('/growth/dev-level', { level });
}
