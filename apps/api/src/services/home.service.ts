import { prisma } from '../utils/prisma'
import { EXP_PER_LEVEL } from './growth.service'
import { getTodayRecords, getTotalCompletedCount } from './record.service'

// HOM-01/03/04. 원래 BE1 담당 화면이지만 데이터가 대부분 BE2 소관(Pizzly/QuestLog/PassSubscription)이라 BE2가 작성.
export interface HomeStatus {
  characterLevel: number
  growthCurrent: number
  growthTarget: number
  tokenBalance: number
  todayCompletedCount: number
  totalCompletedCount: number
  hasPass: boolean
  passExpiresInDays?: number
}

export async function getHomeStatus(userId: string): Promise<HomeStatus> {
  const [pizzly, todayRecords, totalCompletedCount, activePass] = await Promise.all([
    prisma.pizzly.findUniqueOrThrow({ where: { userId } }),
    getTodayRecords(userId),
    getTotalCompletedCount(userId),
    prisma.passSubscription.findFirst({
      where: { userId, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: { startedAt: 'desc' }
    })
  ])

  const passExpiresInDays = activePass?.expiresAt
    ? Math.max(0, Math.ceil((activePass.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : undefined

  return {
    characterLevel: pizzly.level,
    growthCurrent: pizzly.exp % EXP_PER_LEVEL,
    growthTarget: EXP_PER_LEVEL,
    tokenBalance: pizzly.token,
    todayCompletedCount: todayRecords.length,
    totalCompletedCount,
    hasPass: activePass != null,
    passExpiresInDays
  }
}
