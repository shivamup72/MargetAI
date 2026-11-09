import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Target,
  Calendar,
  IndianRupee,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import CreateCampaignModal from '../components/modals/CreateCampaignModal';
import DemoNotice from '../components/common/DemoNotice';

export default function CampaignManager() {
  const { campaigns, selectedBusiness } = useBusiness();
  const { showToast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignList, setCampaignList] = useState(campaigns);

  // Sync if context campaigns update
  React.useEffect(() => {
    setCampaignList(campaigns);
  }, [campaigns]);

  const filteredCampaigns = campaignList.filter(camp => {
    const matchesSearch = camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || camp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleCampaignStatus = (id) => {
    setCampaignList(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
        showToast(`Campaign status changed to ${nextStatus}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const totalBudget = campaignList.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalSpent = campaignList.reduce((acc, c) => acc + (c.spent || 0), 0);
  const totalClicks = campaignList.reduce((acc, c) => acc + (c.clicks || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-indigo-600" />
            Marketing Campaign Manager
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Launch and monitor hyper-local advertising campaigns across Google Local Services, WhatsApp, and Instagram in {selectedBusiness?.city}.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      <DemoNotice text="Simulated Advertising Engine: Budgets in INR (₹) and lead attribution are simulated demo metrics." />

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Allocated Budget</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{totalBudget.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500">₹{totalSpent.toLocaleString('en-IN')} consumed across campaigns</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Ad Interactions</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{totalClicks.toLocaleString('en-IN')} Clicks</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Average CPC: ₹2.90</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average ROAS</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">4.2x Return</div>
          <span className="text-[11px] text-slate-500">Direct phone orders & dine-in attribution</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Active', 'Scheduled', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition shrink-0 ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Campaign & Channel</th>
                <th className="px-5 py-3">Target Catchment</th>
                <th className="px-5 py-3">Budget / Spent</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Impressions</th>
                <th className="px-5 py-3">Clicks / Actions</th>
                <th className="px-5 py-3">ROAS</th>
                <th className="px-5 py-3 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 text-sm leading-tight">{camp.name}</div>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-px rounded font-semibold mt-1 inline-block">
                      {camp.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs truncate">
                    {camp.targetAudience}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">₹{camp.budget.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">Spent: ₹{camp.spent.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      camp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : camp.status === 'Scheduled'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : camp.status === 'Paused'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {camp.impressions.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {camp.clicks} <span className="text-[10px] text-slate-400 font-normal">({camp.conversions} leads)</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-emerald-600">{camp.roas}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {camp.status !== 'Completed' ? (
                      <button
                        onClick={() => toggleCampaignStatus(camp.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          camp.status === 'Active'
                            ? 'text-amber-600 hover:bg-amber-50 border-amber-200'
                            : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                        }`}
                        title={camp.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                      >
                        {camp.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Finished</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
