import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white active:bg-primary-strong',
  secondary: 'bg-surface text-text border border-border',
  ghost: 'bg-transparent text-muted',
};

/** 임시 스타일. DS 시안 도착 후 이 파일 내부만 교체하면 전 화면에 반영된다. */
export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-button px-5 py-3 text-base font-semibold transition disabled:opacity-40',
        variantClass[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  );
}
