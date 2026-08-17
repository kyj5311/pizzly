// FE1이 임시로 만듦. FE2 공통 컴포넌트 확정 시 통합 필요.

interface ProgressBarProps {
  /** 0 ~ 1 */
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-line"
    >
      <div
        className="h-full rounded-full bg-primary transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
