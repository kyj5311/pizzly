import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetGrowthResult } from '../../../mocks/growth.mock';
import type { GrowthResult } from '../types';

/** BE2 담당 (GRW-01 레벨·경험치 반영 + GRW-02 마일스톤 판정). 엔드포인트는 API 명세 확정 후 교체. */
export async function getGrowthResult(): Promise<GrowthResult> {
  if (USE_MOCK) return mockGetGrowthResult();
  return api.get<GrowthResult>('/growth/latest');
}
