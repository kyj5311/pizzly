export type QuestDurationMinutes = 1 | 3 | 5

export type QuestSituation = 'SITTING' | 'STANDING' | 'MOVING' | 'QUIET_PLACE'

export type QuestCondition = 'EYE_FATIGUE' | 'WRIST_FINGER' | 'NECK_SHOULDER' | 'REST'

export type QuestCategory = 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'BREATH_REST'

// ONB-02 활동 제한사항. FE1의 types/onboarding.ts Restriction과 값 동일.
export type Restriction = 'NO_STANDING' | 'NO_ARM_RAISE' | 'NO_SOUND' | 'NO_FLOOR'

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
