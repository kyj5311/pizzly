import type { ButtonHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

// FE1이 임시로 만듦. FE2 공통 컴포넌트 확정 시 통합 필요.

interface SelectableCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  label: string;
  description?: string;
}

export function SelectableCard({
  selected,
  label,
  description,
  className,
  ...props
}: SelectableCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3 rounded-card border p-5 text-left transition',
        selected ? 'border-primary bg-surface' : 'border-line bg-surface',
        className,
      )}
      {...props}
    >
      <span className="flex-1">
        <span className="block font-semibold">{label}</span>
        {description && <span className="mt-1 block text-sm text-ink-muted">{description}</span>}
      </span>
      {selected && <Check className="size-5 shrink-0 text-primary" aria-hidden />}
    </button>
  );
}
