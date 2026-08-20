import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetRecordSummary } from '../../../mocks/record.mock';
import type { RecordSummary } from '../types';

/** REC-01~04 전부 BE2 담당. 엔드포인트는 API 명세 확정 후 교체. */
export async function getRecordSummary(): Promise<RecordSummary> {
  if (USE_MOCK) return mockGetRecordSummary();
  return api.get<RecordSummary>('/records/summary');
}
