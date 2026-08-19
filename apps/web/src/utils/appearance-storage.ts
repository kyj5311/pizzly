const RESET_KEY = 'pizzly.appearanceResetToBase';

/**
 * 상점의 "처음 곰으로 돌아가기" 아이템 적용 여부.
 * true면 레벨과 무관하게 항상 아기 곰(1단계) 이미지를 보여준다.
 */
export const appearanceStorage = {
  isResetToBase: () => localStorage.getItem(RESET_KEY) === 'true',
  setResetToBase: (value: boolean) => localStorage.setItem(RESET_KEY, String(value)),
};
