import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Sparkline from './Sparkline';

/*
 * Executive KPI card. Each metric owns one hue, used only for its icon tile,
 * sparkline, caption and hover border. Full class strings so Tailwind's JIT sees them.
 */
const THEMES = {
  indigo: { chip: 'bg-indigo-50 text-indigo-600 border-indigo-100', line: 'text-indigo-600', note: 'text-indigo-600', hover: 'hover:border-indigo-300', active: 'border-indigo-300' },
  cyan: { chip: 'bg-cyan-50 text-cyan-600 border-cyan-100', line: 'text-cyan-600', note: 'text-cyan-700', hover: 'hover:border-cyan-300', active: 'border-cyan-300' },
  teal: { chip: 'bg-teal-50 text-teal-600 border-teal-100', line: 'text-teal-600', note: 'text-teal-700', hover: 'hover:border-teal-300', active: 'border-teal-300' },
  blue: { chip: 'bg-blue-50 text-blue-600 border-blue-100', line: 'text-blue-600', note: 'text-blue-700', hover: 'hover:border-blue-300', active: 'border-blue-300' },
  purple: { chip: 'bg-purple-50 text-purple-600 border-purple-100', line: 'text-purple-600', note: 'text-purple-700', hover: 'hover:border-purple-300', active: 'border-purple-300' },
  amber: { chip: 'bg-amber-50 text-amber-600 border-amber-200', line: 'text-amber-500', note: 'text-amber-700', hover: 'hover:border-amber-300', active: 'border-amber-300' },
};

/**
 * Props: `onClick` makes it interactive; `active` marks the metric shown in the trend chart;
 * `sparkData` draws the trend; `footer` replaces the sparkline; `note` is the caption under it.
 */
export default function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle = 'vs last month',
  icon: Icon,
  theme = 'indigo',
  sparkData,
  footer,
  note,
  active = false,
  onClick,
  suffix = '',
  prefix = '',
  style,
}) {
  const t = THEMES[theme] || THEMES.indigo;
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      style={style}
      className={`group relative w-full text-left overflow-hidden rounded-xl bg-white p-3.5 sm:p-4 border transition-all duration-200 ease-out shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_16px_-2px_rgba(15,23,42,0.08),0_2px_6px_-2px_rgba(15,23,42,0.04)] ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]' : ''
      } ${active ? t.active : `border-slate-200 ${t.hover}`}`}
    >
      {/* Top row: icon tile + growth chip */}
      <div className="flex items-center justify-between gap-2">
        {Icon && (
          <span className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${t.chip}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded border ${
              isPositive ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}%
          </span>
        )}
      </div>

      <div className="mt-3 min-w-0">
        <div className="text-xs text-slate-500 truncate">{title}</div>
        <div className="flex items-baseline gap-1.5 mt-0.5 min-w-0">
          <span className="font-display text-[22px] sm:text-2xl font-bold text-slate-900 tabular truncate leading-tight">
            {prefix}
            {value}
          </span>
          {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
        </div>
        <div className="hidden sm:block text-[10px] text-slate-400 mt-0.5">{subtitle}</div>
      </div>

      {(sparkData || footer || note) && (
        <div className="mt-3 pt-2 border-t border-slate-100">
          {footer || (sparkData && <div className={t.line}><Sparkline data={sparkData} height={28} /></div>)}
          {note && <div className={`text-[10px] font-medium mt-1 truncate ${t.note}`}>{note}</div>}
        </div>
      )}
    </Tag>
  );
}
