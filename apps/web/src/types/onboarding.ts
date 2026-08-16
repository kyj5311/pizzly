/** 관심 웰니스 영역 (ONB-01) */
export type WellnessArea = 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'REST';

/** 활동 제한사항 (ONB-02) — 서버 필드명은 restrictions */
export type Restriction = 'NO_STANDING' | 'NO_ARM_RAISE' | 'NO_SOUND' | 'NO_FLOOR';

/** POST /api/auth/onboarding 요청 바디 */
export interface OnboardingPayload {
  interests: WellnessArea[];
  restrictions: Restriction[];
}
