import { prisma } from '../utils/prisma'
import { SHOP_CATALOG } from './shop.service'
import type { QuestCategory } from '../types/quest'
import type { RecordSummary, RecordSummaryTokenLog, RewardRecordItem, TodayRecordItem } from '../types/record'

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

export async function getTotalCompletedCount(userId: string): Promise<number> {
  return prisma.questLog.count({ where: { userId } })
}

export async function getTotalActiveMinutes(userId: string): Promise<number> {
  const result = await prisma.questLog.aggregate({
    where: { userId },
    _sum: { elapsedSeconds: true }
  })
  return Math.round((result._sum.elapsedSeconds ?? 0) / 60)
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

// REC-04: 토큰 획득 기록
export async function getTokenRecords(userId: string): Promise<RewardRecordItem[]> {
  return getRewardRecords(userId, REWARD_TYPE_TOKEN)
}

// REC-04: 토큰 사용 기록 (상점 TOKEN 섹션 구매 + 패스 구매)
async function getTokenSpendRecords(userId: string): Promise<RecordSummaryTokenLog[]> {
  const [shopSpends, passSpends] = await Promise.all([
    prisma.shopPurchase.findMany({ where: { userId, tokenSpent: { not: null } } }),
    prisma.passSubscription.findMany({ where: { userId, tokenSpent: { not: null } } })
  ])

  const shopLogs = shopSpends.map((purchase) => ({
    id: purchase.id,
    amount: purchase.tokenSpent as number,
    type: 'SPEND' as const,
    reason: `상점 구매: ${SHOP_CATALOG.find((item) => item.id === purchase.itemId)?.name ?? purchase.itemId}`,
    occurredAt: purchase.createdAt.toISOString()
  }))

  const passLogs = passSpends.map((subscription) => ({
    id: subscription.id,
    amount: subscription.tokenSpent as number,
    type: 'SPEND' as const,
    reason: '피즐리 패스 구매',
    occurredAt: subscription.createdAt.toISOString()
  }))

  return [...shopLogs, ...passLogs]
}

// REC-01~04 통합. FE2 RecordPage가 한 번에 받아가는 형태.
export async function getRecordSummary(userId: string): Promise<RecordSummary> {
  const [todayRecords, totalCompletedCount, totalActiveMinutes, boxRecords, tokenEarnRecords, tokenSpendLogs] =
    await Promise.all([
      getTodayRecords(userId),
      getTotalCompletedCount(userId),
      getTotalActiveMinutes(userId),
      getBoxRecords(userId),
      getTokenRecords(userId),
      getTokenSpendRecords(userId)
    ])

  const tokenEarnLogs: RecordSummaryTokenLog[] = tokenEarnRecords.map((record) => ({
    id: record.rewardLogId,
    amount: (record.rewardValue as { token?: number }).token ?? 0,
    type: 'EARN',
    reason: '퀘스트 완료 보상',
    occurredAt: record.earnedAt
  }))

  return {
    todayQuests: todayRecords.map((record) => ({
      id: record.questLogId,
      title: record.title,
      completedAt: record.completedAt
    })),
    totalCompletedCount,
    totalActiveMinutes,
    boxLogs: boxRecords.map((record) => ({
      id: record.rewardLogId,
      obtainedAt: record.earnedAt,
      gainedExp: (record.rewardValue as { exp?: number }).exp ?? 0
    })),
    tokenLogs: [...tokenEarnLogs, ...tokenSpendLogs].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
  }
}
