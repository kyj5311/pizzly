/**
 * BE 와 Phase 0 에서 합의한 공통 응답 규약.
 * 실제 포맷이 확정되면 이 파일만 고치고 전 도메인이 따라간다.
 * 소유자: FE2 (변경 시 PR 리뷰 필수)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
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
