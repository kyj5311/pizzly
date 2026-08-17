import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

// FE1이 임시로 만듦. FE2 공통 컴포넌트 확정 시 통합 필요.

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white active:bg-primary-strong',
  secondary: 'bg-surface text-ink border border-line',
  ghost: 'bg-transparent text-ink-muted',
};

export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-button px-5 py-4 text-base font-semibold transition disabled:opacity-40',
        variantClass[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  );
}
