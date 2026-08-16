import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import HomePlaceholderPage from './pages/HomePlaceholderPage';
import LoginPage from './pages/auth/LoginPage';
import InterestsPage from './pages/onboarding/InterestsPage';
import RestrictionsPage from './pages/onboarding/RestrictionsPage';
import CreatePizzlyPage from './pages/onboarding/CreatePizzlyPage';
import QuestTimePage from './pages/quest/QuestTimePage';
import QuestSituationPage from './pages/quest/QuestSituationPage';
import QuestConditionPage from './pages/quest/QuestConditionPage';
import QuestRecommendPage from './pages/quest/QuestRecommendPage';
import QuestGuidePage from './pages/quest/QuestGuidePage';
import QuestPlayPage from './pages/quest/QuestPlayPage';
import QuestCompletePage from './pages/quest/QuestCompletePage';
import { OnboardingProvider } from './store/onboarding-store';
import { QuestFlowProvider } from './store/quest-flow-store';

export const router = createBrowserRouter([
  // --- FE2 영역 (임시 자리) ---
  { path: '/', element: <HomePlaceholderPage /> },

  // --- FE1 영역 ---
  { path: '/login', element: <LoginPage /> }, // LOG-01
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
      { path: 'guide', element: <QuestGuidePage /> }, // QST-05
      { path: 'play', element: <QuestPlayPage /> }, // QST-06
      { path: 'complete', element: <QuestCompletePage /> }, // QST-07
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
