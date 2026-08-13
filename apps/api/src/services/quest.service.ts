import { prisma } from '../utils/prisma'
import type { QuestCondition, QuestSituation, RecommendQuestInput, RecommendedQuest } from '../types/quest'

// docs/quest-recommendation-spec.md 3장(매칭 로직) 참고
const MAX_RECOMMENDATIONS = 3
const RECENT_COMPLETION_WINDOW_HOURS = 24
const CONDITION_MATCH_SCORE = 3
const INTEREST_MATCH_SCORE = 2
const RECENT_COMPLETION_PENALTY = -1

const DURATION_ENUM_MAP: Record<RecommendQuestInput['duration'], string> = {
  1: 'MIN_1',
  3: 'MIN_3',
  5: 'MIN_5'
}

// PM 기준표(필드_정의 시트)에는 condition 전용 필드가 없어 category로 직접 매핑
const CONDITION_CATEGORY_MAP: Record<QuestCondition, string> = {
  EYE_FATIGUE: 'EYE',
  WRIST_FINGER: 'WRIST',
  NECK_SHOULDER: 'NECK_SHOULDER',
  REST: 'BREATH_REST'
}

const POSTURE_LABEL_MAP: Partial<Record<QuestSituation, string>> = {
  SITTING: '앉아 있음',
  STANDING: '서 있음',
  MOVING: '이동 중'
}

function matchesSituation(quest: { posture: unknown; environment: string | null }, situation: QuestSituation): boolean {
  if (situation === 'QUIET_PLACE') {
    return quest.environment != null && quest.environment.includes('조용')
  }
  const postureLabel = POSTURE_LABEL_MAP[situation]
  const posture = quest.posture as string[]
  return postureLabel != null && posture.includes(postureLabel)
}

export async function recommendQuests(
  userId: string,
  input: RecommendQuestInput,
  interests: string[],
  restrictions: string[]
): Promise<RecommendedQuest[]> {
  const candidates = await prisma.quest.findMany({
    where: {
      isActive: true,
      duration: DURATION_ENUM_MAP[input.duration]
    }
  })

  const eligible = candidates.filter((quest) => {
    if (restrictions.includes(quest.category)) return false
    return matchesSituation(quest, input.situation)
  })

  if (eligible.length === 0) {
    return []
  }

  const recentQuestIds = await getRecentlyCompletedQuestIds(userId)

  const scored = eligible.map((quest) => {
    let score = 0
    if (quest.category === CONDITION_CATEGORY_MAP[input.condition]) score += CONDITION_MATCH_SCORE
    if (interests.includes(quest.category)) score += INTEREST_MATCH_SCORE
    if (recentQuestIds.has(quest.id)) score += RECENT_COMPLETION_PENALTY

    return {
      questId: quest.id,
      questCode: quest.questCode,
      title: quest.title,
      category: quest.category,
      duration: input.duration,
      matchScore: score
    }
  })

  scored.sort((a, b) => b.matchScore - a.matchScore)

  return scored.slice(0, MAX_RECOMMENDATIONS).map((quest, index) => ({
    ...quest,
    priority: index + 1
  }))
}

async function getRecentlyCompletedQuestIds(userId: string): Promise<Set<string>> {
  const since = new Date(Date.now() - RECENT_COMPLETION_WINDOW_HOURS * 60 * 60 * 1000)
  const logs = await prisma.questLog.findMany({
    where: { userId, completedAt: { gte: since } },
    select: { questId: true }
  })
  return new Set(logs.map((log) => log.questId))
}
