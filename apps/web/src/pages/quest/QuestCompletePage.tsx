import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';
import { AppScreen } from '../../components/ui/AppScreen';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RewardBoxModal } from '../../components/reward/RewardBoxModal';
import { completeQuest } from '../../api/quest-api';
import { useQuestFlow } from '../../store/quest-flow-store';
import type { QuestCompleteResult } from '../../types/quest';

/** 랜덤 상자 등장 확률 — 서버 로직 확정 시 응답값으로 대체한다 */
const BOX_APPEAR_RATE = 0.6;

/** [QST-07] 퀘스트 완료 → 보상(REW) 모달로 이어진다 */
export default function QuestCompletePage() {
  const navigate = useNavigate();
  const { state, clear } = useQuestFlow();
  const quest = state.selectedQuest;

  const [result, setResult] = useState<QuestCompleteResult | null>(null);
  const [boxOpen, setBoxOpen] = useState(false);

  useEffect(() => {
    if (!quest) {
      navigate('/quest/time', { replace: true });
      return;
    }
    void completeQuest(quest.id, quest.durationSec)
      .then((data) => {
        setResult(data);
        if (Math.random() < BOX_APPEAR_RATE) setBoxOpen(true);
      })
      .catch(() => setResult(null));
    // 진입 시 1회만 실행한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goHome = () => {
    clear();
    navigate('/');
  };

  return (
    <AppScreen
      title="퀘스트 완료!"
      subtitle="피즐리가 조금 더 자랐어요."
      footer={
        <Button fullWidth onClick={goHome}>
          홈으로
        </Button>
      }
    >
      <Card className="flex flex-col items-center gap-3 py-8">
        <PartyPopper className="size-10 text-primary" aria-hidden />
        <p className="text-lg font-bold">
          {result ? `경험치 +${result.reward.exp}` : '기록을 저장하는 중이에요'}
        </p>
        {result && <p className="text-sm text-ink-muted">토큰 +{result.reward.token}</p>}
      </Card>

      <RewardBoxModal open={boxOpen} bonusExp={15} onClose={() => setBoxOpen(false)} />
    </AppScreen>
  );
}
