import { useNavigate } from 'react-router-dom';
import { AppScreen } from '../../components/ui/AppScreen';
import { SelectableCard } from '../../components/ui/SelectableCard';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { useQuestFlow } from '../../store/quest-flow-store';
import type { WellnessArea } from '../../types/onboarding';

const CONDITION_OPTIONS: Array<{ value: WellnessArea; label: string; description: string }> = [
  { value: 'EYE', label: '눈이 피로해요', description: '화면을 오래 봤어요' },
  { value: 'WRIST', label: '손목·손가락이 뻐근해요', description: '타이핑이 많았어요' },
  { value: 'NECK_SHOULDER', label: '목·어깨가 뭉쳤어요', description: '고개를 숙이고 있었어요' },
  { value: 'REST', label: '그냥 쉬고 싶어요', description: '호흡을 정리할래요' },
];

/** [QST-03] 현재 컨디션 선택 */
export default function QuestConditionPage() {
  const navigate = useNavigate();
  const { state, patch } = useQuestFlow();

  return (
    <AppScreen header={<StepIndicator current={3} total={3} />} title="지금 어떤 상태인가요?">
      <div className="flex flex-col gap-3">
        {CONDITION_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={state.condition === option.value}
            onClick={() => {
              patch({ condition: option.value });
              navigate('/quest/recommend');
            }}
          />
        ))}
      </div>
    </AppScreen>
  );
}
