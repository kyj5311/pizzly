import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, Button, Card } from '../../shared/ui';
import { useQuestFlow } from '../../store/quest-flow-store';

/** [QST-05] 활동 가이드 — DS 일러스트·모션 도착 전까지 텍스트 안내로 진행 */
export default function QuestGuidePage() {
  const navigate = useNavigate();
  const { state } = useQuestFlow();
  const quest = state.selectedQuest;

  useEffect(() => {
    if (!quest) navigate('/quest/time', { replace: true });
  }, [quest, navigate]);

  if (!quest) return null;

  return (
    <AppScreen
      title={quest.title}
      footer={
        <Button fullWidth onClick={() => navigate('/quest/play')}>
          시작하기
        </Button>
      }
    >
      {/* DS 에셋 자리: SIGNATURE 는 피즐리 동작 일러스트, GENERAL 은 일반 가이드 이미지 */}
      <Card className="mb-6 flex h-44 items-center justify-center text-muted">
        {quest.guideType === 'SIGNATURE' ? '피즐리 시그니처 동작' : '동작 가이드'}
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

      {quest.repeatCount && (
        <p className="mt-6 text-sm text-muted">총 {quest.repeatCount}회 반복해요.</p>
      )}
    </AppScreen>
  );
}
