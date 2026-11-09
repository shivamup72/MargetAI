import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Calendar,
  Plus,
  Check,
  Search,
  Menu,
  X,
  CornerDownLeft,
  BellOff,
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../context/ToastContext';
import AddBusinessModal from '../modals/AddBusinessModal';
import DemoNotice from '../common/DemoNotice';
import MobileNav from './MobileNav';
import { BrandMark, PlanCard } from './NavParts';
import { NAV_ITEMS, NAV_SECTIONS, isPathActive } from './navItems';

// Top-bar dropdowns: pinned full-width under the bar on phones, anchored to their trigger from `sm` up.
const TOPBAR_DROPDOWN =
  'fixed left-3 right-3 top-[calc(4.25rem+env(safe-area-inset-top))] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 bg-white rounded-xl shadow-soft-lg border border-slate-200 z-50 animate-scale-up origin-top-left lg:origin-top-right';

// Sub-bar dropdowns: right-anchored and capped to the viewport width so they never overflow.
const SUBBAR_DROPDOWN =
  'absolute left-0 lg:left-auto lg:right-0 top-full mt-2 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-soft-lg border border-slate-200 z-50 animate-scale-up origin-top-left lg:origin-top-right';

const DATE_LABELS = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  '1y': 'This Year',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/** Hook: close a popover when clicking outside its ref. */
function useOutsideClose(ref, open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const handle = (e) => ref.current && !ref.current.contains(e.target) && onClose();
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref, open, onClose]);
}

/* ------------------------------------------------------------------ */
/* Desktop navigation                                                  */
/* ------------------------------------------------------------------ */

