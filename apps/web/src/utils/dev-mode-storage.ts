const KEY = 'pizzly.devMode';
const SNAPSHOT_KEY = 'pizzly.devModeSnapshot';

export interface LevelSnapshot {
  level: number;
  exp: number;
  token: number;
}

/**
 * 설정 화면 맨 아래 "개발자 모드" 토글. 레벨·토큰 직접 수정 등 QA용 기능을 켜고 끈다.
 * 토글을 켤 때 원래 레벨/경험치/토큰을 snapshot으로 저장해두고, 끌 때 그 값으로 되돌린다.
 */
export const devModeStorage = {
  isOn: () => localStorage.getItem(KEY) === 'true',
  set: (value: boolean) => localStorage.setItem(KEY, String(value)),
  getSnapshot: (): LevelSnapshot | null => {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LevelSnapshot;
    } catch {
      return null;
    }
  },
  setSnapshot: (snapshot: LevelSnapshot) => localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot)),
  clearSnapshot: () => localStorage.removeItem(SNAPSHOT_KEY),
};
