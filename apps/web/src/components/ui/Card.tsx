import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

// FE1이 임시로 만듦. FE2 공통 컴포넌트 확정 시 통합 필요.
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-card bg-surface p-5', className)} {...props} />;
}
