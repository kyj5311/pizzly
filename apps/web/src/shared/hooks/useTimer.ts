import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  /** 총 시간(초) */
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

/**
 * 퀘스트 수행(QST-06) 타이머.
 * setInterval 누적 오차를 피하려고 시작 시각 기준으로 남은 시간을 계산한다.
 */
export function useTimer({ duration, onComplete, autoStart = false }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(autoStart);
  const deadlineRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    deadlineRef.current = Date.now() + remaining * 1000;

    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round(((deadlineRef.current ?? 0) - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    }, 250);

    return () => window.clearInterval(id);
    // remaining 은 일시정지 재개 시점의 시작값으로만 쓴다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    completedRef.current = false;
    setRunning(false);
    setRemaining(duration);
  }, [duration]);

  return { remaining, running, progress: 1 - remaining / duration, start, pause, reset };
}
