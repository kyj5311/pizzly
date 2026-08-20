/**
 * 서버 공통 응답 규약 (팀 CLAUDE.md 기준)
 * 성공: { success: true, data, message }
 * 실패: { success: false, error: { code, message } }
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  data?: null;
  error: { code: string; message: string };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
