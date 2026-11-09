import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Sparkles,
  CheckCircle2,
  Search,
  Send,
  Edit2,
  RefreshCw
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import DemoNotice from '../components/common/DemoNotice';

export default function ReviewsManagement() {
  const {
    reviews,
    selectedBusiness,
    generateAIReply,
    updateReviewReplyText,
    publishReviewReply
  } = useBusiness();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Positive' | 'Critical'
  const [searchQuery, setSearchQuery] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');

  // Filter reviews for selected business or all
  const businessReviews = reviews.filter(r => r.businessId === selectedBusiness?.id || !r.businessId);

  const filteredReviews = businessReviews.filter(rev => {
    const matchesSearch = rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'Pending') return rev.replyStatus === 'Pending';
    if (activeTab === 'Positive') return rev.sentiment === 'Positive';
    if (activeTab === 'Critical') return rev.sentiment === 'Critical' || rev.rating <= 2;
    return true;
  });

  const totalReviews = businessReviews.length;
  const pendingCount = businessReviews.filter(r => r.replyStatus === 'Pending').length;
  const positiveCount = businessReviews.filter(r => r.sentiment === 'Positive').length;
  const criticalCount = businessReviews.filter(r => r.sentiment === 'Critical' || r.rating <= 2).length;

  const handleStartEdit = (rev) => {
    setEditingReviewId(rev.id);
    setEditText(rev.replyText || rev.suggestedReply || '');
  };

  const handleSaveEdit = (reviewId) => {
    updateReviewReplyText(reviewId, editText);
    setEditingReviewId(null);
    showToast('Reply text updated and saved!', 'info');
  };

  const handleGenerateAI = (reviewId) => {
    generateAIReply(reviewId);
    showToast('AI response generated with local context!', 'success');
  };

  const handlePublish = (reviewId) => {
    publishReviewReply(reviewId);
    showToast('Reply published to Google Business Profile! (Demo Simulation)', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Google Reviews & AI Reputation Engine
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Monitor incoming customer ratings for <strong>{selectedBusiness?.name}</strong> and publish empathetic AI responses.
          </p>
        </div>

        <button
          onClick={() => showToast('Reviews refreshed from Google Maps servers', 'info')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          Refresh Reviews
        </button>
      </div>

      <DemoNotice text="Simulated Google Reviews: AI generation uses local business and sentiment heuristics." />

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reviews</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{selectedBusiness?.totalReviews || totalReviews}</div>
          <span className="text-[11px] text-slate-500">Google Verified</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Rating</span>
          <div className="text-2xl font-bold text-amber-500 mt-1 flex items-center gap-1">
            ★ {selectedBusiness?.rating}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Excellent Standing</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Replies</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{pendingCount}</div>
          <span className="text-[11px] text-slate-500">Requires Owner Response</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sentiment Split</span>
          <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-2">
            <span className="text-emerald-600">{positiveCount} Pos</span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600">{criticalCount} Crit</span>
          </div>
          <span className="text-[11px] text-slate-500">89% Positive ratio</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Positive', 'Critical'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition shrink-0 ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
              {tab === 'Pending' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-px rounded-full text-[10px] bg-rose-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search reviews by name or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-soft">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No reviews found in this filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try switching to the "All" tab or clearing the search query.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isEditing = editingReviewId === rev.id;

            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-md transition space-y-3"
              >
                {/* Review Header: User & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{rev.author}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rev.sentiment === 'Positive'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rev.sentiment === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rev.sentiment}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date} via Google Maps</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      rev.replyStatus === 'Published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.replyStatus === 'Approved'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rev.replyStatus}
                    </span>
                  </div>
                </div>

                {/* Review Body */}
                <p className="text-xs text-slate-700 leading-relaxed pl-1">
                  "{rev.text}"
                </p>

                {/* Reply Section */}
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                      Owner Response
                    </span>

                    {rev.replyStatus === 'Published' ? (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Live on Google ({rev.replyDate})
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {rev.replyText || rev.suggestedReply ? (
                          <button
                            onClick={() => handleStartEdit(rev)}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Displaying or Editing Reply */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingReviewId(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(rev.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                        >
                          Save Draft
                        </button>
                      </div>
                    </div>
                  ) : rev.replyText ? (
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-200">
                      "{rev.replyText}"
                    </p>
                  ) : rev.suggestedReply ? (
                    <div className="space-y-2">
                      <div className="text-[11px] text-indigo-700 font-medium">Suggested AI Response:</div>
                      <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-lg border border-indigo-200">
                        "{rev.suggestedReply}"
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500 py-1">
                      <span>No response drafted yet.</span>
                      <button
                        onClick={() => handleGenerateAI(rev.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate AI Reply
                      </button>
                    </div>
                  )}

                  {/* Action buttons if not yet published */}
                  {rev.replyStatus !== 'Published' && (rev.replyText || rev.suggestedReply) && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleGenerateAI(rev.id)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                      >
                        Regenerate
                      </button>
                      <button
                        onClick={() => handlePublish(rev.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Publish to Google
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
