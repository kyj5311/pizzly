export interface ApplyGrowthResult {
  level: number
  exp: number
  growthStage: number
  leveledUp: boolean // 이번 호출로 레벨이 올랐는지
  stageUp: boolean // 이번 호출로 성장 단계(외형)가 바뀌었는지, GRW-03 축하 화면 트리거용
}

// GET /api/growth/latest 응답. GRW-03(성장 축하 화면)이 조회.
export interface LatestGrowthResult {
  gainedExp: number
  previousLevel: number
  currentLevel: number
  currentExp: number // 현재 레벨 안에서의 진행치 (누적치 아님)
  nextLevelExp: number
  reachedMilestone?: 30 | 60 | 100
}
