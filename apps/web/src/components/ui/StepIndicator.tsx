import { cn } from '../../utils/cn';

// FE1이 임시로 만듦. 온보딩·퀘스트 단계 표시용.

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex gap-1.5" aria-label={`${total}단계 중 ${current}단계`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-1.5 flex-1 rounded-full',
            index < current ? 'bg-primary' : 'bg-line',
          )}
        />
      ))}
    </div>
  );
}
