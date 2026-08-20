import type { RecordSummary } from '../features/record/types';

/** FE2 소유. BE2 연동 전까지 기록 화면을 끝까지 돌리기 위한 데이터. */
const SUMMARY: RecordSummary = {
  todayQuests: [
    { id: 'log-1', title: '목·어깨 스트레칭', completedAt: '오늘 09:12' },
    { id: 'log-2', title: '눈 깜빡이기', completedAt: '오늘 12:40' },
    { id: 'log-3', title: '손목 올리기', completedAt: '오늘 15:03' },
  ],
  totalCompletedCount: 32,
  totalActiveMinutes: 96,
  boxLogs: [
    { id: 'box-1', obtainedAt: '오늘 15:03', gainedExp: 50 },
    { id: 'box-2', obtainedAt: '어제 18:20', gainedExp: 30 },
  ],
  tokenLogs: [
    { id: 'tok-1', amount: 20, type: 'EARN', reason: '랜덤 상자 보상', occurredAt: '오늘 15:03' },
    { id: 'tok-2', amount: -150, type: 'SPEND', reason: '희귀 코스튬 구매', occurredAt: '어제 20:11' },
  ],
};

export async function mockGetRecordSummary(): Promise<RecordSummary> {
  await new Promise((r) => setTimeout(r, 150));
  return SUMMARY;
}
