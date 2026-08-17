import { ApiError, type ApiResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/** 목업 모드. .env.local 에 VITE_USE_MOCK=true 를 두면 각 도메인 api 가 목업을 반환한다. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(init?.headers ?? {}),
    },
  });

  let body: ApiResponse<T> | undefined;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    // 본문 없는 응답
  }

  if (!res.ok || body?.success === false) {
    throw new ApiError(res.status, body?.code ?? 'UNKNOWN', body?.message ?? '요청을 처리하지 못했습니다.');
  }
  return body!.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(payload ?? {}) }),
  patch: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(payload ?? {}) }),
};
