export type QuestDurationMinutes = 1 | 3 | 5

export type QuestSituation = 'SITTING' | 'STANDING' | 'MOVING' | 'QUIET_PLACE'

export type QuestCondition = 'EYE_FATIGUE' | 'WRIST_FINGER' | 'NECK_SHOULDER' | 'REST'

export type QuestCategory = 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'BREATH_REST'

// docs/quest-recommendation-spec.md 참고
export interface RecommendQuestInput {
  duration: QuestDurationMinutes
  situation: QuestSituation
  condition: QuestCondition
}

export interface RecommendedQuest {
  questId: string
  questCode: string
  title: string
  category: QuestCategory
  duration: QuestDurationMinutes
  priority: number
  matchScore: number
}
