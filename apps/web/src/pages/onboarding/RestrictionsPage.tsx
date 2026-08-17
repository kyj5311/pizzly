import { useNavigate } from 'react-router-dom';
import { AppScreen } from '../../components/ui/AppScreen';
import { Button } from '../../components/ui/Button';
import { SelectableCard } from '../../components/ui/SelectableCard';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { useOnboarding } from '../../store/onboarding-store';
import type { Restriction } from '../../types/onboarding';

const RESTRICTION_OPTIONS: Array<{ value: Restriction; label: string }> = [
  { value: 'NO_STANDING', label: '서서 하기는 어려워요' },
  { value: 'NO_ARM_RAISE', label: '팔을 크게 들기 어려워요' },
  { value: 'NO_SOUND', label: '소리 내기 어려워요' },
  { value: 'NO_FLOOR', label: '바닥에 앉기 어려워요' },
];

/** [ONB-02] 활동 제한사항 설정 — 여기서 고른 값이 추천 필터가 된다 */
export default function RestrictionsPage() {
  const navigate = useNavigate();
  const { payload, toggleRestriction } = useOnboarding();

  return (
    <AppScreen
      header={<StepIndicator current={2} total={3} />}
      title="피해야 할 동작이 있나요?"
      subtitle="해당하는 게 없으면 그냥 넘어가도 괜찮아요."
      footer={
        <Button fullWidth onClick={() => navigate('/onboarding/create')}>
          다음
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {RESTRICTION_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            label={option.label}
            selected={payload.restrictions.includes(option.value)}
            onClick={() => toggleRestriction(option.value)}
          />
        ))}
      </div>
    </AppScreen>
  );
}
