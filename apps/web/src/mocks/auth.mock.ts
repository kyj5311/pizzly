import type { LoginResult } from '../types/auth';

/**
 * 서버 auth.controller.ts 의 테스트 로그인 응답과 동일한 형태.
 * 서버가 기동되면 이 파일 없이 실제 API 로 전환된다.
 */
export const MOCK_LOGIN_RESULT: LoginResult = {
  token: 'test-token-1',
  userId: 1,
  email: 'test_pizzly@groom.aa',
  name: '피즐리 테스터',
};
