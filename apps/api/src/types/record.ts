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

export interface RecordSummary {
  totalCompleted: number
  byCategory: Record<QuestCategory, number>
}

// rewardValue의 실제 형태는 BE1의 보상 로직(REW-01~04) 구현에 따라 확정됨. 현재는 그대로 통과시킴.
export interface RewardRecordItem {
  rewardLogId: string
  questLogId: string
  rewardValue: unknown
  earnedAt: string // ISO 8601
}
