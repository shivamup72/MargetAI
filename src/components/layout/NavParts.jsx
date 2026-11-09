import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, ArrowUpRight } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

/** Brand mark used in the top navigation bar. */
export function BrandMark({ compact = false }) {
  return (
    <NavLink to="/" className="flex items-center gap-2.5 min-w-0 shrink-0" aria-label="LocalBoost AI home">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-black/5 shrink-0 font-display font-bold text-sm">
        LB
      </div>
      {!compact && (
        <div className="hidden min-[360px]:flex flex-col min-w-0">
          <span className="flex items-center gap-1.5 leading-none">
            <span className="font-display text-slate-900 text-lg font-bold tracking-tight">LocalBoost</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">AI</span>
          </span>
          <span className="text-[10px] text-slate-500 tracking-wider truncate mt-0.5">Local Marketing Cloud</span>
        </div>
      )}
    </NavLink>
  );
}

/** Plan / AI credits card. `variant="dark"` for the mobile menu, `"light"` for the profile dropdown. */
export function PlanCard({ onNavigate, variant = 'dark' }) {
  const { currentPlan } = useBusiness();
  const used = 182;
  const total = 250;
  const pct = Math.round((used / total) * 100);
  const dark = variant === 'dark';

  return (
    <div
      className={`relative p-3.5 rounded-2xl overflow-hidden ${
        dark
          ? 'bg-gradient-to-br from-indigo-500/25 via-violet-500/20 to-cyan-500/10 ring-1 ring-white/10'
          : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.25)]'
      }`}
    >
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-violet-400/30 blur-2xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-100 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            {currentPlan.toUpperCase()} PLAN
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
          </span>
        </div>
        <div className="flex items-baseline justify-between text-xs mb-1.5">
          <span className="text-indigo-100/80">AI credits</span>
          <span className="font-bold text-white tabular">
            {used}
            <span className="text-indigo-200/70 font-medium"> / {total}</span>
          </span>
        </div>
        <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-cyan-300 to-white/90 h-full rounded-full origin-left animate-grow-x"
            style={{ width: `${pct}%` }}
          />
        </div>
        <NavLink
          to="/billing"
          onClick={onNavigate}
          className="flex items-center justify-center gap-1 w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-indigo-50 transition active:scale-[0.98]"
        >
          Manage Plan
          <ArrowUpRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>
    </div>
  );
}
