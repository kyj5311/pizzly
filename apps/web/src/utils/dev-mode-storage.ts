const KEY = 'pizzly.devMode';

/** 설정 화면 맨 아래 "개발자 모드" 토글. 레벨 직접 수정 등 QA용 기능을 켜고 끈다. */
export const devModeStorage = {
  isOn: () => localStorage.getItem(KEY) === 'true',
  set: (value: boolean) => localStorage.setItem(KEY, String(value)),
};
