import type { ReactNode } from 'react';

// FE1이 임시로 만듦. FE2 공통 레이아웃 확정 시 통합 필요.

interface AppScreenProps {
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

/** 모바일 기준 공통 화면 껍데기 */
export function AppScreen({ title, subtitle, header, footer, children }: AppScreenProps) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 pb-8 pt-6">
      {header}
      {title && <h1 className="text-2xl font-bold leading-snug">{title}</h1>}
      {subtitle && <p className="mt-2 text-ink-muted">{subtitle}</p>}
      <main className="mt-6 flex-1">{children}</main>
      {footer && <div className="pt-6">{footer}</div>}
    </div>
  );
}
