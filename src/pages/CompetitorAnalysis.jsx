import React, { useState } from 'react';
import {
  Crosshair,
  Star,
  Plus,
  BarChart2,
  TrendingUp,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import AddCompetitorModal from '../components/modals/AddCompetitorModal';
import DemoNotice from '../components/common/DemoNotice';
import Modal from '../components/common/Modal';

export default function CompetitorAnalysis() {
  const { competitors, selectedBusiness } = useBusiness();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [swotModalComp, setSwotModalComp] = useState(null);

  const chartData = competitors.map(c => ({
    name: c.name.split(' ')[0],
    rating: c.rating,
    reviews: c.reviews,
    photos: c.photos,
    isUser: c.isUser
  }));

  // Keep the last analysed competitor so content stays visible while the modal animates closed
  const [lastSwotComp, setLastSwotComp] = useState(null);
  if (swotModalComp && swotModalComp !== lastSwotComp) setLastSwotComp(swotModalComp);
  const swotComp = swotModalComp || lastSwotComp;

  const handleRunAnalysis = (comp) => {
    setSwotModalComp(comp);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-indigo-600" />
            Local Competitor Intelligence & Radar
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Benchmark rating velocity, review response rates, and visual presence against local alternatives in {selectedBusiness?.city}.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </button>
      </div>

      <DemoNotice text="Simulated Competitor Intelligence: All metrics are estimated demo samples for competitive benchmarking." />

      {/* Head to Head Comparison Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold text-slate-400 uppercase">Local Market Position</div>
          <div className="text-xl font-bold text-indigo-600 mt-1">#1 in Category</div>
          <p className="text-xs text-slate-500 mt-1">
            You lead Awadh Zaika and Sagar Ratna in average review sentiment by +0.3★.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold text-slate-400 uppercase">Review Velocity Lead</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">+14 Reviews/mo</div>
          <p className="text-xs text-slate-500 mt-1">
            Your profile gathers reviews 2.4x faster than neighborhood average.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold text-slate-400 uppercase">Response Advantage</div>
          <div className="text-xl font-bold text-violet-600 mt-1">94% vs 63% Avg</div>
          <p className="text-xs text-slate-500 mt-1">
            Prompt AI responses signal greater credibility to prospective walk-ins.
          </p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
              Rating & Review Volume Comparison
            </h3>
            <p className="text-xs text-slate-500">Benchmark your location against competing local businesses</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600" /> Total Reviews
            </span>
            <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Photos Count
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
              <Bar dataKey="reviews" name="Total Reviews" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="photos" name="Photos" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitors Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Catchment Competitor Radar</h3>
            <p className="text-xs text-slate-500">Active competitor tracking in {selectedBusiness?.city}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Business Name</th>
                <th className="px-5 py-3">Google Rating</th>
                <th className="px-5 py-3">Total Reviews</th>
                <th className="px-5 py-3">Completeness</th>
                <th className="px-5 py-3">Photos</th>
                <th className="px-5 py-3">Response Rate</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competitors.map((comp) => (
                <tr
                  key={comp.id}
                  className={`hover:bg-slate-50/70 transition ${
                    comp.isUser ? 'bg-indigo-50/30 font-bold' : ''
                  }`}
                >
                  <td className="px-5 py-3.5 text-slate-900 flex items-center gap-2">
                    {comp.isUser && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{comp.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{comp.localRank}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-amber-500">★ {comp.rating}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">
                    {comp.reviews}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${comp.completeness}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">{comp.completeness}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {comp.photos} photos
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      comp.responseRate >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {comp.responseRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleRunAnalysis(comp)}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
                    >
                      <Sparkles className="w-3 h-3 text-violet-600" />
                      SWOT Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Competitor Modal */}
      <AddCompetitorModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Simulated AI SWOT Analysis Modal */}
      <Modal
          isOpen={!!swotModalComp}
          onClose={() => setSwotModalComp(null)}
          title={`AI Competitive Analysis: ${swotComp?.name || ''}`}
          subtitle={`Detailed local comparison for ${selectedBusiness?.city} market`}
          maxWidth="max-w-xl"
        >
          {swotComp && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-900 block mb-1">💪 Strengths</span>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  {swotComp.isUser
                    ? 'Dominant 4.6★ rating, fast AI review replies, and strong brand recall in Civil Lines.'
                    : `Established local customer base with ${swotComp.reviews} lifetime reviews and highway visibility.`}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="font-bold text-rose-900 block mb-1">⚠️ Weaknesses</span>
                <p className="text-rose-800 leading-relaxed text-[11px]">
                  {swotComp.isUser
                    ? 'Peak hour weekend table wait times during festival seasons.'
                    : `Low review reply rate of ${swotComp.responseRate}% and fewer updated food photos (${swotComp.photos}).`}
                </p>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <span className="font-bold text-indigo-900 block mb-1">🚀 Opportunities</span>
                <p className="text-indigo-800 leading-relaxed text-[11px]">
                  Launch WhatsApp review invitations after dine-in bills to capture 30+ extra 5-star ratings monthly.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="font-bold text-amber-900 block mb-1">🛡️ Threats</span>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  New regional food outlets expanding with discounted promotional thali combos.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSwotModalComp(null)}
                className="btn-primary w-full sm:w-auto"
              >
                Close Analysis
              </button>
            </div>
          </div>
          )}
        </Modal>
    </div>
  );
}
