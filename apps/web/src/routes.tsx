import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import InterestsPage from './pages/onboarding/InterestsPage';
import RestrictionsPage from './pages/onboarding/RestrictionsPage';
import CreatePizzlyPage from './pages/onboarding/CreatePizzlyPage';
import QuestTimePage from './pages/quest/QuestTimePage';
import QuestSituationPage from './pages/quest/QuestSituationPage';
import QuestConditionPage from './pages/quest/QuestConditionPage';
import QuestRecommendPage from './pages/quest/QuestRecommendPage';
import QuestGuidePage from './pages/quest/QuestGuidePage';
import QuestCompletePage from './pages/quest/QuestCompletePage';
import { OnboardingProvider } from './store/onboarding-store';
import { QuestFlowProvider } from './store/quest-flow-store';
import { tokenStorage } from './utils/storage';

import HomePage from './features/home/pages/HomePage';
import GrowthPage from './features/growth/pages/GrowthPage';
import ShopPage from './features/shop/pages/ShopPage';
import PassPage from './features/pass/pages/PassPage';
import RecordPage from './features/record/pages/RecordPage';
import QuestListPage from './features/quest-list/pages/QuestListPage';
import SettingsPage from './features/settings/pages/SettingsPage';

// 로그인 토큰 없이 화면에 바로 들어오면(북마크, 세션 만료 등) API가 계속 401만
// 반환해서 원인 모를 에러 화면만 보게 되던 문제 방지 — 토큰 없으면 로그인으로 보낸다.
function RequireAuth() {
  if (!tokenStorage.get()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> }, // LOG-01

  {
    element: <RequireAuth />,
    children: [
      // --- FE2 영역 ---
      { path: '/', element: <HomePage /> },
      { path: '/growth', element: <GrowthPage /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/pass', element: <PassPage /> },
      { path: '/record', element: <RecordPage /> },
      { path: '/quests', element: <QuestListPage /> }, // 19번 화면(퀘스트 목록)
      { path: '/settings', element: <SettingsPage /> },

      // --- FE1 영역 ---
      {
        path: '/onboarding',
        element: (
          <OnboardingProvider>
            <Outlet />
          </OnboardingProvider>
        ),
        children: [
          { index: true, element: <Navigate to="/onboarding/interests" replace /> },
          { path: 'interests', element: <InterestsPage /> }, // ONB-01
          { path: 'restrictions', element: <RestrictionsPage /> }, // ONB-02
          { path: 'create', element: <CreatePizzlyPage /> }, // ONB-03
        ],
      },
      {
        path: '/quest',
        element: (
          <QuestFlowProvider>
            <Outlet />
          </QuestFlowProvider>
        ),
        children: [
          { index: true, element: <Navigate to="/quest/time" replace /> },
          { path: 'time', element: <QuestTimePage /> }, // QST-01
          { path: 'situation', element: <QuestSituationPage /> }, // QST-02
          { path: 'condition', element: <QuestConditionPage /> }, // QST-03
          { path: 'recommend', element: <QuestRecommendPage /> }, // QST-04
          { path: 'guide', element: <QuestGuidePage /> }, // QST-05, QST-06(가이드 화면에 타이머 통합)
          { path: 'play', element: <Navigate to="/quest/guide" replace /> }, // 구버전 경로 호환
          { path: 'complete', element: <QuestCompletePage /> }, // QST-07
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
