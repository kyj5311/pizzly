import type { QuestCategory, QuestDurationMinutes } from './quest'

export interface TodayRecordItem {
  questLogId: string
  questId: string
  questCode: string
  title: string
  category: QuestCategory
  duration: QuestDurationMinutes
  completedAt: string // ISO 8601
}

// rewardValue의 실제 형태는 BE1의 보상 로직(REW-01~04) 구현에 따라 확정됨. 현재는 그대로 통과시킴.
export interface RewardRecordItem {
  rewardLogId: string
  questLogId: string
  rewardValue: unknown
  earnedAt: string // ISO 8601
}

// GET /api/records/summary 응답. FE2 RecordPage(REC-01~04)가 한 번에 받아가는 통합 형태.
export interface RecordSummaryQuestLog {
  id: string
  title: string
  completedAt: string
}

export interface RecordSummaryBoxLog {
  id: string
  obtainedAt: string
  gainedExp: number
}

export interface RecordSummaryTokenLog {
  id: string
  amount: number
  type: 'EARN' | 'SPEND'
  reason: string
  occurredAt: string
}

export interface RecordSummary {
  todayQuests: RecordSummaryQuestLog[]
  totalCompletedCount: number
  totalActiveMinutes: number
  boxLogs: RecordSummaryBoxLog[]
  tokenLogs: RecordSummaryTokenLog[]
}
