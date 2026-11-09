import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Star,
  Eye,
  PhoneCall,
  RefreshCw,
  Plus,
  CheckCircle2,
  X,
  ChevronUp,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../context/ToastContext';

export default function LiveSimulatorPill({ positionClass = '' }) {
  const [open, setOpen] = useState(false);
  const {
    selectedBusiness,
    businesses,
    setSelectedBusinessId,
    updateBusiness,
    reviews,
    generateAIReply
  } = useBusiness();
  const { showToast } = useToast();

  // Action 1: Simulate Incoming 5-Star Review
  const handleSimulateNewReview = () => {
    const authors = [
      { name: 'Dr. Harshwardhan Rai', text: 'Unmatched experience! The quality and service standards are consistent every visit.', city: 'Civil Lines' },
      { name: 'Kavita Mehrotra', text: 'Celebrated our anniversary here. Truly professional staff and warm hospitality.', city: 'Tagore Town' },
      { name: 'Sanjay Chaurasia', text: 'Very hygienic and fast service! Definitely recommending to all friends.', city: 'Hazratganj' },
    ];
    const pick = authors[Math.floor(Math.random() * authors.length)];

    const newRev = {
      id: `rev-${Date.now()}`,
      businessId: selectedBusiness?.id,
      author: pick.name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      rating: 5,
      date: 'Just now',
      text: pick.text,
      sentiment: 'Positive',
      replyStatus: 'Pending',
      replyText: '',
      suggestedReply: `Dear ${pick.name}, thank you so much for your generous 5-star review! We are delighted you had a memorable experience at ${selectedBusiness?.name}. Looking forward to serving you again soon!`
    };

    // Update in context by triggering reply or updating business stats
    updateBusiness(selectedBusiness.id, {
      totalReviews: (selectedBusiness.totalReviews || 218) + 1,
      stats: {
        ...selectedBusiness.stats,
        customerActions: (selectedBusiness.stats?.customerActions || 1280) + 1,
        profileViews: (selectedBusiness.stats?.profileViews || 12450) + 15
      }
    });

    showToast(`🌟 New 5-Star Review received from ${pick.name}!`, 'success');
  };

  // Action 2: Simulate Instant Traffic Surge (+80 views, +4 calls)
  const handleSimulateTrafficSurge = () => {
    updateBusiness(selectedBusiness.id, {
      stats: {
        ...selectedBusiness.stats,
        profileViews: (selectedBusiness.stats?.profileViews || 12450) + 85,
        profileViewsGrowth: 21.4,
        phoneCalls: (selectedBusiness.stats?.phoneCalls || 342) + 5,
        customerActions: (selectedBusiness.stats?.customerActions || 1280) + 8,
      }
    });
    showToast('📈 Simulated +85 Google Search Views & +5 Direct Phone Calls!', 'success');
  };

  // Action 3: Auto-generate AI replies to all pending reviews
  const handleAIBatchReply = () => {
    const pending = reviews.filter(r => r.replyStatus === 'Pending');
    if (pending.length === 0) {
      showToast('All reviews already have AI responses prepared!', 'info');
      return;
    }
    pending.forEach(r => generateAIReply(r.id));
    showToast(`🤖 LocalBoost AI generated replies for ${pending.length} reviews!`, 'success');
  };

  return (
    <div className={`fixed bottom-5 left-4 sm:left-5 z-40 max-w-[calc(100vw-2rem)] transition-[left] duration-300 ${positionClass}`}>
      {/* Floating Pill Toggle Button */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-full text-xs font-bold shadow-soft-lg hover:shadow-glow transition-all duration-300 hover:scale-105 group border border-white/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-amber-300 transition-transform group-hover:rotate-12" />
          <span><span className="hidden sm:inline">Interactive </span>Playground</span>
          <span className="bg-white/20 text-white text-[10px] px-1.5 py-px rounded font-extrabold uppercase ml-1">
            Live
          </span>
        </button>
      ) : (
        /* Expanded Interactive Simulation Panel */
        <div className="bg-white rounded-2xl shadow-soft-lg border border-slate-200/90 w-80 max-w-full p-4 animate-scale-up space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Live Demo Simulator</h4>
                <p className="text-[10px] text-slate-400">Trigger real-time UI interactions</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleSimulateNewReview}
              className="w-full text-left p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span>Simulate 5★ Customer Review</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={handleSimulateTrafficSurge}
              className="w-full text-left p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Simulate +85 Search Views</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={handleAIBatchReply}
              className="w-full text-left p-2.5 rounded-xl bg-violet-50 hover:bg-violet-100/80 border border-violet-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-900">
                <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Batch Generate AI Replies</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-violet-600 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          {/* Quick Business Switcher */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              1-Click Location Switcher
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {businesses.slice(0, 4).map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBusinessId(b.id);
                    showToast(`Active location: ${b.name}`, 'info');
                  }}
                  className={`p-1.5 rounded-lg text-[11px] font-medium text-left truncate flex items-center gap-1.5 transition ${
                    selectedBusiness?.id === b.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{b.logo}</span>
                  <span className="truncate">{b.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

