import { apiClient, USE_MOCK } from './api-client';
import { MOCK_LOGIN_RESULT } from '../mocks/auth.mock';
import { tokenStorage } from '../utils/storage';
import { costumeStorage } from '../utils/costume-storage';
import { inventoryStorage } from '../utils/inventory-storage';
import { appearanceStorage } from '../utils/appearance-storage';
import { devModeStorage } from '../utils/dev-mode-storage';
import type { LoginResult } from '../types/auth';
import type { OnboardingPayload } from '../types/onboarding';

/** 동시에 여러 명이 테스트할 수 있도록 준비된 테스트 계정 4개. 서버 TEST_ACCOUNT_IDS와 동일해야 함. */
export const TEST_ACCOUNTS = ['test-user', 'test-2', 'test-3', 'test-4'] as const;

/**
 * 코스튬 장착·보유 캐시·개발자 모드 등은 계정별이 아니라 브라우저에 통째로 저장돼 있어서,
 * 같은 브라우저에서 계정을 바꾸면 이전 계정 상태가 그대로 보이는 문제가 있었다.
 * 로그인/로그아웃 시점에 전부 비워서 계정 전환 때마다 깨끗한 상태로 시작하게 한다.
 */
function clearLocalAccountState(): void {
  costumeStorage.clear();
  inventoryStorage.clear();
  appearanceStorage.clear();
  devModeStorage.clear();
}

/**
 * [LOG-01] 테스트 계정 로그인.
 * 서버: POST /api/auth/login { accountId } — 지정한 테스트 계정을 생성/조회해 토큰을 준다.
 */
export async function login(accountId: (typeof TEST_ACCOUNTS)[number]): Promise<LoginResult> {
  const result = USE_MOCK
    ? MOCK_LOGIN_RESULT
    : await apiClient.post<LoginResult>('/api/auth/login', { accountId });

  clearLocalAccountState();
  tokenStorage.set(result.token);
  return result;
}

export function logout(): void {
  tokenStorage.clear();
  clearLocalAccountState();
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
