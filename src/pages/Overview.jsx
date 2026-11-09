import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  MousePointerClick,
  PhoneCall,
  Navigation,
  Globe,
  Star,
  StarHalf,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  CheckCircle2,
  MessageSquare,
  Megaphone,
  FilePlus2,
  ScanSearch,
  BadgeCheck,
  AlertTriangle,
  Radar,
  ListChecks,
  Wand2,
  Activity,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import CreateSocialPostModal from '../components/modals/CreateSocialPostModal';
import CreateCampaignModal from '../components/modals/CreateCampaignModal';
import ConnectGoogleModal from '../components/modals/ConnectGoogleModal';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import { PERFORMANCE_CHART_DATA, RATING_DISTRIBUTION, AI_RECOMMENDATIONS } from '../data/mockData';

/* ------------------------------------------------------------------ */
/* Color system — one hue per metric, shared by KPI cards and charts  */
/* ------------------------------------------------------------------ */

const METRIC_COLORS = {
  views: '#4f46e5', // indigo-600
  actions: '#06b6d4', // cyan-500
  calls: '#14b8a6', // teal-500
  directions: '#2563eb', // blue-600
  website: '#a855f7', // purple-500
};

const DEFAULT_STATS = {
  profileViews: 12450,
  profileViewsGrowth: 18.2,
  customerActions: 1280,
  customerActionsGrowth: 12.4,
  phoneCalls: 342,
  phoneCallsGrowth: 8.7,
  directionRequests: 518,
  directionRequestsGrowth: 24.1,
  websiteClicks: 420,
  websiteClicksGrowth: 15.3,
};

// Trend chart views. `overview` = views line (left axis) over actions bars (right axis).
const CHART_VIEWS = {
  overview: {
    label: 'Views & Actions',
    series: [
      { key: 'views', name: 'Profile Views', axis: 'left', type: 'line' },
      { key: 'actions', name: 'Customer Actions', axis: 'right', type: 'bar' },
    ],
  },
  calls: { label: 'Calls', series: [{ key: 'calls', name: 'Phone Calls', axis: 'left' }] },
  directions: { label: 'Directions', series: [{ key: 'directions', name: 'Direction Requests', axis: 'left' }] },
  website: { label: 'Website', series: [{ key: 'website', name: 'Website Clicks', axis: 'left' }] },
};

const BREAKDOWN_SERIES = [
  { key: 'calls', name: 'Calls', text: 'text-teal-700' },
  { key: 'directions', name: 'Directions', text: 'text-blue-700' },
  { key: 'website', name: 'Website', text: 'text-purple-700' },
];

const RANGES = { '3M': 3, '6M': 6 };

