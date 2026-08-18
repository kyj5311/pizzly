import { useNavigate } from 'react-router-dom';
import { AppScreen, SelectableCard } from '../../shared/ui';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { useQuestFlow } from '../../store/quest-flow-store';
import type { QuestDuration } from '../../types/quest';

const TIME_OPTIONS: Array<{ value: QuestDuration; label: string; description: string }> = [
  { value: 1, label: '1분', description: '엘리베이터를 기다리는 정도' },
  { value: 3, label: '3분', description: '버스를 기다리는 정도' },
  { value: 5, label: '5분', description: '잠깐 자리에서 쉴 수 있어요' },
];

/** [QST-01] 사용 가능 시간 선택 */
export default function QuestTimePage() {
  const navigate = useNavigate();
  const { state, patch } = useQuestFlow();

  return (
    <AppScreen
      header={<StepIndicator current={1} total={3} />}
      title="얼마나 시간이 있나요?"
    >
      <div className="flex flex-col gap-3">
        {TIME_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={state.durationMin === option.value}
            onClick={() => {
              patch({ durationMin: option.value });
              navigate('/quest/situation');
            }}
          />
        ))}
      </div>
    </AppScreen>
  );
}
