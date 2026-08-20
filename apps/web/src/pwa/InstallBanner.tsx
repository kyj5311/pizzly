import { useState } from 'react';
import { usePwaInstall } from './use-pwa-install';

/** 브라우저의 설치 가능 이벤트를 가로채 커스텀 설치 배너로 보여준다. */
export function InstallBanner() {
  const { canInstall, isStandalone, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || isStandalone || dismissed) return null;

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 bg-surface px-4 py-3 shadow-card"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <p className="text-sm font-semibold">홈 화면에 피즐리를 추가해보세요!</p>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={() => setDismissed(true)} className="text-xs text-muted">
          닫기
        </button>
        <button
          type="button"
          onClick={() => void promptInstall()}
          className="rounded-button bg-primary px-3 py-1.5 text-xs font-bold text-white active:bg-primary-strong"
        >
          설치
        </button>
      </div>
    </div>
  );
}