// Health tiles: each gets its own gradient + value color, as in the design
const HEALTH_STYLES = [
  { bar: 'from-indigo-500 to-cyan-500', value: 'text-cyan-700' },
  { bar: 'from-purple-500 to-indigo-500', value: 'text-indigo-700' },
  { bar: 'from-teal-500 to-emerald-500', value: 'text-emerald-700' },
];

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');
const compact = (v) => (v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : v);

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5 shadow-xl text-xs min-w-[160px]">
      <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">{label} 2026</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3 text-white mt-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: METRIC_COLORS[p.dataKey] }} />
            {p.name}
          </span>
          <span className="font-bold tabular">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function Segmented({ options, value, onChange, ariaLabel, className = '' }) {
  return (
    <div className={`segmented max-w-full overflow-x-auto scrollbar-none ${className}`} role="tablist" aria-label={ariaLabel}>
      {options.map(([key, label]) => (
        <button
          key={key}
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={`segmented-item ${value === key ? 'segmented-item-active' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** Small score ring: indigo arc on a pale indigo disc. */
function HealthRing({ score }) {
  const r = 21;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, score)) / 100) * c;
  return (
    <div className="relative w-12 h-12 shrink-0 rounded-full bg-indigo-50/80 shadow-sm">
      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e0e7ff" strokeWidth="3" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-indigo-700 tabular">{score}</span>
    </div>
  );
}

function Stars({ rating, className = 'w-3.5 h-3.5' }) {
  const full = Math.floor(rating);
  const frac = rating - full;
  const half = frac >= 0.25 && frac < 0.75;
  const fullCount = frac >= 0.75 ? full + 1 : full;
  return (
    <span className="flex items-center gap-0.5 text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) =>
        s <= fullCount ? (
          <Star key={s} className={`${className} fill-current`} />
        ) : s === fullCount + 1 && half ? (
          <StarHalf key={s} className={`${className} fill-current`} />
        ) : (
          <Star key={s} className={`${className} text-slate-300`} />
        )
      )}
    </span>
  );
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="hidden sm:block text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Overview() {
  const navigate = useNavigate();
  const { selectedBusiness, reviews, tasks, toggleTask, generateAIReply } = useBusiness();
  const { showToast } = useToast();

  const [chartView, setChartView] = useState('overview');
  const [chartRange, setChartRange] = useState('6M');
  const [breakdownRange, setBreakdownRange] = useState('3M');
  const [hiddenBreakdown, setHiddenBreakdown] = useState(() => new Set());
  const [taskFilter, setTaskFilter] = useState('all');
  const [openModal, setOpenModal] = useState(null); // 'post' | 'campaign' | 'google'

  const stats = selectedBusiness?.stats || DEFAULT_STATS;
  const rating = selectedBusiness?.rating || 4.6;
  const totalReviews = selectedBusiness?.totalReviews || 218;

  /* Monthly trend scaled so the latest month matches the selected business's live stats.
     Switching business or using the live simulator therefore updates every chart. */
  const series = useMemo(() => {
    const last = PERFORMANCE_CHART_DATA[PERFORMANCE_CHART_DATA.length - 1];
    const lastWeb = last.actions - last.calls - last.directions;
    const scale = (v, current, base) => Math.max(0, Math.round(base ? (v * current) / base : v));
    return PERFORMANCE_CHART_DATA.map((row) => ({
      month: row.month,
      views: scale(row.views, stats.profileViews, last.views),
      actions: scale(row.actions, stats.customerActions, last.actions),
      calls: scale(row.calls, stats.phoneCalls, last.calls),
      directions: scale(row.directions, stats.directionRequests, last.directions),
      website: scale(row.actions - row.calls - row.directions, stats.websiteClicks, lastWeb),
    }));
  }, [stats]);

  const spark = (key) => series.map((d) => d[key]);
  const trendData = series.slice(-RANGES[chartRange]);
  const breakdownData = series.slice(-RANGES[breakdownRange]);

  // Summary for the primary series of the current chart view
  const primary = CHART_VIEWS[chartView].series[0];
  const firstVal = trendData[0]?.[primary.key] || 0;
  const lastVal = trendData[trendData.length - 1]?.[primary.key] || 0;
  const rangeGrowth = firstVal ? ((lastVal - firstVal) / firstVal) * 100 : 0;
  const rangeTotal = trendData.reduce((s, d) => s + d[primary.key], 0);
  const peak = trendData.reduce((best, d) => (d[primary.key] > (best?.[primary.key] ?? -1) ? d : best), null);

  // Latest month's interaction mix
  const latest = series[series.length - 1];
  const mixTotal = latest.calls + latest.directions + latest.website || 1;

  // Local health score from the business's own quality signals
  const healthParts = [
    { label: 'Local SEO', short: 'SEO', value: selectedBusiness?.seoScore ?? 80, path: '/local-seo' },
    {
      label: 'Profile Completeness',
      short: 'Profile',
      value: selectedBusiness?.profileCompletionScore ?? selectedBusiness?.completionPercentage ?? 80,
      path: '/google-business',
    },
    { label: 'Responses', short: 'Replies', value: selectedBusiness?.responseRate ?? 80, path: '/reviews' },
  ];
  const healthScore = Math.round(
    (healthParts.reduce((s, p) => s + p.value, 0) + (rating / 5) * 100) / (healthParts.length + 1)
  );
  const healthGrade = healthScore >= 85 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Needs work';
  const reputationNote = rating >= 4.5 ? 'Excellent reputation' : rating >= 4 ? 'Good reputation' : 'Needs attention';

  const recentReviews = reviews.slice(0, 3);
  const pendingReviews = reviews.filter((r) => r.replyStatus === 'Pending').length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const openTasks = tasks.length - completedTasks;
  const taskProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const visibleTasks = tasks.filter((t) => (taskFilter === 'open' ? !t.completed : taskFilter === 'done' ? t.completed : true));

  const handleQuickReply = (reviewId) => {
    generateAIReply(reviewId);
    showToast('AI draft generated for customer review!', 'success');
    navigate('/reviews');
  };

  const selectChart = (view) => {
    setChartView(view);
    document.getElementById('performance-chart')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const toggleBreakdown = (key) => {
    setHiddenBreakdown((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < BREAKDOWN_SERIES.length - 1) next.add(key); // keep at least one visible
      return next;
    });
  };

  const quickActions = [
    { label: 'Create Post', desc: 'Publish to all channels', icon: FilePlus2, tone: 'indigo', onClick: () => setOpenModal('post') },
    { label: 'AI Content', desc: 'Captions, offers & posts', icon: Wand2, tone: 'purple', onClick: () => navigate('/ai-studio') },
    { label: 'Campaign', desc: 'Launch Google local ads', icon: Megaphone, tone: 'cyan', onClick: () => setOpenModal('campaign') },
    {
      label: 'Reviews',
      desc: pendingReviews ? `${pendingReviews} awaiting reply` : 'All caught up',
      icon: MessageSquare,
      tone: 'rose',
      badge: pendingReviews || null,
      onClick: () => navigate('/reviews'),
    },
    { label: 'Keywords', desc: 'Local rank tracking', icon: ScanSearch, tone: 'emerald', onClick: () => navigate('/local-seo') },
    { label: 'Competitors', desc: 'Benchmark nearby rivals', icon: Radar, tone: 'amber', onClick: () => navigate('/competitors') },
  ];

  // Full class strings for Tailwind JIT
  const TONES = {
    indigo: { chip: 'bg-indigo-50 text-indigo-600 border-indigo-100', hover: 'hover:border-indigo-300 hover:bg-indigo-50/20', arrow: 'group-hover:text-indigo-600' },
    purple: { chip: 'bg-purple-50 text-purple-600 border-purple-100', hover: 'hover:border-purple-300 hover:bg-purple-50/20', arrow: 'group-hover:text-purple-600' },
    cyan: { chip: 'bg-cyan-50 text-cyan-600 border-cyan-100', hover: 'hover:border-cyan-300 hover:bg-cyan-50/20', arrow: 'group-hover:text-cyan-600' },
    rose: { chip: 'bg-rose-50 text-rose-600 border-rose-100', hover: 'hover:border-rose-300 hover:bg-rose-50/20', arrow: 'group-hover:text-rose-600' },
    emerald: { chip: 'bg-emerald-50 text-emerald-600 border-emerald-100', hover: 'hover:border-emerald-300 hover:bg-emerald-50/20', arrow: 'group-hover:text-emerald-600' },
    amber: { chip: 'bg-amber-50 text-amber-600 border-amber-200', hover: 'hover:border-amber-300 hover:bg-amber-50/20', arrow: 'group-hover:text-amber-600' },
  };

  const kpis = [
    { title: 'Profile Views', value: fmt(stats.profileViews), change: stats.profileViewsGrowth, icon: Eye, theme: 'indigo', spark: 'views', view: 'overview', note: 'Search & Maps reach' },
    { title: 'Customer Actions', value: fmt(stats.customerActions), change: stats.customerActionsGrowth, icon: MousePointerClick, theme: 'cyan', spark: 'actions', view: 'overview', note: 'Calls, routes & clicks' },
    { title: 'Phone Calls', value: fmt(stats.phoneCalls), change: stats.phoneCallsGrowth, icon: PhoneCall, theme: 'teal', spark: 'calls', view: 'calls', note: 'Direct inquiries' },
    { title: 'Direction Requests', value: fmt(stats.directionRequests), change: stats.directionRequestsGrowth, icon: Navigation, theme: 'blue', spark: 'directions', view: 'directions', note: 'Visit intent' },
    { title: 'Website Clicks', value: fmt(stats.websiteClicks), change: stats.websiteClicksGrowth, icon: Globe, theme: 'purple', spark: 'website', view: 'website', note: 'Online visits' },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 stagger">
      {/* ======================= HERO BUSINESS CARD ======================= */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white via-indigo-50/25 to-white border border-slate-200 shadow-sm p-4 sm:p-6 md:p-7">
        <div className="hairline-top absolute top-0 inset-x-0 h-[2px]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          {/* Identity & badges */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-amber-100 via-orange-50 to-indigo-50 border border-amber-200/80 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              {selectedBusiness?.logo}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] tracking-wider uppercase text-indigo-700 font-bold sm:mb-1">Business Dashboard</div>
              <h1 className="text-slate-900 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">{selectedBusiness?.name}</h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 truncate">
                {selectedBusiness?.category} • {selectedBusiness?.city}, Uttar Pradesh
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 flex-wrap">
                {selectedBusiness?.googleConnected ? (
                  <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] sm:text-xs font-medium">
                    <BadgeCheck className="w-3.5 h-3.5 text-cyan-600" />
                    Google Profile connected
                  </span>
                ) : (
                  <button
                    onClick={() => setOpenModal('google')}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] sm:text-xs font-medium hover:bg-amber-100 transition-colors active:scale-95"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Connect Google Profile
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] sm:text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Simulated demo data
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 shrink-0">
            <button onClick={() => navigate('/reviews')} className="btn-outline">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span className="sm:hidden">Reviews</span>
              <span className="hidden sm:inline">Manage Reviews</span>
              {pendingReviews > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">{pendingReviews}</span>
              )}
            </button>
            <button onClick={() => navigate('/ai-studio')} className="btn-primary">
              <Sparkles className="w-4 h-4" />
              <span className="sm:hidden">AI Studio</span>
              <span className="hidden sm:inline">AI Content Studio</span>
            </button>
          </div>
        </div>

        {/* Local health telemetry */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-200 grid grid-cols-[auto_repeat(3,minmax(0,1fr))] sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 items-center">
          <div className="flex items-center gap-3.5 pr-1 sm:pr-0">
            <HealthRing score={healthScore} />
            <div className="hidden sm:block">
              <div className="text-xs text-slate-500">Local Health</div>
              <div className="text-slate-900 font-bold text-sm">{healthGrade}</div>
            </div>
          </div>
          {healthParts.map((p, i) => (
            <button
              key={p.label}
              onClick={() => navigate(p.path)}
              className="group relative text-left min-w-0 bg-slate-50/80 hover:bg-white rounded-lg p-2 sm:p-2.5 border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between gap-1 text-[11px] sm:text-xs mb-1.5">
                <span className="text-slate-600 font-medium truncate">
                  <span className="sm:hidden">{p.short}</span>
                  <span className="hidden sm:inline">{p.label}</span>
                </span>
                <span className={`font-bold tabular ${HEALTH_STYLES[i].value}`}>{p.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r origin-left animate-grow-x ${HEALTH_STYLES[i].bar}`} style={{ width: `${p.value}%` }} />
              </div>
              <span className="hidden lg:group-hover:block absolute -top-8 right-2 bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap animate-fade-in">
                Open {p.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ======================= KPI GRID ======================= */}
      <section aria-label="Key metrics">
        <SectionHeading
          title="Performance at a glance"
          subtitle="Select a metric to explore its trend below"
          action={
            <button onClick={() => navigate('/analytics')} className="text-xs text-indigo-600 font-semibold hover:underline shrink-0 py-1">
              Compare Periods
            </button>
          }
        />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
          {kpis.map((k) => (
            <MetricCard
              key={k.title}
              title={k.title}
              value={k.value}
              change={k.change}
              isPositive={k.change >= 0}
              icon={k.icon}
              theme={k.theme}
              sparkData={spark(k.spark)}
              active={chartView === k.view}
              onClick={() => selectChart(k.view)}
              note={chartView === k.view ? 'Showing in chart' : k.note}
            />
          ))}
          <MetricCard
            title="Average Rating"
            value={`${rating}`}
            suffix={`(${fmt(totalReviews)})`}
            change={4.2}
            isPositive
            subtitle="ratings score"
            icon={Star}
            theme="amber"
            onClick={() => navigate('/reviews')}
            note={reputationNote}
            footer={
              <div className="h-7 flex items-center">
                <Stars rating={rating} className="w-4 h-4" />
              </div>
            }
          />
        </div>
      </section>

      {/* ======================= QUICK ACTIONS ======================= */}
      <section aria-label="Quick actions">
        <SectionHeading title="Quick actions" subtitle="Jump straight into your most common growth tasks" />
        {/* Phones: compact app-style shortcut rail; sm+: card grid */}
        <div className="-mx-4 px-4 flex gap-2.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-1 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-3 sm:overflow-visible">
          {quickActions.map((a) => {
            const Icon = a.icon;
            const tone = TONES[a.tone];
            return (
              <button
                key={a.label}
                onClick={a.onClick}
                className={`group relative snap-start shrink-0 w-[108px] sm:w-auto p-3 sm:p-3.5 rounded-xl text-left bg-white border border-slate-200 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] hover:shadow-[0_4px_16px_-2px_rgba(15,23,42,0.08)] flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] ${tone.hover}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`relative w-9 h-9 rounded-lg border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${tone.chip}`}>
                    <Icon className="w-[18px] h-[18px]" />
                    {a.badge && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                        {a.badge}
                      </span>
                    )}
                  </span>
                  <ArrowUpRight className={`w-4 h-4 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${tone.arrow}`} />
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="text-slate-900 text-[13px] sm:text-sm font-semibold">{a.label}</div>
                  <div className="text-[11px] text-slate-500 truncate">{a.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ======================= CHARTS (8 / 4) ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Search & Maps Performance */}
        <section className="card lg:col-span-8 p-4 sm:p-6 flex flex-col min-w-0">
          <div id="performance-chart" />
          <div className="card-header">
            <div className="flex items-center gap-3 min-w-0">
              <span className="icon-chip">
                <Activity className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <h4 className="card-title">Search &amp; Maps Performance</h4>
                <p className="card-subtitle truncate">
                  {chartView === 'overview' ? 'Profile views vs customer engagements' : `Monthly ${primary.name.toLowerCase()}`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Segmented
                ariaLabel="Chart metric"
                options={Object.entries(CHART_VIEWS).map(([k, v]) => [
                  k,
                  k === 'overview' ? (
                    <>
                      <span className="sm:hidden">Overview</span>
                      <span className="hidden sm:inline">{v.label}</span>
                    </>
                  ) : (
                    v.label
                  ),
                ])}
                value={chartView}
                onChange={setChartView}
                className="w-full sm:w-auto"
              />
              <Segmented ariaLabel="Chart range" options={Object.keys(RANGES).map((k) => [k, k])} value={chartRange} onChange={setChartRange} className="shrink-0" />
            </div>
          </div>

          {/* Summary metric row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 my-4 sm:my-5 pt-3 border-t border-slate-100">
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500">Total ({chartRange})</div>
              <div className="font-display text-lg sm:text-2xl font-bold text-slate-900 mt-0.5 tabular truncate">{fmt(rangeTotal)}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500">Growth</div>
              <div className={`font-display text-lg sm:text-2xl font-bold mt-0.5 flex items-center gap-1 tabular ${rangeGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {rangeGrowth >= 0 ? <ArrowUpRight className="w-4 h-4 shrink-0" /> : <ArrowDownRight className="w-4 h-4 shrink-0" />}
                {Math.abs(rangeGrowth).toFixed(1)}%
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500">Peak month</div>
              <div className="font-display text-lg sm:text-2xl font-bold text-slate-900 mt-0.5 truncate">
                {peak?.month} <span className="text-xs font-normal text-slate-500 tabular hidden sm:inline">{fmt(peak?.[primary.key])}</span>
              </div>
            </div>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 8, right: chartView === 'overview' ? 0 : 6, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                  <linearGradient id="barCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#cffafe" stopOpacity={1} />
                  </linearGradient>
                  {Object.entries(METRIC_COLORS).map(([key, color]) => (
                    <linearGradient key={key} id={`area-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} dy={6} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} fontFamily="ui-monospace, monospace" tickLine={false} axisLine={false} width={44} tickFormatter={compact} />
                {chartView === 'overview' && (
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} fontFamily="ui-monospace, monospace" tickLine={false} axisLine={false} width={36} tickFormatter={compact} />
                )}
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={chartView === 'overview' ? { fill: 'rgba(99,102,241,0.05)' } : { stroke: '#c7d2fe', strokeDasharray: '4 4' }}
                />
                {CHART_VIEWS[chartView].series.map((s) => {
                  if (s.type === 'bar') {
                    return (
                      <Bar
                        key={`${chartView}-${s.key}`}
                        yAxisId={s.axis}
                        dataKey={s.key}
                        name={s.name}
                        fill="url(#barCyan)"
                        activeBar={{ fill: '#06b6d4' }}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                        animationDuration={700}
                      />
                    );
                  }
                  if (s.type === 'line') {
                    return (
                      <Line
                        key={`${chartView}-${s.key}`}
                        yAxisId={s.axis}
                        type="monotone"
                        dataKey={s.key}
                        name={s.name}
                        stroke="url(#lineGlow)"
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 2.5, stroke: '#fff', fill: METRIC_COLORS[s.key] }}
                        animationDuration={900}
                      />
                    );
                  }
                  return (
                    <Area
                      key={`${chartView}-${s.key}`}
                      yAxisId={s.axis}
                      type="monotone"
                      dataKey={s.key}
                      name={s.name}
                      stroke={METRIC_COLORS[s.key]}
                      strokeWidth={3}
                      fill={`url(#area-${s.key})`}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2.5, stroke: '#fff', fill: METRIC_COLORS[s.key] }}
                      animationDuration={900}
                    />
                  );
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {CHART_VIEWS[chartView].series.map((s) => (
                <span key={s.key} className="flex items-center gap-1.5 font-medium text-slate-700">
                  {s.type === 'bar' ? (
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: METRIC_COLORS[s.key] }} />
                  ) : (
                    <span className="w-3 h-1 rounded" style={{ background: METRIC_COLORS[s.key] }} />
                  )}
                  {s.name}
                  {chartView === 'overview' && <span className="text-slate-500 font-normal">({s.axis} axis)</span>}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-slate-400">Simulated Google Business Profile data</span>
          </div>
        </section>

        {/* Interaction Breakdown */}
        <section className="card lg:col-span-4 p-4 sm:p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="icon-chip w-8 h-8 bg-cyan-50 text-cyan-600 border-cyan-100">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="card-title">Interaction Breakdown</h4>
                  <p className="card-subtitle truncate">Calls vs Directions vs Website</p>
                </div>
              </div>
              <Segmented ariaLabel="Breakdown range" options={Object.keys(RANGES).map((k) => [k, k])} value={breakdownRange} onChange={setBreakdownRange} className="text-[11px] shrink-0" />
            </div>

            <div className="h-48 w-full mt-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barGap={6} barCategoryGap="28%">
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} dy={6} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontFamily="ui-monospace, monospace" tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  {BREAKDOWN_SERIES.filter((s) => !hiddenBreakdown.has(s.key)).map((s) => (
                    <Bar key={s.key} dataKey={s.key} name={s.name} fill={METRIC_COLORS[s.key]} radius={[4, 4, 0, 0]} maxBarSize={14} animationDuration={700} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Color tags (click to show / hide a series) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs text-slate-600 pt-2 font-medium">
              {BREAKDOWN_SERIES.map((s) => {
                const hidden = hiddenBreakdown.has(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleBreakdown(s.key)}
                    aria-pressed={!hidden}
                    title={hidden ? `Show ${s.name}` : `Hide ${s.name}`}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 transition active:scale-95 ${hidden ? 'text-slate-400 line-through' : ''}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-sm ${hidden ? 'opacity-30' : ''}`} style={{ background: METRIC_COLORS[s.key] }} />
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Latest-month mix strip */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-semibold tracking-wider uppercase">{latest.month} Mix</span>
              <span className="text-slate-900 font-bold tabular">{fmt(mixTotal)} total</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              {BREAKDOWN_SERIES.map((s) => (
                <div
                  key={s.key}
                  className="h-full transition-all duration-700"
                  style={{ width: `${(latest[s.key] / mixTotal) * 100}%`, background: METRIC_COLORS[s.key] }}
                  title={`${s.name}: ${fmt(latest[s.key])}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              {BREAKDOWN_SERIES.map((s) => (
                <div key={s.key}>
                  <div className={`text-[10px] font-medium ${s.text}`}>● {s.name}</div>
                  <div className="text-slate-900 font-bold text-sm tabular">{Math.round((latest[s.key] / mixTotal) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ======================= INTELLIGENCE & OPERATIONS (4 / 4 / 4) ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Rating Distribution & Feedback */}
        <section className="card lg:col-span-4 p-4 sm:p-5 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="min-w-0">
              <h4 className="card-title">Rating Distribution</h4>
              <p className="card-subtitle">{fmt(totalReviews)} total customer ratings</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-2xl font-bold text-slate-900 leading-none tabular">{rating}</div>
              <div className="mt-1">
                <Stars rating={rating} className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 my-3.5">
            {RATING_DISTRIBUTION.map((item, idx) => (
              <div key={item.stars} className="group flex items-center gap-2 text-xs" title={`${item.count} reviews`}>
                <span className="w-12 text-slate-500 shrink-0">{item.stars}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 group-hover:bg-amber-500 h-full rounded-full origin-left animate-grow-x transition-colors"
                    style={{ width: `${item.percentage}%`, animationDelay: `${idx * 70}ms` }}
                  />
                </div>
                <span className="w-16 text-right text-slate-700 font-mono text-[11px] font-semibold">
                  <span className="group-hover:hidden">{item.percentage}%</span>
                  <span className="hidden group-hover:inline">{item.count} rev.</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="eyebrow">Recent Feedback</span>
              <button onClick={() => navigate('/reviews')} className="group text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 py-1">
                View all <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentReviews.map((rev) => {
                const pending = rev.replyStatus === 'Pending';
                const critical = pending && rev.rating <= 2;
                return (
                  <div
                    key={rev.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      critical ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${
                            critical ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {rev.author?.charAt(0)}
                        </span>
                        <span className="min-w-0 truncate">
                          <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                          <span className="text-[10px] text-slate-500 ml-1.5">• {rev.date}</span>
                        </span>
                      </div>
                      <span className={`flex items-center text-xs shrink-0 ${rev.rating >= 3 ? 'text-amber-500' : 'text-rose-500'}`}>
                        <Star className="w-3 h-3 fill-current" />
                        <span className={`font-bold text-[11px] ml-0.5 ${rev.rating >= 3 ? 'text-slate-800' : 'text-rose-700'}`}>{rev.rating}.0</span>
                      </span>
                    </div>
                    <p className={`text-xs mt-1.5 line-clamp-2 ${critical ? 'text-slate-700' : 'text-slate-600'}`}>“{rev.text}”</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      {pending ? (
                        <>
                          <span className={`text-[10px] font-semibold flex items-center gap-1 ${critical ? 'text-rose-700' : 'text-amber-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${critical ? 'bg-rose-500' : 'bg-amber-500'}`} /> Awaiting Response
                          </span>
                          <button
                            onClick={() => handleQuickReply(rev.id)}
                            className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium flex items-center gap-1 shadow-sm transition-colors active:scale-95"
                          >
                            <Sparkles className="w-3 h-3" /> AI Reply
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {rev.replyStatus}
                          </span>
                          <span className="text-[11px] text-slate-400">Google Review</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Marketing Tasks */}
        <section className="card lg:col-span-4 p-4 sm:p-5 flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="icon-chip w-8 h-8">
                <ListChecks className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h4 className="card-title">Marketing Tasks</h4>
                <p className="card-subtitle truncate">Local SEO &amp; Reputation action items</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold shrink-0">{openTasks} open</span>
          </div>

          <div className="my-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-600 font-medium">
                {completedTasks} of {tasks.length} completed
              </span>
              <span className="text-indigo-600 font-bold tabular">{taskProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${taskProgress}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-3 text-xs" role="tablist" aria-label="Filter tasks">
            {[
              ['all', `All ${tasks.length}`],
              ['open', `Open ${openTasks}`],
              ['done', `Done ${completedTasks}`],
            ].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={taskFilter === key}
                onClick={() => setTaskFilter(key)}
                className={`px-2.5 py-1 rounded-md transition-colors active:scale-95 ${
                  taskFilter === key ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 flex-1">
            {visibleTasks.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">{taskFilter === 'open' ? '🎉 All tasks completed!' : 'No tasks here yet.'}</div>
            )}
            {visibleTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                aria-pressed={task.completed}
                className="group w-full text-left p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all flex items-start gap-3 active:scale-[0.99]"
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 group-hover:border-indigo-400'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 animate-scale-up" strokeWidth={3} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-semibold leading-snug transition-colors ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">{task.category}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        task.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : task.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-center">
            <button
              onClick={() => showToast('All tasks updated in local storage', 'info')}
              className="text-[11px] text-slate-400 hover:text-indigo-600 font-medium transition py-1"
            >
              Tap any task to toggle complete / incomplete
            </button>
          </div>
        </section>

        {/* AI Growth Recommendations */}
        <section className="card relative overflow-hidden md:col-span-2 lg:col-span-4 p-4 sm:p-5 flex flex-col min-w-0">
          <div className="hairline-top absolute top-0 inset-x-0 h-[2px]" />
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h4 className="card-title">AI Growth Recommendations</h4>
                <p className="card-subtitle truncate">Algorithmic local boost triggers</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-medium shrink-0">{AI_RECOMMENDATIONS.length} new</span>
          </div>

          <div className="grid gap-2.5 md:grid-cols-3 lg:grid-cols-1 mt-4 flex-1">
            {AI_RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.id}
                className="group flex flex-col p-3.5 rounded-lg border border-slate-200 bg-gradient-to-br from-white to-indigo-50/40 hover:border-indigo-300 transition-colors duration-200"
              >
                <span className="self-start text-[10px] font-bold uppercase tracking-wide text-cyan-800 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded mb-2">
                  {rec.impact}
                </span>
                <h5 className="font-display text-sm font-semibold text-slate-900 leading-snug">{rec.title}</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed flex-1">{rec.desc}</p>
                <button
                  onClick={() => navigate(rec.module)}
                  className="mt-3 self-start inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {rec.actionLabel}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Powered by LocalBoost AI</span>
            <span className="font-semibold text-indigo-600">Updated Daily</span>
          </div>
        </section>
      </div>

      {/* Modals launched from quick actions */}
      <CreateSocialPostModal isOpen={openModal === 'post'} onClose={() => setOpenModal(null)} />
      <CreateCampaignModal isOpen={openModal === 'campaign'} onClose={() => setOpenModal(null)} />
      <ConnectGoogleModal isOpen={openModal === 'google'} onClose={() => setOpenModal(null)} businessId={selectedBusiness?.id} />
    </div>
  );
}
