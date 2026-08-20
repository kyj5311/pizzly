import type { ButtonHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/cn';

interface SelectableCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  label: string;
  description?: string;
}

/** 온보딩(관심 영역/제한사항)·퀘스트(시간/상황/컨디션) 선택지에 공통으로 쓰는 카드. */
export function SelectableCard({ selected, label, description, className, ...props }: SelectableCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3 rounded-card border p-4 text-left transition',
        selected ? 'border-primary bg-primary/10' : 'border-border bg-surface',
        className,
      )}
      {...props}
    >
      <span className="flex-1">
        <span className="block font-semibold">{label}</span>
        {description && <span className="mt-1 block text-sm text-muted">{description}</span>}
      </span>
      {selected && <Check className="size-5 shrink-0 text-primary" aria-hidden />}
    </button>
  );
}
