import type { ReactNode } from 'react';

// FE1이 임시로 만듦. FE2 공통 컴포넌트 확정 시 통합 필요.

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-card bg-surface p-6"
        onClick={(event) => event.stopPropagation()}
      >
        {title && <h2 className="mb-3 text-lg font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
