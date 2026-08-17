import type { ReactNode } from 'react';
import { InstallBanner } from '../../pwa/InstallBanner';

/** 데모용 휴대폰 프레임. 창 크기와 상관없이 항상 베젤+노치를 씌워 폰처럼 보이게 한다. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#171225] p-4">
      <div className="relative h-[844px] max-h-[95vh] w-[390px] max-w-full overflow-hidden rounded-[44px] border-[10px] border-black bg-bg shadow-2xl">
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black" />
        <div className="h-full overflow-y-auto">{children}</div>
        <InstallBanner />
      </div>
    </div>
  );
}
