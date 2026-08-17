import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetHomeStatus } from '../../../mocks/home.mock';
import type { HomeStatus } from '../types';

/** BE1 담당. 엔드포인트는 API 명세 1차 확정 후 교체. */
export async function getHomeStatus(): Promise<HomeStatus> {
  if (USE_MOCK) return mockGetHomeStatus();
  return api.get<HomeStatus>('/home/status');
}
