import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, MessageSquareText, Sparkles, Share2, ChartColumn } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { isPathActive } from './navItems';

// Center slot (index 2) is the raised AI action button.
const TABS = [
  { label: 'Home', path: '/', icon: House },
  { label: 'Reviews', path: '/reviews', icon: MessageSquareText, badgeKey: 'pendingReviews' },
  { label: 'AI Studio', path: '/ai-studio', icon: Sparkles, primary: true },
  { label: 'Social', path: '/social-media', icon: Share2 },
  { label: 'Insights', path: '/analytics', icon: ChartColumn },
];

/** Light haptic tick on supporting devices (Android Chrome); silently ignored elsewhere. */
const haptic = () => {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* not supported */
  }
};

/** Hide the bar while scrolling down (reading), reveal it on scroll up — like native apps. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const ticking = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last.current;
        const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 24;
        if (y < 80 || nearBottom) setHidden(false);
        else if (delta > 8) setHidden(true);
        else if (delta < -8) setHidden(false);
        last.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return hidden;
}

/**
 * Full-width docked app tab bar for phones and tablets (desktop uses the top bar).
 * Frosted-glass bar with a sliding active indicator and a raised AI button.
 */
export default function BottomTabBar() {
  const { reviews } = useBusiness();
  const { pathname } = useLocation();
  const hidden = useHideOnScroll();
  const pending = reviews.filter((r) => r.replyStatus === 'Pending').length;
  const activeIndex = TABS.findIndex((t) => isPathActive(t.path, pathname));
  const indicatorVisible = activeIndex >= 0 && !TABS[activeIndex].primary;

  return (
    <nav
      aria-label="Primary"
      className={`lg:hidden fixed z-30 inset-x-0 bottom-0 w-full
        transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform
        ${hidden ? 'translate-y-[calc(100%+2rem)]' : 'translate-y-0'}`}
    >
      {/* Full-width docked glass bar; bottom padding fills the home-indicator safe area */}
      <div
        className="relative w-full pb-safe rounded-t-[22px] bg-white/90 backdrop-blur-2xl backdrop-saturate-150
          border-t border-slate-200/70
          shadow-[0_-8px_24px_-12px_rgba(30,27,75,0.22)]"
      >
        {/* Brand hairline along the top edge */}
        <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent" aria-hidden="true" />

        <div className="relative grid grid-cols-5 h-16 max-w-[560px] mx-auto px-1">
          {/* Sliding indicator: a 1/5-wide track moved by whole tab widths, pill centered inside */}
          <div className="absolute inset-y-0 left-1 right-1 pointer-events-none" aria-hidden="true">
            <span
              className={`absolute top-[9px] left-0 w-1/5 flex justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                indicatorVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
            >
              <span className="w-[52px] h-8 rounded-full bg-gradient-to-b from-indigo-100 to-indigo-50 ring-1 ring-inset ring-indigo-200/70" />
            </span>
          </div>

          {TABS.map((tab) => {
            const Icon = tab.icon;
            const showBadge = tab.badgeKey === 'pendingReviews' && pending > 0;

            if (tab.primary) {
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  onClick={haptic}
                  aria-label={tab.label}
                  className="relative flex justify-center select-none"
                >
                  {({ isActive }) => (
                    <span
                      className={`absolute -top-5 w-[54px] h-[54px] rounded-full flex items-center justify-center text-white
                        bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600
                        shadow-[0_10px_22px_-6px_rgba(79,70,229,0.65)] ring-4 ring-white/90
                        transition-transform duration-200 active:scale-90 ${isActive ? 'scale-105' : 'hover:scale-105'}`}
                    >
                      <Icon key={isActive ? 'on' : 'off'} className={`w-6 h-6 ${isActive ? 'animate-tab-pop' : ''}`} strokeWidth={2.2} />
                    </span>
                  )}
                </NavLink>
              );
            }

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.path === '/'}
                onClick={haptic}
                aria-label={showBadge ? `${tab.label}, ${pending} pending` : tab.label}
                className="group relative flex flex-col items-center justify-center gap-[3px] select-none rounded-2xl active:scale-90 transition-transform duration-150"
              >
                {({ isActive }) => (
                  <>
                    <span className="relative h-8 w-[52px] flex items-center justify-center">
                      <Icon
                        key={isActive ? 'on' : 'off'}
                        className={`w-[22px] h-[22px] transition-colors duration-200 ${
                          isActive ? 'text-indigo-600 animate-tab-pop' : 'text-slate-500 group-hover:text-slate-700'
                        }`}
                        strokeWidth={isActive ? 2.3 : 1.9}
                      />
                      {showBadge && (
                        <span className="absolute top-0 right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold leading-none flex items-center justify-center ring-2 ring-white">
                          <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-40" />
                          <span className="relative">{pending}</span>
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10.5px] leading-none tracking-[0.01em] transition-colors duration-200 ${
                        isActive ? 'text-indigo-700 font-semibold' : 'text-slate-500 font-medium'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
