/** 초 -> "01:45" */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
}
