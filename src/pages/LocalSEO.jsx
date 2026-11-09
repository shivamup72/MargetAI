import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  CheckCircle2,
  Sparkles,
  Plus,
  Check,
  Target,
  Zap
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import DemoNotice from '../components/common/DemoNotice';
import Modal from '../components/common/Modal';

export default function LocalSEO() {
  const { selectedBusiness, keywords, addKeyword } = useBusiness();
  const { showToast } = useToast();

  const [searchFilter, setSearchFilter] = useState('');
  const [addKeywordModalOpen, setAddKeywordModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    searchVolume: 1000,
    ranking: 5,
    competition: 'Medium',
    change: '+1',
    intent: 'Local Commercial'
  });

  const [appliedSuggestions, setAppliedSuggestions] = useState({});

  const seoSuggestions = [
    {
      id: 'sugg-1',
      title: 'Optimize Menu for "Special Paneer Butter Masala"',
      desc: 'Users searching for authentic paneer in Pratapgarh increased by 28%. Adding it to your Google Services increases ranking relevance.',
      impact: '+12% Search Visibility',
      category: 'Keyword Inclusion'
    },
    {
      id: 'sugg-2',
      title: 'Expand Google Description with Local Landmarks',
      desc: 'Mentioning "Near Old Bus Stand" and "Civil Lines Pratapgarh" reinforces geo-coordinates for nearby navigation queries.',
      impact: '+4 Ranking Positions',
      category: 'Geo-relevance'
    },
    {
      id: 'sugg-3',
      title: 'Maintain 95%+ Review Response Rate',
      desc: 'Responding to all reviews within 24 hours signals an active, authoritative business profile to Google local algorithms.',
      impact: 'Algorithmic Trust Boost',
      category: 'Reputation SEO'
    }
  ];

  const handleApplySuggestion = (suggId) => {
    setAppliedSuggestions(prev => ({ ...prev, [suggId]: true }));
    showToast('AI Local SEO suggestion applied to business metadata!', 'success');
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (!newKeyword.keyword.trim()) return;

    addKeyword({
      keyword: newKeyword.keyword,
      searchVolume: parseInt(newKeyword.searchVolume, 10),
      ranking: parseInt(newKeyword.ranking, 10),
      competition: newKeyword.competition,
      change: newKeyword.change,
      intent: newKeyword.intent
    });

    showToast(`Keyword "${newKeyword.keyword}" added to Local SEO tracking!`, 'success');
    setAddKeywordModalOpen(false);
    setNewKeyword({
      keyword: '',
      searchVolume: 1000,
      ranking: 5,
      competition: 'Medium',
      change: '+1',
      intent: 'Local Commercial'
    });
  };

  const filteredKeywords = keywords.filter(k =>
    k.keyword.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Local SEO & Search Ranking Optimizer
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Monitor Google Maps 3-pack rankings, local search queries, and high-converting keywords in {selectedBusiness?.city}.
          </p>
        </div>

        <button
          onClick={() => setAddKeywordModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Track New Keyword
        </button>
      </div>

      <DemoNotice text="Simulated Local SEO Metrics: Rankings and search volumes are based on realistic local benchmarks." />

      {/* SEO Health Scores Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Local SEO Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600 stroke-current"
                strokeWidth="3.5"
                strokeDasharray={`${selectedBusiness?.seoScore || 88}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-bold text-slate-800">
              {selectedBusiness?.seoScore || 88}%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">SEO Health Score</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">Top 5% in {selectedBusiness?.city}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">High Visibility</span>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Profile Completion
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-2">
            {selectedBusiness?.profileCompletionScore || 92}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${selectedBusiness?.profileCompletionScore || 92}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">All core NAP fields verified</span>
        </div>

        {/* Description Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Description Status
          </div>
          <div className="text-base font-bold text-slate-900 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Optimized (650/750)
          </div>
          <p className="text-[11px] text-slate-500">
            Contains 6 primary keywords & civil lines landmark tags.
          </p>
        </div>

        {/* Response Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Review Response Rate
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {selectedBusiness?.responseRate || 94}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            ✓ Exceeds 90% benchmark
          </span>
        </div>
      </div>

      {/* Keyword Tracking Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
              Tracked Local Keywords ({keywords.length})
            </h3>
            <p className="text-xs text-slate-500">
              Google Maps & Search rankings in {selectedBusiness?.city} catchment
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Keyword Query</th>
                <th className="px-5 py-3">Monthly Searches</th>
                <th className="px-5 py-3">Google Rank</th>
                <th className="px-5 py-3">Competition</th>
                <th className="px-5 py-3">30D Trend</th>
                <th className="px-5 py-3">Intent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKeywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {kw.keyword}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">
                    {kw.searchVolume.toLocaleString('en-IN')} /mo
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                      kw.ranking <= 3 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      #{kw.ranking}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      kw.competition === 'Low'
                        ? 'bg-emerald-50 text-emerald-700'
                        : kw.competition === 'Medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {kw.competition}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold">
                    <span className={kw.change.startsWith('+') ? 'text-emerald-600' : kw.change === '0' ? 'text-slate-400' : 'text-rose-600'}>
                      {kw.change}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-medium">
                    {kw.intent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI SEO Suggestions */}
      <div className="bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/40 rounded-2xl p-5 border border-indigo-100 shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-100">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">AI Local SEO Recommendations</h3>
            <p className="text-xs text-slate-500">Actionable ranking improvements generated specifically for {selectedBusiness?.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {seoSuggestions.map((sugg) => {
            const isApplied = appliedSuggestions[sugg.id];
            return (
              <div key={sugg.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-600 mb-1">
                    <span className="bg-indigo-50 px-2 py-0.5 rounded">{sugg.category}</span>
                    <span className="text-emerald-600 font-bold">{sugg.impact}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{sugg.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{sugg.desc}</p>
                </div>

                <button
                  onClick={() => handleApplySuggestion(sugg.id)}
                  disabled={isApplied}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isApplied
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Applied to Profile
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      Apply Suggestion
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Keyword Modal */}
      <Modal
        isOpen={addKeywordModalOpen}
        onClose={() => setAddKeywordModalOpen(false)}
        title="Track New Local Keyword"
        subtitle={`Track search queries in ${selectedBusiness?.city} and neighboring areas`}
      >
        <form onSubmit={handleAddKeyword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Keyword Query *</label>
            <input
              type="text"
              required
              placeholder="e.g. Best Biryani in Civil Lines"
              value={newKeyword.keyword}
              onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Estimated Searches</label>
              <input
                type="number"
                value={newKeyword.searchVolume}
                onChange={(e) => setNewKeyword({ ...newKeyword, searchVolume: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Current Ranking</label>
              <input
                type="number"
                min="1"
                max="50"
                value={newKeyword.ranking}
                onChange={(e) => setNewKeyword({ ...newKeyword, ranking: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Competition</label>
              <select
                value={newKeyword.competition}
                onChange={(e) => setNewKeyword({ ...newKeyword, competition: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Search Intent</label>
              <select
                value={newKeyword.intent}
                onChange={(e) => setNewKeyword({ ...newKeyword, intent: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Local Commercial">Local Commercial</option>
                <option value="Local Discovery">Local Discovery</option>
                <option value="Transactional">Transactional</option>
                <option value="Informational">Informational</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddKeywordModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Add to Track
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
