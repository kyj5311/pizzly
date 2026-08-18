import { useNavigate } from 'react-router-dom';
import { AppScreen, SelectableCard } from '../../shared/ui';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { useQuestFlow } from '../../store/quest-flow-store';
import type { QuestSituation } from '../../types/quest';

const SITUATION_OPTIONS: Array<{ value: QuestSituation; label: string }> = [
  { value: 'SITTING', label: '앉아 있어요' },
  { value: 'STANDING', label: '서 있어요' },
  { value: 'MOVING', label: '이동 중이에요' },
  { value: 'QUIET', label: '조용한 곳이에요' },
];

/** [QST-02] 현재 상황 선택 */
export default function QuestSituationPage() {
  const navigate = useNavigate();
  const { state, patch } = useQuestFlow();

  return (
    <AppScreen header={<StepIndicator current={2} total={3} />} title="지금 어디에 있나요?">
      <div className="flex flex-col gap-3">
        {SITUATION_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            label={option.label}
            selected={state.situation === option.value}
            onClick={() => {
              patch({ situation: option.value });
              navigate('/quest/condition');
            }}
          />
        ))}
      </div>
    </AppScreen>
  );
}
