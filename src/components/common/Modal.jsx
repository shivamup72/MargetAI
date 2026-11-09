import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Shared modal used by every dialog in the app.
 *
 * - Rendered into <body> via a portal, so no page wrapper (transforms, animations,
 *   overflow) can trap or offset it — it always covers the viewport.
 * - Phones: native-style bottom sheet with grab handle and safe-area padding.
 *   sm and up: centered dialog that never exceeds 90% of the viewport height.
 * - Header stays fixed; long content scrolls inside the body.
 * - Animated open AND close; Escape key and backdrop click close it.
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg', subtitle }) {
  // Keep the modal mounted while its closing animation plays.
  const [mounted, setMounted] = useState(isOpen);
  if (isOpen && !mounted) setMounted(true);
  const closing = mounted && !isOpen;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) setMounted(false);
        }}
        className={`relative z-10 bg-white w-full ${maxWidth} flex flex-col overflow-hidden
          rounded-t-[22px] max-h-[92dvh] shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.25)]
          sm:rounded-2xl sm:max-h-[min(90dvh,860px)] sm:border sm:border-slate-200 sm:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]
          ${closing ? 'animate-sheet-down sm:animate-scale-down' : 'animate-sheet-up sm:animate-scale-up'}`}
      >
        {/* Brand hairline */}
        <div className="hairline-top absolute top-0 inset-x-0 h-[2px] hidden sm:block" />

        {/* Grab handle (phones) */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0" aria-hidden="true">
          <span className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-2 pb-3 sm:pt-5 sm:pb-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">{title}</h3>
            {subtitle && <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 -mr-1.5 flex items-center justify-center rounded-full sm:rounded-lg text-slate-500 bg-slate-100 sm:bg-transparent hover:text-slate-800 hover:bg-slate-100 transition-colors active:scale-95 shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
