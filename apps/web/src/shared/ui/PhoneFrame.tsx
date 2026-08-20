import type { ReactNode } from 'react';
import { InstallBanner } from '../../pwa/InstallBanner';

/**
 * 실제 모바일 화면(sm 미만)에서는 베젤 없이 전체 화면으로 채우고,
 * 데스크톱 브라우저(sm 이상)에서는 데모용 베젤+노치 목업으로 보여준다.
 * 모바일 전체화면 시 노치/홈 인디케이터에 콘텐츠가 가리지 않도록 safe-area-inset을 패딩으로 반영한다.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#171225] sm:p-4">
      <div
        className="relative h-dvh w-full overflow-hidden bg-bg shadow-2xl
          sm:h-[844px] sm:max-h-[95vh] sm:w-[390px] sm:max-w-full sm:rounded-[44px] sm:border-[10px] sm:border-black"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black sm:block" />
        <div className="h-full overflow-y-auto">{children}</div>
        <InstallBanner />
      </div>
    </div>
  );
}
