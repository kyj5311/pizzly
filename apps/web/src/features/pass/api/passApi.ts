import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetPassStatus, mockPurchasePass } from '../../../mocks/pass.mock';
import type { PassStatus } from '../types';

/** PAS-01/03/04 BE1 담당, PAS-02(결제) BE2 담당 */
export async function getPassStatus(): Promise<PassStatus> {
  if (USE_MOCK) return mockGetPassStatus();
  return api.get<PassStatus>('/pass/status');
}

export async function purchasePass(): Promise<{ success: true }> {
  if (USE_MOCK) return mockPurchasePass();
  return api.post<{ success: true }>('/pass/purchase');
}