function DesktopNav({ pendingReviewsCount }) {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const close = React.useCallback(() => setOpenMenu(null), []);
  useOutsideClose(navRef, openMenu !== null, close);

  // Close menus on Escape
  useEffect(() => {
    if (!openMenu) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpenMenu(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMenu]);

  const linkCls = (active) =>
    `relative flex items-center gap-2 h-9 px-3 rounded-lg text-sm whitespace-nowrap border transition-colors duration-150 ${
      active
        ? 'bg-indigo-50 text-indigo-700 font-semibold border-indigo-100 shadow-[0_1px_1px_rgba(15,23,42,0.03)]'
        : 'text-slate-600 font-medium border-transparent hover:text-slate-900 hover:bg-slate-100'
    }`;

  const [main, ...menus] = NAV_SECTIONS;

  return (
    <nav ref={navRef} className="hidden lg:flex items-center gap-1 min-w-0" aria-label="Main navigation">
      {main.items.map((item) => (
        <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => linkCls(isActive)}>
          <item.icon className="w-4 h-4" />
          {item.short || item.name}
        </NavLink>
      ))}

      {menus.map((section) => {
        const sectionActive = section.items.some((i) => isPathActive(i.path, pathname));
        const activeChild = section.items.find((i) => isPathActive(i.path, pathname));
        const hasBadge = section.items.some((i) => i.badgeKey === 'pendingReviews') && pendingReviewsCount > 0;
        const isOpen = openMenu === section.label;
        const wide = section.items.length > 4;

        return (
          <div key={section.label} className="relative">
            <button
              onClick={() => setOpenMenu(isOpen ? null : section.label)}
              className={`${linkCls(sectionActive)} ${isOpen && !sectionActive ? '!bg-slate-100 !text-slate-900' : ''}`}
              aria-haspopup="menu"
              aria-expanded={isOpen}
            >
              {sectionActive && activeChild ? (
                <>
                  <activeChild.icon className="w-4 h-4" />
                  <span className="max-w-[150px] truncate">{activeChild.name}</span>
                </>
              ) : (
                <>
                  {section.icon && <section.icon className="w-4 h-4" />}
                  {section.label}
                </>
              )}
              {hasBadge && !sectionActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white" />}
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div
                role="menu"
                className={`absolute left-0 top-full mt-3 bg-white rounded-2xl shadow-2xl shadow-indigo-950/20 ring-1 ring-slate-200/80 p-2 z-50 animate-scale-up origin-top-left ${
                  wide ? 'w-[540px] grid grid-cols-2 gap-1' : 'w-[290px] grid gap-1'
                }`}
              >
                <div className={`px-3 pt-1.5 pb-2 eyebrow ${wide ? 'col-span-2' : ''}`}>{section.label}</div>
                {section.items.map((item) => {
                  const active = isPathActive(item.path, pathname);
                  const showBadge = item.badgeKey === 'pendingReviews' && pendingReviewsCount > 0;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={close}
                      role="menuitem"
                      className={`group flex items-start gap-3 p-2.5 rounded-xl transition ${
                        active ? 'bg-gradient-to-r from-indigo-50 to-violet-50 ring-1 ring-indigo-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                            : item.isAi
                              ? 'bg-purple-50 text-purple-600 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white'
                        }`}
                      >
                        <item.icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`flex items-center gap-1.5 text-[13px] font-bold ${active ? 'text-indigo-800' : 'text-slate-800'}`}>
                          <span className="truncate">{item.name}</span>
                          {showBadge && (
                            <span className="px-1.5 py-px rounded-full bg-rose-500 text-white text-[10px] font-bold">{pendingReviewsCount}</span>
                          )}
                          {item.isAi && (
                            <span className="px-1.5 py-px rounded-md bg-violet-100 text-violet-700 text-[9px] font-extrabold uppercase">Pro</span>
                          )}
                        </span>
                        <span className="block text-[11px] text-slate-500 truncate">{item.desc}</span>
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Command palette (Ctrl/⌘ + K)                                        */
/* ------------------------------------------------------------------ */

// Mounted only while open, so query/selection always start fresh.
function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? NAV_ITEMS.filter((i) => `${i.name} ${i.desc || ''}`.toLowerCase().includes(q)) : NAV_ITEMS;
  }, [query]);

  // Escape closes the palette wherever focus is; lock page scroll while open
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const go = (item) => {
    if (!item) return;
    navigate(item.path);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      go(results[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search pages">
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden animate-scale-up">
        <div className="flex items-center gap-3 px-4 border-b border-slate-100">
          <Search className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page…"
            className="flex-1 h-14 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none focus-visible:ring-0"
          />
          <kbd className="hidden sm:inline text-[10px] font-semibold text-slate-400 border border-slate-200 rounded-md px-1.5 py-0.5">ESC</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-xs text-slate-500">No pages match “{query}”.</li>}
          {results.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === active;
            return (
              <li key={item.path}>
                <button
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => go(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition ${
                    isActive ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-900' : 'text-slate-700'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                      isActive ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold truncate">{item.name}</span>
                    <span className="block text-[11px] text-slate-400 truncate">{item.desc}</span>
                  </span>
                  {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export default function Header() {
  const {
    businesses,
    selectedBusinessId,
    setSelectedBusinessId,
    selectedBusiness,
    dateRange,
    setDateRange,
    notifications,
    reviews,
  } = useBusiness();
  const { showToast } = useToast();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const currentPage = NAV_ITEMS.find((i) => isPathActive(i.path, pathname));

  const [businessMenuOpen, setBusinessMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [addBusinessModalOpen, setAddBusinessModalOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => new Set());

  const bizRef = useRef(null);
  const dateRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread && !readIds.has(n.id)).length;
  const pendingReviewsCount = reviews.filter((r) => r.replyStatus === 'Pending').length;
  const closeMobileNav = React.useCallback(() => setMobileNavOpen(false), []);
  const closePalette = React.useCallback(() => setPaletteOpen(false), []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bizRef.current && !bizRef.current.contains(e.target)) setBusinessMenuOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ctrl/⌘ + K opens the page switcher
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      // Escape closes any open header dropdown
      if (e.key === 'Escape') {
        setBusinessMenuOpen(false);
        setDateMenuOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll to top on page change (no sidebar to keep context, so start each page fresh)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const handleSelectBusiness = (id) => {
    setSelectedBusinessId(id);
    setBusinessMenuOpen(false);
    const biz = businesses.find((b) => b.id === id);
    showToast(`Switched active view to ${biz?.name || 'business'}`, 'info');
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
    showToast('All notifications marked as read', 'success');
  };

  const iconBtn =
    'relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/70 transition-colors active:scale-95';
  const lightBtn =
    'flex items-center gap-2 h-9 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors shadow-[0_1px_1px_rgba(15,23,42,0.03)] active:scale-[0.98]';

  return (
    <>
      {/* ===================== Top navigation bar ===================== */}
      <header className="sticky top-0 z-40 pt-safe bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="relative h-16 max-w-[1600px] mx-auto px-3 sm:px-6 flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className={`lg:hidden ${iconBtn}`}
            aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {!mobileNavOpen && pendingReviewsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Phones: inner screens show their title next to the logo, like an app bar */}
          {isHome ? (
            <BrandMark />
          ) : (
            <>
              <span className="sm:hidden">
                <BrandMark compact />
              </span>
              <span className="sm:hidden font-display text-[17px] font-bold text-slate-900 tracking-tight truncate min-w-0">
                {currentPage?.short || currentPage?.name}
              </span>
              <span className="hidden sm:block">
                <BrandMark />
              </span>
            </>
          )}

          <div className="hidden lg:block w-3" />

          <DesktopNav pendingReviewsCount={pendingReviewsCount} />

          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Search pages (Ctrl K)"
              className="hidden md:flex lg:hidden 2xl:flex items-center gap-2 w-60 2xl:w-72 h-9 pl-3 pr-2 rounded-lg bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 text-sm text-slate-400 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search pages…</span>
              <kbd className="font-mono text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-px">Ctrl K</kbd>
            </button>
            <button onClick={() => setPaletteOpen(true)} className={`${iconBtn} md:hidden lg:flex 2xl:hidden`} aria-label="Search pages">
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={iconBtn}
                title="Notifications"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div data-popover className={`${TOPBAR_DROPDOWN} sm:w-80 overflow-hidden`}>
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-violet-50/50">
                    <h4 className="text-xs font-bold text-slate-800">
                      Notifications {unreadCount > 0 && <span className="text-indigo-600">({unreadCount} new)</span>}
                    </h4>
                    <button
                      onClick={markAllRead}
                      disabled={unreadCount === 0}
                      className="text-[11px] text-indigo-600 font-semibold hover:underline disabled:text-slate-400 disabled:no-underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 && (
                      <div className="py-8 flex flex-col items-center gap-2 text-xs text-slate-400">
                        <BellOff className="w-5 h-5" /> You're all caught up
                      </div>
                    )}
                    {notifications.map((n) => {
                      const unread = n.unread && !readIds.has(n.id);
                      return (
                        <button
                          key={n.id}
                          onClick={() => setReadIds((prev) => new Set(prev).add(n.id))}
                          className={`w-full text-left p-3.5 hover:bg-slate-50 transition ${unread ? 'bg-indigo-50/30' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs leading-snug ${unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'}`}>{n.title}</span>
                            {unread && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="group flex items-center gap-1.5 pl-2 sm:pl-3 sm:border-l border-slate-200 transition"
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="relative">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-100 shadow-sm">
                    SG
                  </span>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-colors hidden sm:block" />
              </button>

              {profileOpen && (
                <div data-popover className={`${TOPBAR_DROPDOWN} sm:w-64 py-2`}>
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">Shivam Gupta</div>
                    <div className="text-[11px] text-slate-500 truncate">shivam.marketing@gmail.com</div>
                    <div className="mt-1.5 inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      SaaS Account Admin
                    </div>
                  </div>
                  <div className="p-1.5 text-xs text-slate-600">
                    <a href="#/settings" onClick={() => setProfileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-900">
                      Account & Profile
                    </a>
                    <a href="#/billing" onClick={() => setProfileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-900">
                      Billing & Invoices
                    </a>
                    <a href="#/integrations" onClick={() => setProfileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-900">
                      API & Integrations
                    </a>
                  </div>
                  <div className="px-2 pb-1.5">
                    <PlanCard variant="light" onNavigate={() => setProfileOpen(false)} />
                  </div>
                  <div className="px-1.5 pt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        showToast('Demo session active. Local storage remains preserved.', 'info');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                    >
                      Reset Demo State
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===================== Context sub-bar ===================== */}
      {/* Sits on the page canvas (no bar), like a page title row */}
      <div className="relative z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 sm:pt-5 pb-1 sm:pb-2 flex flex-col items-start lg:flex-row lg:items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className={`${isHome ? "" : "hidden lg:block "}font-display text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate`}>{getGreeting()}, Shivam 👋</h2>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                Live Sync
              </span>
            </div>
            <p className="hidden md:block text-sm text-slate-600 mt-0.5 truncate">
              Managing <strong className="text-slate-900 font-semibold">{selectedBusiness?.name}</strong> in {selectedBusiness?.city}, UP
            </p>
          </div>

          <div className="hidden 2xl:flex items-center min-w-0">
            <DemoNotice text="Simulated Local SaaS Prototype — Demo Data" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Date Range Selector */}
            <div className="relative hidden md:block" ref={dateRef}>
              <button
                onClick={() => setDateMenuOpen(!dateMenuOpen)}
                className={`${lightBtn} px-3`}
                aria-haspopup="menu"
                aria-expanded={dateMenuOpen}
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{DATE_LABELS[dateRange]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dateMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {dateMenuOpen && (
                <div data-popover className={`${SUBBAR_DROPDOWN} w-44 p-1.5`}>
                  {Object.entries(DATE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setDateRange(key);
                        setDateMenuOpen(false);
                        showToast(`Date range updated to ${label}`, 'info');
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs text-left flex items-center justify-between hover:bg-slate-50 transition ${
                        dateRange === key ? 'text-indigo-700 font-bold bg-indigo-50' : 'text-slate-700'
                      }`}
                    >
                      {label}
                      {dateRange === key && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Business Selector */}
            <div className="relative" ref={bizRef}>
              <button
                onClick={() => setBusinessMenuOpen(!businessMenuOpen)}
                className={`${lightBtn} pl-1.5 pr-2.5`}
                aria-haspopup="menu"
                aria-expanded={businessMenuOpen}
              >
                <span className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-xs">
                  {selectedBusiness?.logo || '📍'}
                </span>
                <span className="max-w-[110px] sm:max-w-[160px] truncate text-left text-slate-800">{selectedBusiness?.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${businessMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {businessMenuOpen && (
                <div data-popover className={`${SUBBAR_DROPDOWN} w-72 py-2`}>
                  <div className="px-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="eyebrow">Switch Business ({businesses.length})</span>
                    <button
                      onClick={() => {
                        setBusinessMenuOpen(false);
                        setAddBusinessModalOpen(true);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto p-1.5">
                    {businesses.map((biz) => {
                      const isSelected = biz.id === selectedBusinessId;
                      return (
                        <button
                          key={biz.id}
                          onClick={() => handleSelectBusiness(biz.id)}
                          className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between hover:bg-slate-50 transition ${
                            isSelected ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-900' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-8 h-8 rounded-lg bg-white ring-1 ring-slate-200 flex items-center justify-center text-base shrink-0">
                              {biz.logo || '📍'}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{biz.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {biz.city} • ★ {biz.rating} ({biz.totalReviews})
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 px-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setBusinessMenuOpen(false);
                        setAddBusinessModalOpen(true);
                      }}
                      className="btn-primary w-full py-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Register New Business
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileNav isOpen={mobileNavOpen} onClose={closeMobileNav} />
      {paletteOpen && <CommandPalette onClose={closePalette} />}
      <AddBusinessModal isOpen={addBusinessModalOpen} onClose={() => setAddBusinessModalOpen(false)} />
    </>
  );
}
