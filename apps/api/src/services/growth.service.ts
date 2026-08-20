import { prisma } from '../utils/prisma'
import type { ApplyGrowthResult, LatestGrowthResult } from '../types/growth'

const MILESTONES = [30, 60, 100] as const

// GRW-01/02 소관. BE1의 보상 로직(REW-01~04)이 경험치를 지급한 직후 이 모듈을 호출해서
// Pizzly.level/exp/growthStage를 갱신한다. BE2는 여기까지만 담당하고, 그 결과를 화면에 보여주는
// HOM-01(피즐리 상태 표시)·GRW-03(성장 축하 화면)은 각각 BE1/FE2 소관.
// 필드명 growthStage는 BE1 스키마·FE1 타입과 통일한 이름 (기존 stage에서 변경).

// MVP 임시값. PM 콘텐츠 밸런싱 확정되면 조정 필요.
export const EXP_PER_LEVEL = 100

// GRW-02: 성장 단계(외형) 판정 기준. Lv.130 이후는 GRW-04(추후 개발 안내, PM 카피)로 처리하고
// 새 단계를 추가하지 않음 — 4단계가 마지막 구현 단계.
const GROWTH_STAGE_THRESHOLDS: Array<{ minLevel: number; growthStage: number }> = [
  { minLevel: 100, growthStage: 4 },
  { minLevel: 60, growthStage: 3 },
  { minLevel: 30, growthStage: 2 },
  { minLevel: 1, growthStage: 1 }
]

export function calculateLevel(totalExp: number): number {
  return Math.floor(totalExp / EXP_PER_LEVEL) + 1
}

export function calculateGrowthStage(level: number): number {
  const matched = GROWTH_STAGE_THRESHOLDS.find((threshold) => level >= threshold.minLevel)
  return matched?.growthStage ?? 1
}

// GRW-01: 경험치 반영 + 레벨/성장 단계 재계산
// 호출하는 쪽(BE1 보상 로직)에서 Pizzly 미존재/음수 경험치를 GROWTH_001/GROWTH_002로 매핑해서 응답하면 됨
export async function applyGrowth(userId: string, expGained: number): Promise<ApplyGrowthResult> {
  if (!Number.isInteger(expGained) || expGained < 0) {
    throw new Error('INVALID_EXP_GAINED')
  }

  const pizzly = await prisma.pizzly.findUniqueOrThrow({ where: { userId } })

  const nextExp = pizzly.exp + expGained
  const nextLevel = calculateLevel(nextExp)
  const nextGrowthStage = calculateGrowthStage(nextLevel)

  const updated = await prisma.pizzly.update({
    where: { userId },
    data: { exp: nextExp, level: nextLevel, growthStage: nextGrowthStage }
  })

  return {
    level: updated.level,
    exp: updated.exp,
    growthStage: updated.growthStage,
    leveledUp: nextLevel > pizzly.level,
    stageUp: nextGrowthStage > pizzly.growthStage
  }
}

export interface DevSetLevelResult {
  level: number
  exp: number
  growthStage: number
}

// 개발자 모드 전용. QA/데모에서 레벨 게이트(상점 해금, 성장 단계)를 빠르게 확인하려고
// 레벨을 직접 지정한다. exp도 해당 레벨의 시작 경험치로 맞춰서, 이후 퀘스트를 더 완료해도
// applyGrowth가 계산하는 레벨과 어긋나지 않게 한다.
export async function setDevLevel(userId: string, level: number): Promise<DevSetLevelResult> {
  const exp = (level - 1) * EXP_PER_LEVEL
  const growthStage = calculateGrowthStage(level)

  const updated = await prisma.pizzly.update({
    where: { userId },
    data: { level, exp, growthStage }
  })

  return { level: updated.level, exp: updated.exp, growthStage: updated.growthStage }
}

// GET /api/growth/latest 용. 마지막 퀘스트 완료에서 얻은 경험치를 역산해서 "직전 레벨"을 구한다
// (레벨별 이력을 따로 저장하지 않아서, 현재 누적치에서 마지막으로 얻은 만큼을 빼는 방식으로 계산)
export async function getLatestGrowthResult(userId: string): Promise<LatestGrowthResult> {
  const pizzly = await prisma.pizzly.findUniqueOrThrow({ where: { userId } })

  const lastQuestLog = await prisma.questLog.findFirst({
    where: { userId },
    orderBy: { completedAt: 'desc' }
  })

  let gainedExp = 0
  if (lastQuestLog) {
    const rewardLogs = await prisma.rewardLog.findMany({
      where: { questLogId: lastQuestLog.id, rewardType: { in: ['EXP', 'BOX'] } }
    })
    gainedExp = rewardLogs.reduce((sum, log) => {
      const value = log.rewardValue as { exp?: number }
      return sum + (value.exp ?? 0)
    }, 0)
  }

  const previousTotalExp = Math.max(0, pizzly.exp - gainedExp)
  const previousLevel = calculateLevel(previousTotalExp)
  const currentLevel = pizzly.level

  const reachedMilestone = MILESTONES.find((milestone) => previousLevel < milestone && currentLevel >= milestone)

  return {
    gainedExp,
    previousLevel,
    currentLevel,
    currentExp: pizzly.exp % EXP_PER_LEVEL,
    nextLevelExp: EXP_PER_LEVEL,
    reachedMilestone
  }
}
