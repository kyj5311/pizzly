import type { ReactNode } from 'react';

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
        className="w-full max-w-sm rounded-card bg-surface p-5 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="mb-3 text-lg font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
