import type { QuestListItem } from '../features/quest-list/types';

/** FE2 소유. BE 연동 전까지 퀘스트 목록 화면을 끝까지 돌리기 위한 데이터. */
const ITEMS: QuestListItem[] = [
  { id: 'ql-wrist-01', title: '손목 올리기', area: 'WRIST', durationMin: 1, detail: '완료 218', saved: true },
  { id: 'ql-eye-01', title: '눈 깜빡이기', area: 'EYE', durationMin: 1, detail: '완료 218', saved: false },
  { id: 'ql-shoulder-01', title: '어깨 올리기', area: 'NECK_SHOULDER', durationMin: 1, detail: '완료 18', saved: false },
  { id: 'ql-neck-01', title: '목 스트레칭', area: 'NECK_SHOULDER', durationMin: 5, detail: '조용한 장소', saved: true },
  { id: 'ql-eye-02', title: '먼 곳 바라보기', area: 'EYE', durationMin: 1, detail: '완료 132', saved: false },
  { id: 'ql-wrist-02', title: '손목 돌리기', area: 'WRIST', durationMin: 3, detail: '완료 76', saved: false },
  { id: 'ql-rest-01', title: '4-7-8 호흡', area: 'REST', durationMin: 3, detail: '조용한 장소', saved: false },
  { id: 'ql-rest-02', title: '어깨 힘 빼기', area: 'REST', durationMin: 1, detail: '완료 54', saved: false },
];

export async function mockGetQuestList(): Promise<QuestListItem[]> {
  await new Promise((r) => setTimeout(r, 150));
  return ITEMS;
}
