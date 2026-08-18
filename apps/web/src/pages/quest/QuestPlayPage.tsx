import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, Button, Modal, ProgressBar } from '../../shared/ui';
import { RepeatCounter } from '../../components/quest/RepeatCounter';
import { useTimer } from '../../hooks/use-timer';
import { formatDuration } from '../../utils/format';
import { useQuestFlow } from '../../store/quest-flow-store';

/** [QST-06] 활동 진행 관리 — 타이머형 / 횟수형 두 가지를 모두 지원한다 */
export default function QuestPlayPage() {
  const navigate = useNavigate();
  const { state, clear } = useQuestFlow();
  const quest = state.selectedQuest;

  const [askStop, setAskStop] = useState(false);
  const [count, setCount] = useState(0);

  const isRepeatMode = Boolean(quest?.repeatCount);
  const total = quest?.repeatCount ?? 0;

  const { remaining, running, progress, start, pause } = useTimer({
    duration: quest?.durationSec ?? 60,
    autoStart: !isRepeatMode,
    onComplete: () => navigate('/quest/complete'),
  });

  useEffect(() => {
    if (!quest) navigate('/quest/time', { replace: true });
  }, [quest, navigate]);

  useEffect(() => {
    if (isRepeatMode && total > 0 && count >= total) {
      navigate('/quest/complete');
    }
  }, [count, total, isRepeatMode, navigate]);

  if (!quest) return null;

  const handleStop = () => {
    clear();
    navigate('/');
  };

  return (
    <AppScreen title={quest.title}>
      {isRepeatMode ? (
        <RepeatCounter
          count={count}
          total={total}
          onIncrease={() => setCount((prev) => Math.min(total, prev + 1))}
          onDecrease={() => setCount((prev) => Math.max(0, prev - 1))}
        />
      ) : (
        <div className="flex flex-col items-center gap-6 py-12">
          <p className="text-6xl font-bold tabular-nums">{formatDuration(remaining)}</p>
          <div className="w-full">
            <ProgressBar value={progress} label="진행률" />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {!isRepeatMode && (
          <Button variant="secondary" fullWidth onClick={running ? pause : start}>
            {running ? '일시정지' : '이어서 하기'}
          </Button>
        )}
        <Button variant="ghost" fullWidth onClick={() => setAskStop(true)}>
          그만하기
        </Button>
      </div>

      <Modal open={askStop} title="퀘스트를 그만할까요?" onClose={() => setAskStop(false)}>
        <p className="mb-5 text-muted">지금 나가면 이번 기록은 저장되지 않아요.</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setAskStop(false)}>
            계속하기
          </Button>
          <Button fullWidth onClick={handleStop}>
            그만하기
          </Button>
        </div>
      </Modal>
    </AppScreen>
  );
}
