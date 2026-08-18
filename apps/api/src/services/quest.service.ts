import { prisma } from '../utils/prisma'
import type { QuestCategory, QuestCondition, QuestDurationMinutes, QuestSituation, RecommendedQuest, RecommendQuestInput } from '../types/quest'

// docs/quest-recommendation-spec.md 3장(매칭 로직) 참고
// condition으로 카테고리를 먼저 고정하고(다른 카테고리는 후보에서 아예 제외), 그 안에서 duration을 정확히 맞춘 것을
// 1순위로, 한 단계씩 더 짧은 duration을 다음 순위로 채운다. QST-01~03 선택 순서(시간→상황→컨디션)상
// condition이 추천 직전 마지막으로 정하는 가장 구체적인 신호라 카테고리 선택권을 준다.
const MAX_RECOMMENDATIONS = 3
const RECENT_COMPLETION_WINDOW_HOURS = 24
const RECENT_COMPLETION_PENALTY = 1

const DURATION_ENUM_MAP: Record<QuestDurationMinutes, string> = {
  1: 'MIN_1',
  3: 'MIN_3',
  5: 'MIN_5'
}

// PM 기준표(필드_정의 시트)에는 condition 전용 필드가 없어 category로 직접 매핑
const CONDITION_CATEGORY_MAP: Record<QuestCondition, QuestCategory> = {
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

const DURATION_TIERS: QuestDurationMinutes[] = [1, 3, 5]

// 요청한 duration부터 그보다 짧은 tier로 내려가는 순서. 예: 5 -> [5,3,1], 3 -> [3,1], 1 -> [1]
function fallbackDurationTiers(duration: QuestDurationMinutes): QuestDurationMinutes[] {
  return DURATION_TIERS.filter((tier) => tier <= duration).sort((a, b) => b - a)
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
  restrictions: string[]
): Promise<RecommendedQuest[]> {
  const targetCategory = CONDITION_CATEGORY_MAP[input.condition]

  if (restrictions.includes(targetCategory)) {
    return []
  }

  const categoryQuests = await prisma.quest.findMany({
    where: { isActive: true, category: targetCategory }
  })

  const recentQuestIds = await getRecentlyCompletedQuestIds(userId)
  const tiers = fallbackDurationTiers(input.duration)
  const result: RecommendedQuest[] = []

  for (let tierIndex = 0; tierIndex < tiers.length && result.length < MAX_RECOMMENDATIONS; tierIndex++) {
    const duration = tiers[tierIndex]

    const tierCandidates = categoryQuests
      .filter((quest) => quest.duration === DURATION_ENUM_MAP[duration])
      .filter((quest) => matchesSituation(quest, input.situation))
      .sort((a, b) => Number(recentQuestIds.has(a.id)) - Number(recentQuestIds.has(b.id))) // 최근에 안 한 것 우선

    for (const quest of tierCandidates) {
      if (result.length >= MAX_RECOMMENDATIONS) break
      const recencyPenalty = recentQuestIds.has(quest.id) ? RECENT_COMPLETION_PENALTY : 0
      result.push({
        questId: quest.id,
        questCode: quest.questCode,
        title: quest.title,
        category: quest.category,
        duration,
        priority: result.length + 1,
        matchScore: 10 - tierIndex * 3 - recencyPenalty
      })
    }
  }

  return result
}

async function getRecentlyCompletedQuestIds(userId: string): Promise<Set<string>> {
  const since = new Date(Date.now() - RECENT_COMPLETION_WINDOW_HOURS * 60 * 60 * 1000)
  const logs = await prisma.questLog.findMany({
    where: { userId, completedAt: { gte: since } },
    select: { questId: true }
  })
  return new Set(logs.map((log) => log.questId))
}

// FE2 퀘스트 목록(19번 화면, 둘러보기 카탈로그)용. FE1의 QST-04 추천 흐름과는 별개.
// FE2의 QuestListArea는 BREATH_REST 대신 REST를 쓴다.
export interface QuestListItem {
  id: string
  title: string
  area: 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'REST'
  durationMin: number
  detail: string
  saved: boolean
}

const CATEGORY_TO_AREA: Record<string, QuestListItem['area']> = {
  EYE: 'EYE',
  WRIST: 'WRIST',
  NECK_SHOULDER: 'NECK_SHOULDER',
  BREATH_REST: 'REST'
}

const DURATION_ENUM_TO_MIN: Record<string, number> = {
  MIN_1: 1,
  MIN_3: 3,
  MIN_5: 5
}

export async function listQuests(userId: string): Promise<QuestListItem[]> {
  const [quests, bookmarks] = await Promise.all([
    prisma.quest.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { duration: 'asc' }]
    }),
    prisma.questBookmark.findMany({ where: { userId }, select: { questId: true } })
  ])

  const savedIds = new Set(bookmarks.map((bookmark) => bookmark.questId))

  return quests.map((quest) => ({
    id: quest.id,
    title: quest.title,
    area: CATEGORY_TO_AREA[quest.category] ?? 'REST',
    durationMin: DURATION_ENUM_TO_MIN[quest.duration] ?? 1,
    detail: quest.environment ?? quest.note ?? '',
    saved: savedIds.has(quest.id)
  }))
}

export type SetQuestBookmarkError = 'NOT_FOUND'

// 보관함(♡) 토글. 존재 여부만 저장하는 단순 구조라 add/remove 둘 다 멱등하게 처리한다.
export async function setQuestBookmark(userId: string, questId: string, saved: boolean): Promise<SetQuestBookmarkError | null> {
  const quest = await prisma.quest.findUnique({ where: { id: questId } })
  if (!quest) return 'NOT_FOUND'

  if (saved) {
    await prisma.questBookmark.upsert({
      where: { userId_questId: { userId, questId } },
      create: { userId, questId },
      update: {}
    })
  } else {
    await prisma.questBookmark.deleteMany({ where: { userId, questId } })
  }

  return null
}
