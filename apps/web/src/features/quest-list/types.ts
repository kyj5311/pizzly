/** 퀘스트 목록(19번 화면) 타입 (소유자: FE2 — FE1 퀘스트 추천 흐름과는 별개의 둘러보기/카탈로그 화면) */
export type QuestListTab = 'RECOMMENDED' | 'CATEGORY' | 'SAVED';

export type QuestListArea = 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'REST';

export interface QuestListItem {
  id: string;
  title: string;
  area: QuestListArea;
  durationMin: number;
  /** "완료 218" 같은 인기도 표시 또는 "조용한 장소" 같은 수행 조건 안내 */
  detail: string;
  saved: boolean;
}
