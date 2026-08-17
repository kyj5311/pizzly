import { apiClient, USE_MOCK } from './api-client';
import { MOCK_LOGIN_RESULT } from '../mocks/auth.mock';
import { tokenStorage } from '../utils/storage';
import type { LoginResult } from '../types/auth';
import type { OnboardingPayload } from '../types/onboarding';

/**
 * [LOG-01] 테스트 계정 로그인.
 * 서버: POST /api/auth/login — 바디 없이 호출하면 테스트 유저를 생성/조회해 토큰을 준다.
 */
export async function login(): Promise<LoginResult> {
  const result = USE_MOCK
    ? MOCK_LOGIN_RESULT
    : await apiClient.post<LoginResult>('/api/auth/login');

  tokenStorage.set(result.token);
  return result;
}

export function logout(): void {
  tokenStorage.clear();
}

export function isLoggedIn(): boolean {
  return Boolean(tokenStorage.get());
}

/** [ONB-01, ONB-02] 서버: POST /api/auth/onboarding */
export async function saveOnboarding(payload: OnboardingPayload): Promise<void> {
  if (USE_MOCK) {
    console.info('[mock] saveOnboarding', payload);
    return;
  }
  await apiClient.post<unknown>('/api/auth/onboarding', payload);
}
