import { Minus, Plus } from 'lucide-react';
import { Button, ProgressBar } from '../../shared/ui';

interface RepeatCounterProps {
  count: number;
  total: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

/** [QST-06] 횟수형 퀘스트용 카운터 (손목 돌리기 10회 등) */
export function RepeatCounter({ count, total, onIncrease, onDecrease }: RepeatCounterProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <p className="text-6xl font-bold tabular-nums">
        {count}
        <span className="text-2xl text-muted"> / {total}</span>
      </p>
      <div className="w-full">
        <ProgressBar value={total > 0 ? count / total : 0} label="진행률" />
      </div>
      <div className="flex w-full gap-3">
        <Button variant="secondary" fullWidth onClick={onDecrease} aria-label="횟수 줄이기">
          <Minus className="mx-auto size-5" aria-hidden />
        </Button>
        <Button fullWidth onClick={onIncrease} aria-label="한 번 완료">
          <Plus className="mx-auto size-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
