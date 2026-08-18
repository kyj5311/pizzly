import { useNavigate } from 'react-router-dom';
import { AppScreen, Button, SelectableCard } from '../../shared/ui';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { useOnboarding } from '../../store/onboarding-store';
import type { WellnessArea } from '../../types/onboarding';

const AREA_OPTIONS: Array<{ value: WellnessArea; label: string; description: string }> = [
  { value: 'EYE', label: '눈 건강', description: '화면을 오래 보는 편이에요' },
  { value: 'WRIST', label: '손목·손가락', description: '타이핑이나 마우스를 많이 써요' },
  { value: 'NECK_SHOULDER', label: '목·어깨', description: '고개를 숙이고 있는 시간이 길어요' },
  { value: 'REST', label: '호흡·휴식', description: '잠깐씩 쉬어가고 싶어요' },
];

/** [ONB-01] 관심 활동 선택 */
export default function InterestsPage() {
  const navigate = useNavigate();
  const { payload, toggleInterest } = useOnboarding();

  return (
    <AppScreen
      header={<StepIndicator current={1} total={3} />}
      title="어떤 걸 챙기고 싶나요?"
      subtitle="하나 이상 골라주세요. 나중에 바꿀 수 있어요."
      footer={
        <Button
          fullWidth
          disabled={payload.interests.length === 0}
          onClick={() => navigate('/onboarding/restrictions')}
        >
          다음
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {AREA_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={payload.interests.includes(option.value)}
            onClick={() => toggleInterest(option.value)}
          />
        ))}
      </div>
    </AppScreen>
  );
}
