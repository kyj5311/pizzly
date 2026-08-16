/** POST /api/auth/login 응답 (테스트 계정 로그인) */
export interface LoginResult {
  token: string;
  userId: number;
  email: string;
  name: string | null;
}
