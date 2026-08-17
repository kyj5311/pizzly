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
      className="h-2 w-full overflow-hidden rounded-full bg-border"
    >
      <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
    </div>
  );
}
