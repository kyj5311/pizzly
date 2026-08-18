import type { ReactNode } from 'react';

interface AppScreenProps {
  title?: string;
  /** 제목 아래 보조 설명 문구 */
  subtitle?: string;
  /** 온보딩·퀘스트처럼 단계가 있는 화면에서 상단 진행 표시에 사용 */
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

/** 모바일 기준 공통 화면 껍데기. 페이지마다 레이아웃을 따로 짜지 않기 위한 것. */
export function AppScreen({ title, subtitle, header, footer, children }: AppScreenProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col px-5 pb-6 pt-8">
      {header}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h1 className="text-xl font-bold">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
      )}
      <main className="flex-1">{children}</main>
      {footer && <div className="pt-4">{footer}</div>}
    </div>
  );
}
