import { prisma } from '../utils/prisma'
import type { QuestCategory } from '../types/quest'
import type { RecordSummary, RewardRecordItem, TodayRecordItem } from '../types/record'

// REC-01~04 소관. QuestLog/RewardLog는 BE1이 쓰는 테이블을 읽기 전용으로 조회한다.
// RewardLog.rewardType 값은 schema.prisma 주석의 'EXP' | 'BOX' | 'TOKEN' 컨벤션을 따른다고 가정 (BE1과 확정 필요).
const REWARD_TYPE_BOX = 'BOX'
const REWARD_TYPE_TOKEN = 'TOKEN'

const DURATION_ENUM_TO_MINUTES: Record<string, 1 | 3 | 5> = {
  MIN_1: 1,
  MIN_3: 3,
  MIN_5: 5
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000

function startOfTodayKST(): Date {
  const kstNow = new Date(Date.now() + KST_OFFSET_MS)
  kstNow.setUTCHours(0, 0, 0, 0)
  return new Date(kstNow.getTime() - KST_OFFSET_MS)
}

// REC-01: 오늘 완료 기록
export async function getTodayRecords(userId: string): Promise<TodayRecordItem[]> {
  const logs = await prisma.questLog.findMany({
    where: { userId, completedAt: { gte: startOfTodayKST() } },
    include: { quest: true },
    orderBy: { completedAt: 'desc' }
  })

  return logs.map((log) => ({
    questLogId: log.id,
    questId: log.questId,
    questCode: log.quest.questCode,
    title: log.quest.title,
    category: log.quest.category as QuestCategory,
    duration: DURATION_ENUM_TO_MINUTES[log.quest.duration],
    completedAt: log.completedAt.toISOString()
  }))
}

// REC-02: 누적 퀘스트 표시
export async function getRecordSummary(userId: string): Promise<RecordSummary> {
  const logs = await prisma.questLog.findMany({
    where: { userId },
    include: { quest: { select: { category: true } } }
  })

  const byCategory: Record<QuestCategory, number> = {
    EYE: 0,
    WRIST: 0,
    NECK_SHOULDER: 0,
    BREATH_REST: 0
  }

  for (const log of logs) {
    byCategory[log.quest.category as QuestCategory] += 1
  }

  return { totalCompleted: logs.length, byCategory }
}

async function getRewardRecords(userId: string, rewardType: string): Promise<RewardRecordItem[]> {
  const logs = await prisma.rewardLog.findMany({
    where: { userId, rewardType },
    orderBy: { createdAt: 'desc' }
  })

  return logs.map((log) => ({
    rewardLogId: log.id,
    questLogId: log.questLogId,
    rewardValue: log.rewardValue,
    earnedAt: log.createdAt.toISOString()
  }))
}

// REC-03: 랜덤 상자 기록 (획득 이력)
export async function getBoxRecords(userId: string): Promise<RewardRecordItem[]> {
  return getRewardRecords(userId, REWARD_TYPE_BOX)
}

// REC-04: 토큰 기록
// 지금은 "획득" 이력만 조회 가능. "사용"(상점/패스 구매로 토큰 소모) 기록은
// SHT-01~03·PAS-02 결제 로직이 아직 없어서 별도 원장 테이블이 없음 — 그 기능 붙을 때 같이 추가 필요.
export async function getTokenRecords(userId: string): Promise<RewardRecordItem[]> {
  return getRewardRecords(userId, REWARD_TYPE_TOKEN)
}
