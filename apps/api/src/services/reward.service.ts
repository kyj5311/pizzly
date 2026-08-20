import { prisma } from '../utils/prisma'
import { applyGrowth } from './growth.service'

// REW-01~04 소관(BE1). BE2가 GRW 연동을 위해 초안으로 작성 — 확률·보상폭은 BE1이 밸런스에 맞춰 조정 가능.
const BASE_EXP_PER_MINUTE = 10 // MVP 임시값. REW-01 기본 경험치 = 소요시간(분) × 10
const BOX_TRIGGER_RATE = 0.3 // REW-02 랜덤 상자 등장 확률 (MVP 임시값)
const BOX_MIN_BONUS_EXP = 10
const BOX_MAX_BONUS_EXP = 30 // REW-03 상자 추가 경험치 범위 (MVP 임시값)
const TOKEN_PER_COMPLETION = 1 // REW-04 임시값. 패스 구매자 확률 가중은 PAS-02 이후 별도 반영

const DURATION_TO_MINUTES: Record<string, number> = {
  MIN_1: 1,
  MIN_3: 3,
  MIN_5: 5
}

export interface QuestCompletionResult {
  pizzly: { level: number; exp: number; token: number; growthStage: number }
  reward: { exp: number; token: number; box: { bonusExp: number } | null }
  growth: { leveledUp: boolean; stageUp: boolean }
}

// 퀘스트 완료 로그가 이미 생성된 뒤 호출: 보상 로그 기록 + 성장 반영 + 토큰 잔액 갱신
export async function completeQuestAndGrantRewards(
  userId: string,
  questLogId: string,
  durationEnum: string
): Promise<QuestCompletionResult> {
  const baseExp = (DURATION_TO_MINUTES[durationEnum] ?? 1) * BASE_EXP_PER_MINUTE

  await prisma.rewardLog.create({
    data: { userId, questLogId, rewardType: 'EXP', rewardValue: { exp: baseExp } }
  })

  const boxTriggered = Math.random() < BOX_TRIGGER_RATE
  const bonusExp = boxTriggered
    ? BOX_MIN_BONUS_EXP + Math.floor(Math.random() * (BOX_MAX_BONUS_EXP - BOX_MIN_BONUS_EXP + 1))
    : 0

  if (boxTriggered) {
    await prisma.rewardLog.create({
      data: { userId, questLogId, rewardType: 'BOX', rewardValue: { exp: bonusExp } }
    })
  }

  await prisma.rewardLog.create({
    data: { userId, questLogId, rewardType: 'TOKEN', rewardValue: { token: TOKEN_PER_COMPLETION } }
  })

  const growth = await applyGrowth(userId, baseExp + bonusExp)

  const pizzly = await prisma.pizzly.update({
    where: { userId },
    data: { token: { increment: TOKEN_PER_COMPLETION } }
  })

  return {
    pizzly: { level: growth.level, exp: growth.exp, token: pizzly.token, growthStage: growth.growthStage },
    reward: {
      exp: baseExp + bonusExp,
      token: TOKEN_PER_COMPLETION,
      box: boxTriggered ? { bonusExp } : null
    },
    growth: { leveledUp: growth.leveledUp, stageUp: growth.stageUp }
  }
}
