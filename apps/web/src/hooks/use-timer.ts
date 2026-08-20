import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  /** 총 시간(초) */
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

/**
 * [QST-06] 퀘스트 수행 타이머.
 * setInterval 누적 오차를 피하려고 "끝나는 시각" 기준으로 남은 시간을 계산한다.
 */
export function useTimer({ duration, onComplete, autoStart = false }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(autoStart);
  const deadlineRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
          onCompleteRef.current?.();
        }
      }
    }, 250);

    return () => window.clearInterval(id);
    // remaining 은 재개 시점의 시작값으로만 사용한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    completedRef.current = false;
    setRunning(false);
    setRemaining(duration);
  }, [duration]);

  return {
    remaining,
    running,
    elapsed: duration - remaining,
    progress: duration > 0 ? 1 - remaining / duration : 0,
    start,
    pause,
    reset,
  };
}
