import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Eye,
  PhoneCall,
  Navigation,
  Globe,
  Star,
  Users,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import DemoNotice from '../components/common/DemoNotice';
import { PERFORMANCE_CHART_DATA } from '../data/mockData';

export default function AnalyticsReports() {
  const { selectedBusiness, dateRange, setDateRange } = useBusiness();
  const { showToast } = useToast();

  const [metricTab, setMetricTab] = useState('views'); // 'views' | 'actions' | 'rating'

  const ratingTrendData = [
    { month: 'Jun', rating: 4.4, reviews: 180 },
    { month: 'Jul', rating: 4.5, reviews: 192 },
    { month: 'Aug', rating: 4.5, reviews: 201 },
    { month: 'Sep', rating: 4.6, reviews: 210 },
    { month: 'Oct', rating: 4.6, reviews: 218 },
  ];

  const handleExportCSV = () => {
    // Generate actual client-side CSV download
    const headers = ['Month', 'Profile Views', 'Customer Actions', 'Phone Calls', 'Direction Requests'];
    const rows = PERFORMANCE_CHART_DATA.map(d => [d.month, d.views, d.actions, d.calls, d.directions]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedBusiness?.name.replace(/\s+/g, '_')}_LocalBoost_Analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics CSV report downloaded to your device!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Local Analytics & Reporting Hub
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Audit customer discovery trends, search terms, and footfall drivers for <strong>{selectedBusiness?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range picker */}
          <div className="flex bg-white rounded-xl border border-slate-200 p-0.5 text-xs font-semibold text-slate-600">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  dateRange === range ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-50'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition border border-indigo-200 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <DemoNotice text="Simulated Search Analytics: Footfall attribution and calls are benchmarked from Google Business Profile insights." />

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Views Trend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Search & Maps Discovery Views</h3>
              <p className="text-xs text-slate-500">6-Month organic customer discovery volume</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +18.2% Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="views" name="Profile Views" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Actions Conversion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Direct Local Intent Actions</h3>
              <p className="text-xs text-slate-500">High-intent actions leading directly to sales</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              1,280 Total Actions
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="calls" name="Phone Calls" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="directions" name="Directions" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Review Velocity and Rating Stability */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Rating Stability & Cumulative Review Growth</h3>
            <p className="text-xs text-slate-500">Tracking quality perception since June 2026</p>
          </div>
          <span className="text-xs font-bold text-amber-500">★ {selectedBusiness?.rating} Current Rating</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" domain={[4.0, 5.0]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px'
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="rating" name="Rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="reviews" name="Total Reviews" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

