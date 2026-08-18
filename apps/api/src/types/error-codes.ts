/**
 * 도메인별 에러코드 정의 ({도메인}_{번호} 형식, CLAUDE.md API 규약 참고)
 * 아직 실제 로직이 붙기 전 단계의 초안이라 케이스가 늘어나면 계속 추가될 수 있음
 */

export const QUEST_ERROR_CODES = {
  QUEST_001: {
    code: 'QUEST_001',
    message: '입력한 조건(시간/상황/컨디션)에 맞는 추천 가능한 퀘스트가 없습니다.'
  },
  QUEST_002: {
    code: 'QUEST_002',
    message: '추천 요청 파라미터가 유효하지 않습니다.'
  },
  QUEST_003: {
    code: 'QUEST_003',
    message: '존재하지 않는 퀘스트입니다.'
  },
  QUEST_004: {
    code: 'QUEST_004',
    message: '이미 완료 처리된 퀘스트입니다.'
  },
  QUEST_005: {
    code: 'QUEST_005',
    message: '완료 소요시간(elapsedSeconds) 값이 유효하지 않습니다.'
  },
  QUEST_006: {
    code: 'QUEST_006',
    message: '퀘스트 완료 기록 저장에 실패했습니다.'
  }
} as const

export const REWARD_ERROR_CODES = {
  REWARD_001: {
    code: 'REWARD_001',
    message: '랜덤 보상 산출 중 오류가 발생했습니다.'
  },
  REWARD_002: {
    code: 'REWARD_002',
    message: '지급 가능한 보상이 없습니다.'
  },
  REWARD_003: {
    code: 'REWARD_003',
    message: '이미 지급된 보상에 대해 중복 지급을 요청했습니다.'
  },
  REWARD_004: {
    code: 'REWARD_004',
    message: '보상 지급 결과를 캐릭터 성장치에 반영하지 못했습니다.'
  },
  REWARD_005: {
    code: 'REWARD_005',
    message: '보상 지급 요청 파라미터가 유효하지 않습니다.'
  },
  REWARD_006: {
    code: 'REWARD_006',
    message: '보상 지급 기록 저장에 실패했습니다.'
  }
} as const

export const GROWTH_ERROR_CODES = {
  GROWTH_001: {
    code: 'GROWTH_001',
    message: '캐릭터(피즐리) 정보를 찾을 수 없습니다.'
  },
  GROWTH_002: {
    code: 'GROWTH_002',
    message: '경험치 값이 유효하지 않습니다.'
  }
} as const

export const AUTH_ERROR_CODES = {
  AUTH_001: {
    code: 'AUTH_001',
    message: '인증에 실패했습니다.'
  }
} as const

export const ONB_ERROR_CODES = {
  ONB_001: {
    code: 'ONB_001',
    message: '온보딩 정보 저장에 실패했습니다.'
  }
} as const

export type QuestErrorCode = keyof typeof QUEST_ERROR_CODES
export type RewardErrorCode = keyof typeof REWARD_ERROR_CODES
export type GrowthErrorCode = keyof typeof GROWTH_ERROR_CODES
export type AuthErrorCode = keyof typeof AUTH_ERROR_CODES
export type OnbErrorCode = keyof typeof ONB_ERROR_CODES
