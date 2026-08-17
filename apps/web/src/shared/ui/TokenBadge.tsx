import { Icon } from './Icon';
import { cn } from '../lib/cn';

interface TokenBadgeProps {
  amount: number;
  className?: string;
}

/** 보유 토큰 표시. 홈·상점·패스에서 공통으로 쓴다. */
export function TokenBadge({ amount, className }: TokenBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1 text-sm font-bold text-gold-strong',
        className,
      )}
    >
      <Icon name="token" size={16} />
      {amount.toLocaleString()}
    </span>
  );
}
