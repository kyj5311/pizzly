import { prisma } from '../utils/prisma'
import type { PassStatus } from '../types/pass'

// PAS-01~04. 단일 요금제(고정 기간·토큰가) 가정 — 실제 PG 연동 없이 토큰 결제로만 구매.
// FE2 mocks/pass.mock.ts 값(30일, 혜택 4종)과 동일하게 맞춤.
export const PASS_DURATION_DAYS = 30
export const PASS_PRICE_TOKENS = 300
const DAY_MS = 24 * 60 * 60 * 1000

export const PASS_BENEFITS = [
  '패스 전용 보상 지급',
  '랜덤 상자에서 토큰 등장 확률 UP',
  '추가 경험치 획득',
  '특별 아이템 포함'
]

async function findActivePass(userId: string) {
  return prisma.passSubscription.findFirst({
    where: { userId, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { startedAt: 'desc' }
  })
}

// PAS-01/04: 패스 상태 + 진행도
export async function getPassStatus(userId: string): Promise<PassStatus> {
  const activePass = await findActivePass(userId)

  if (!activePass) {
    return { active: false, progressDays: 0, totalDays: PASS_DURATION_DAYS, benefits: PASS_BENEFITS }
  }

  const elapsedDays = Math.floor((Date.now() - activePass.startedAt.getTime()) / DAY_MS)
  const progressDays = Math.min(PASS_DURATION_DAYS, Math.max(0, elapsedDays))

  return { active: true, progressDays, totalDays: PASS_DURATION_DAYS, benefits: PASS_BENEFITS }
}

export type PurchasePassError = 'ALREADY_ACTIVE' | 'NOT_ENOUGH_TOKEN'

// PAS-02: 패스 구매(토큰 결제)
export async function purchasePass(userId: string): Promise<PurchasePassError | null> {
  const activePass = await findActivePass(userId)
  if (activePass) return 'ALREADY_ACTIVE'

  const pizzly = await prisma.pizzly.findUniqueOrThrow({ where: { userId } })
  if (pizzly.token < PASS_PRICE_TOKENS) return 'NOT_ENOUGH_TOKEN'

  const startedAt = new Date()
  const expiresAt = new Date(startedAt.getTime() + PASS_DURATION_DAYS * DAY_MS)

  await prisma.$transaction([
    prisma.pizzly.update({ where: { userId }, data: { token: { decrement: PASS_PRICE_TOKENS } } }),
    prisma.passSubscription.create({
      data: { userId, planType: 'PREMIUM', startedAt, expiresAt, tokenSpent: PASS_PRICE_TOKENS }
    })
  ])

  return null
}
