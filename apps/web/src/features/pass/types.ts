/** 패스 도메인 타입 (소유자: FE2) */
export interface PassStatus {
  active: boolean;
  progressDays: number;
  totalDays: number;
  benefits: string[];
}
