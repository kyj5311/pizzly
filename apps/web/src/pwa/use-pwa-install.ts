import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOSDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandaloneDisplay() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as { standalone?: boolean }).standalone === true
  );
}

/**
 * beforeinstallprompt 캡처를 InstallBanner·햄버거 메뉴 등 여러 곳에서 공용으로 쓰기 위한 훅.
 * 리스너는 호출한 컴포넌트마다 각자 등록되지만, 브라우저가 이벤트를 모든 리스너에 동일하게
 * 전달하므로 특정 컴포넌트가 먼저 값을 가져가도 다른 컴포넌트가 못 받는 일은 없다.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(isStandaloneDisplay);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return {
    /** beforeinstallprompt를 캡처해서 바로 설치 프롬프트를 띄울 수 있는 상태 (Android/데스크톱 Chrome·Edge 등) */
    canInstall: deferredPrompt !== null,
    /** iOS Safari는 beforeinstallprompt 자체가 없어 수동 안내가 필요 */
    isIOS: isIOSDevice(),
    isStandalone,
    promptInstall,
  };
}
