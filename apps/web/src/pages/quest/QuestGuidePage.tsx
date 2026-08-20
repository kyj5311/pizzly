import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, BackHomeButton, Button, Card, Modal, ProgressBar } from '../../shared/ui';
import { RepeatCounter } from '../../components/quest/RepeatCounter';
import { useTimer } from '../../hooks/use-timer';
import { formatDuration } from '../../utils/format';
import { useQuestFlow } from '../../store/quest-flow-store';

/**
 * [QST-05, QST-06] 활동 가이드 + 진행 관리.
 * 원래는 가이드 화면과 타이머 화면이 분리돼 있었는데, 가이드를 보면서 타이머를 같이 볼 수 있도록
 * 한 화면으로 합쳤다 — "시작하기"를 누르면 가이드 박스 안 내용이 안내 문구에서 타이머/카운터로 바뀐다.
 */
export default function QuestGuidePage() {
  const navigate = useNavigate();
  const { state, clear } = useQuestFlow();
  const quest = state.selectedQuest;

  const [started, setStarted] = useState(false);
  const [askStop, setAskStop] = useState(false);
  const [count, setCount] = useState(0);

  const isRepeatMode = Boolean(quest?.repeatCount);
  const total = quest?.repeatCount ?? 0;

  const { remaining, running, progress, start, pause } = useTimer({
    duration: quest?.durationSec ?? 60,
    onComplete: () => navigate('/quest/complete'),
  });

  useEffect(() => {
    if (!quest) navigate('/quest/time', { replace: true });
  }, [quest, navigate]);

  useEffect(() => {
    if (started && isRepeatMode && total > 0 && count >= total) {
      navigate('/quest/complete');
    }
  }, [started, count, total, isRepeatMode, navigate]);

  if (!quest) return null;

  const handleStart = () => {
    setStarted(true);
    if (!isRepeatMode) start();
  };

  const handleStop = () => {
    clear();
    navigate('/');
  };

  return (
    <AppScreen
      header={<BackHomeButton />}
      title={quest.title}
      footer={
        started ? (
          <div className="flex flex-col gap-3">
            {!isRepeatMode && (
              <Button variant="secondary" fullWidth onClick={running ? pause : start}>
                {running ? '일시정지' : '이어서 하기'}
              </Button>
            )}
            <Button variant="ghost" fullWidth onClick={() => setAskStop(true)}>
              그만하기
            </Button>
          </div>
        ) : (
          <Button fullWidth onClick={handleStart}>
            시작하기
          </Button>
        )
      }
    >
      {/* DS 에셋 자리: SIGNATURE 는 피즐리 동작 일러스트, GENERAL 은 일반 가이드 이미지. 시작 후엔 타이머/카운터로 전환 */}
      <Card className="mb-6 flex min-h-44 flex-col items-center justify-center gap-3 py-6 text-muted">
        {!started ? (
          quest.guideType === 'SIGNATURE' ? (
            '피즐리 시그니처 동작'
          ) : (
            '동작 가이드'
          )
        ) : isRepeatMode ? (
          <RepeatCounter
            count={count}
            total={total}
            onIncrease={() => setCount((prev) => Math.min(total, prev + 1))}
            onDecrease={() => setCount((prev) => Math.max(0, prev - 1))}
          />
        ) : (
          <div className="flex w-full flex-col items-center gap-4">
            <p className="text-5xl font-bold tabular-nums text-text">{formatDuration(remaining)}</p>
            <div className="w-full px-4">
              <ProgressBar value={progress} label="진행률" />
            </div>
          </div>
        )}
      </Card>

      <ol className="flex flex-col gap-4">
        {quest.steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      {quest.repeatCount && !started && (
        <p className="mt-6 text-sm text-muted">총 {quest.repeatCount}회 반복해요.</p>
      )}

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
