import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, Button, Card, PizzlyCharacter } from '../../shared/ui';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { saveOnboarding } from '../../api/auth-api';
import { useOnboarding } from '../../store/onboarding-store';

/** [ONB-03] 아기 곰 피즐리 생성 */
export default function CreatePizzlyPage() {
  const navigate = useNavigate();
  const { payload } = useOnboarding();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setPending(true);
    setError(null);
    try {
      await saveOnboarding(payload);
      navigate('/', { replace: true });
    } catch {
      setError('저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AppScreen
      header={<StepIndicator current={3} total={3} />}
      title="피즐리를 만났어요"
      subtitle="함께 성장할 아기 곰이에요."
      footer={
        <div className="flex flex-col gap-3">
          <Button fullWidth disabled={pending} onClick={() => void handleSubmit()}>
            {pending ? '준비하는 중' : '시작하기'}
          </Button>
          {error && <p className="text-center text-sm text-danger">{error}</p>}
        </div>
      }
    >
      <Card className="flex h-60 items-center justify-center">
        <PizzlyCharacter level={1} size={200} />
      </Card>
    </AppScreen>
  );
}
