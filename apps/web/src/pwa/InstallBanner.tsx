import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** 브라우저의 설치 가능 이벤트를 가로채 커스텀 설치 배너로 보여준다. */
export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = () => {
    void deferredPrompt.prompt();
    void deferredPrompt.userChoice.finally(() => setDeferredPrompt(null));
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 bg-surface px-4 py-3 shadow-card">
      <p className="text-sm font-semibold">홈 화면에 피즐리를 추가해보세요!</p>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={() => setDismissed(true)} className="text-xs text-muted">
          닫기
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-button bg-primary px-3 py-1.5 text-xs font-bold text-white active:bg-primary-strong"
        >
          설치
        </button>
      </div>
    </div>
  );
}
