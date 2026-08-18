import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw } from 'lucide-react';
import { AppScreen, Button, Card } from '../../shared/ui';
import { recommendQuest } from '../../api/quest-api';
import { useQuestFlow } from '../../store/quest-flow-store';
import type { Quest, QuestContext } from '../../types/quest';

type Status = 'loading' | 'ready' | 'empty' | 'error';

/** [QST-04] 추천 퀘스트 */
export default function QuestRecommendPage() {
  const navigate = useNavigate();
  const { state, patch, isReady } = useQuestFlow();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const load = useCallback(
    async (excludeId?: string) => {
      setStatus('loading');
      try {
        const next = await recommendQuest(state as QuestContext, { excludeId });
        if (!next) {
          setStatus('empty');
          return;
        }
        setQuest(next);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    },
    [state],
  );

  useEffect(() => {
    if (!isReady) {
      navigate('/quest/time', { replace: true });
      return;
    }
    void load();
    // 최초 1회만 실행한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return <AppScreen title="피즐리가 고르는 중이에요" />;
  }

  if (status === 'empty') {
    return (
      <AppScreen title="지금 조건에 맞는 퀘스트가 없어요" subtitle="조건을 조금 바꿔볼까요?">
        <Button fullWidth onClick={() => navigate('/quest/time')}>
          다시 고르기
        </Button>
      </AppScreen>
    );
  }

  if (status === 'error' || !quest) {
    return (
      <AppScreen title="퀘스트를 불러오지 못했어요" subtitle="잠시 후 다시 시도해 주세요.">
        <Button fullWidth onClick={() => void load()}>
          다시 시도
        </Button>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      title="이건 어때요?"
      footer={
        <div className="flex flex-col gap-3">
          <Button
            fullWidth
            onClick={() => {
              patch({ selectedQuest: quest });
              navigate('/quest/guide');
            }}
          >
            이 퀘스트 시작
          </Button>
          <Button variant="ghost" fullWidth onClick={() => void load(quest.id)}>
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="size-4" aria-hidden />
              다른 퀘스트 볼래요
            </span>
          </Button>
        </div>
      }
    >
      <Card>
        <h2 className="text-xl font-bold">{quest.title}</h2>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
          <Clock className="size-4" aria-hidden />
          약 {Math.round(quest.durationSec / 60)}분
          {quest.repeatCount ? ` · ${quest.repeatCount}회` : ''}
        </p>
      </Card>
    </AppScreen>
  );
}
