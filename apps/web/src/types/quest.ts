import type { Restriction, WellnessArea } from './onboarding';

export type QuestDuration = 1 | 3 | 5;
export type QuestSituation = 'SITTING' | 'STANDING' | 'MOVING' | 'QUIET';

/** QST-01~03 에서 모으는 선택값. 추천 요청 바디가 된다. */
export interface QuestContext {
  durationMin: QuestDuration;
  situation: QuestSituation;
  condition: WellnessArea;
}

/**
 * 퀘스트 1건.
 * ※ 서버 QuestLog.questId 가 Int 이므로 id 는 number 로 맞춰둔다.
 * ※ 퀘스트 마스터 데이터의 소유 주체(BE/FE)는 미확정 — 현재는 FE 목업이 원본.
 */
export interface Quest {
  id: number;
  title: string;
  area: WellnessArea;
  /** 실제 수행 시간(초) */
  durationSec: number;
  /** 어떤 시간 슬롯에 노출될 수 있는지 */
  slots: QuestDuration[];
  /** 어떤 상황에서 수행 가능한지 */
  situations: QuestSituation[];
  /** 이 제한사항을 가진 사용자에게는 추천하지 않음 */
  excludeIf: Restriction[];
  /** 피즐리 시그니처 동작 여부 (QST-05 분기) */
  guideType: 'SIGNATURE' | 'GENERAL';
  /** DS 일러스트 도착 전까지 텍스트 안내로 대체 */
  steps: string[];
  /** 횟수형 퀘스트면 반복 횟수 */
  repeatCount?: number;
}

/** POST /api/quests/complete 응답 */
export interface QuestCompleteResult {
  pizzly: { level: number; exp: number; token: number; growthStage: number };
  reward: { exp: number; token: number };
}
