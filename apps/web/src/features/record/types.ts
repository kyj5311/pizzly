/** 기록 도메인 타입 (소유자: FE2) */
export interface RecordQuestLog {
  id: string;
  title: string;
  completedAt: string;
}

export interface RecordBoxLog {
  id: string;
  obtainedAt: string;
  gainedExp: number;
}

export interface RecordTokenLog {
  id: string;
  amount: number;
  type: 'EARN' | 'SPEND';
  reason: string;
  occurredAt: string;
}

export interface RecordSummary {
  todayQuests: RecordQuestLog[];
  totalCompletedCount: number;
  totalActiveMinutes: number;
  boxLogs: RecordBoxLog[];
  tokenLogs: RecordTokenLog[];
}
