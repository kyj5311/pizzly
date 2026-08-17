import { prisma } from '../utils/prisma'
import type { ApplyGrowthResult } from '../types/growth'

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
