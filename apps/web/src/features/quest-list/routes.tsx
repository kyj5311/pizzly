import type { RouteObject } from 'react-router-dom';
import QuestListPage from './pages/QuestListPage';

/** FE2 소유 (19번 화면 — 퀘스트 목록) */
export const questListRoutes: RouteObject[] = [{ path: '/quests', element: <QuestListPage /> }];
