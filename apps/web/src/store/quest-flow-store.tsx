import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Quest, QuestContext } from '../types/quest';

const STORAGE_KEY = 'pizzly.questFlow';

interface QuestFlowState extends Partial<QuestContext> {
  selectedQuest?: Quest;
}

interface QuestFlowApi {
  state: QuestFlowState;
  patch: (next: Partial<QuestFlowState>) => void;
  clear: () => void;
  /** 추천 요청에 필요한 3개 값이 모두 채워졌는지 */
  isReady: boolean;
}

const QuestFlowContext = createContext<QuestFlowApi | null>(null);

function readStored(): QuestFlowState {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as QuestFlowState;
  } catch {
    return {};
  }
}

/**
 * QST-01 ~ QST-07 은 화면이 7개지만 하나의 세션이다.
 * 페이지마다 state 를 따로 두면 뒤로가기·새로고침에 선택값이 날아가므로 여기 모은다.
 */
export function QuestFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuestFlowState>(readStored);

  const patch = useCallback((next: Partial<QuestFlowState>) => {
    setState((prev) => {
      const merged = { ...prev, ...next };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const clear = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState({});
  }, []);

  const value = useMemo<QuestFlowApi>(
    () => ({
      state,
      patch,
      clear,
      isReady: Boolean(state.durationMin && state.situation && state.condition),
    }),
    [state, patch, clear],
  );

  return <QuestFlowContext.Provider value={value}>{children}</QuestFlowContext.Provider>;
}

export function useQuestFlow(): QuestFlowApi {
  const context = useContext(QuestFlowContext);
  if (!context) throw new Error('useQuestFlow 는 QuestFlowProvider 안에서만 사용할 수 있습니다.');
  return context;
}
