const TOKEN_KEY = 'pizzly.accessToken';

/** 토큰 접근은 반드시 이 함수들로만. 실제 인증 방식이 바뀌어도 여기만 고치면 된다. */
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};
