export interface ApplyGrowthResult {
  level: number
  exp: number
  stage: number
  leveledUp: boolean // 이번 호출로 레벨이 올랐는지
  stageUp: boolean // 이번 호출로 성장 단계(외형)가 바뀌었는지, GRW-03 축하 화면 트리거용
}
