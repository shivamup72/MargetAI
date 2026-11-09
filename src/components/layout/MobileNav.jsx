import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useBusiness } from '../../context/BusinessContext';
import { NAV_SECTIONS } from './navItems';
import { PlanCard } from './NavParts';

/** Phone/tablet menu that drops down from beneath the top bar. */
export default function MobileNav({ isOpen, onClose }) {
  const { selectedBusiness, reviews } = useBusiness();
  const pendingReviewsCount = reviews.filter((r) => r.replyStatus === 'Pending').length;

  // Lock background scroll and allow Escape to close while open
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    // Close if the viewport grows to desktop size (menu is hidden there)
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = (e) => e.matches && onClose();
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] bottom-0 z-[45] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div className="relative max-h-full overflow-y-auto animate-slide-down origin-top bg-white border-b border-slate-200 shadow-xl shadow-slate-900/10 rounded-b-2xl">

        <div className="relative px-4 pt-4 pb-5 sm:px-6 space-y-5">
          {/* Active business */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white via-indigo-50/40 to-white border border-slate-200">
            <span className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0">{selectedBusiness?.logo}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Active Location</div>
              <div className="text-sm font-bold text-slate-900 truncate">{selectedBusiness?.name}</div>
              <div className="text-[11px] text-slate-500">{selectedBusiness?.city}, UP</div>
            </div>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ring-4 ${
                selectedBusiness?.googleConnected ? 'bg-emerald-500 ring-emerald-100' : 'bg-amber-500 ring-amber-100'
              }`}
              title={selectedBusiness?.googleConnected ? 'Connected to Google' : 'Not connected'}
            />
          </div>

          {/* Sections as tappable tiles */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="px-1 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{section.label}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const showBadge = item.badgeKey === 'pendingReviews' && pendingReviewsCount > 0;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium border transition active:scale-[0.98] ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold border-indigo-100'
                            : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : item.isAi ? 'text-purple-600' : 'text-slate-500'}`} />
                          <span className="truncate flex-1">{item.short || item.name}</span>
                          {showBadge && (
                            <span className="min-w-[18px] text-center px-1 py-px rounded-full text-[10px] font-bold bg-rose-500 text-white">
                              {pendingReviewsCount}
                            </span>
                          )}
                          {item.isAi && !showBadge && (
                            <span className="px-1 py-px rounded text-[8px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">Pro</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          <PlanCard variant="light" onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
