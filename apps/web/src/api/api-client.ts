import { ApiError, type ApiFailure, type ApiSuccess } from '../types/api';
import { tokenStorage } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

/**
 * 목업 모드 스위치. shared/api/client.ts(FE2)와 기준 통일 — VITE_USE_MOCK=true일 때만 mock,
 * 값이 없으면(배포 환경 등) 실제 API를 쓴다.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = tokenStorage.get();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  let body: ApiSuccess<T> | ApiFailure | undefined;
  try {
    body = await res.json();
  } catch {
    // 본문 없는 응답
  }

  if (!res.ok || body?.success === false) {
    const failure = body as ApiFailure | undefined;
    throw new ApiError(
      res.status,
      failure?.error?.code ?? 'UNKNOWN',
      failure?.error?.message ?? '요청을 처리하지 못했습니다.',
    );
  }

  return (body as ApiSuccess<T>).data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(payload ?? {}) }),
  patch: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(payload ?? {}) }),
};
