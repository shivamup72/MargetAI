import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Calendar,
  Trash2,
  Sliders
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import DemoNotice from '../components/common/DemoNotice';

export default function AIContentStudio() {
  const { selectedBusiness, drafts, saveDraft, deleteDraft, addSocialPost } = useBusiness();
  const { showToast } = useToast();

  const [category, setCategory] = useState(selectedBusiness?.category || 'Restaurant');
  const [contentType, setContentType] = useState('Google Business Profile Post');
  const [tone, setTone] = useState('Warm & Friendly');
  const [topic, setTopic] = useState('Weekend Special Dal Makhani & Family Thali Discount');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState(
    `✨ Experience Authentic Pure Desi Ghee Flavors in ${selectedBusiness?.city}!\n\nThis weekend, gather your family at ${selectedBusiness?.name} for our signature Special Family Thali. Enjoy slow-cooked Dal Makhani, Paneer Butter Masala, fresh tandoori rotis, and piping hot Gulab Jamun at 15% off.\n\n📍 Visit us at: ${selectedBusiness?.address}\n📞 Call for Reservations: ${selectedBusiness?.phone}\n\n#PratapgarhFood #PureVeg #FamilyDining #LocalBoost`
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'drafts'

  const contentTypes = [
    'Google Business Profile Post',
    'Instagram Caption & Hashtags',
    'Facebook Community Post',
    'Promotional Offer',
    'Festival Marketing (Diwali/Chhath)'
  ];

  const tones = [
    'Warm & Friendly',
    'Professional & Clinical',
    'Festive & Celebratory',
    'Urgent & Promotional (FOMO)',
    'Traditional & Cultural'
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast('Please enter a topic or promotion theme', 'warning');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      let output = '';
      if (contentType === 'Google Business Profile Post') {
        output = `📢 Update from ${selectedBusiness?.name} (${selectedBusiness?.city})\n\n${topic} is now live! We welcome all our patrons across ${selectedBusiness?.city} to experience exceptional quality and warm hospitality.\n\n📅 Offer valid throughout this week.\n📍 Location: ${selectedBusiness?.address}\n📞 Inquiries & Bookings: ${selectedBusiness?.phone}`;
      } else if (contentType === 'Instagram Caption & Hashtags') {
        output = `Nothing brings people together like great moments! 🌟\n\n${topic} — crafted with care and dedication at ${selectedBusiness?.name}.\n\nTag someone you want to bring along! 👇\n\n📍 ${selectedBusiness?.address}\n.\n.\n#${selectedBusiness?.city.replace(/\s+/g, '')}Diaries #LocalBusiness #ExplorePage #DiscoverLocal #QualityMatters`;
      } else if (contentType === 'Festival Marketing (Diwali/Chhath)') {
        output = `🪔 Celebrate the auspicious festive season with ${selectedBusiness?.name}!\n\nWishing all families in ${selectedBusiness?.city} immense joy, health, and prosperity. Make your festivities sweeter with our curated offerings.\n\n🎁 Special Festival Hampers & Advance Bookings Open Now!\n📞 Contact: ${selectedBusiness?.phone}\n📍 ${selectedBusiness?.address}`;
      } else {
        output = `🔥 LIMITED TIME OFFER: ${topic}!\n\nGet exclusive benefits when you visit ${selectedBusiness?.name} this month. High quality, verified 4.6★ customer satisfaction.\n\n👉 Call now to claim: ${selectedBusiness?.phone}\n📍 Visit: ${selectedBusiness?.address}`;
      }

      setGeneratedText(output);
      setIsGenerating(false);
      showToast('AI content crafted successfully!', 'success');
    }, 1100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    showToast('Content copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDrafts = () => {
    saveDraft({
      title: topic || 'Marketing Post',
      category,
      type: contentType,
      content: generatedText
    });
    showToast('Saved to Content Drafts!', 'success');
  };

  const handleQuickSchedule = () => {
    addSocialPost({
      platforms: [contentType.includes('Instagram') ? 'Instagram' : 'Google Business'],
      content: generatedText,
      image: selectedBusiness?.coverImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
      scheduledFor: 'Tomorrow at 12:00 PM',
      status: 'Scheduled'
    });
    showToast('Scheduled directly to Social Media calendar!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            AI Local Marketing Content Studio
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Generate high-converting local copy for Google Updates, Instagram reels, WhatsApp broadcasts, and festival campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              activeTab === 'studio' ? 'bg-indigo-600 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Studio Generator
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'drafts' ? 'bg-indigo-600 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved Drafts ({drafts.length})
          </button>
        </div>
      </div>

      <DemoNotice text="Simulated Generative AI: Local prompts and copy templates designed for North Indian regional marketing." />

      {activeTab === 'studio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Prompt Parameters
              </h3>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                GPT-4o Engine
              </span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Business Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Content Format / Channel
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  {contentTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Offer / Topic / Key Highlight *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Free checkup this Sunday or Flat 20% off on all Paneer dishes for Diwali"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate AI Content
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Editor: Generated Output & Actions (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {contentType}
                  </span>
                  <span className="text-[10px] text-slate-400">({tone})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleSaveToDrafts}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Save Draft
                  </button>
                </div>
              </div>

              {/* Editable Output Box */}
              <div className="relative">
                <textarea
                  rows={11}
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-400">
                  {generatedText.length} characters
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">
                Directly pushes to Google Business, Instagram, or Facebook schedules.
              </span>
              <button
                onClick={handleQuickSchedule}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition"
              >
                <Calendar className="w-4 h-4" />
                Schedule to Social Calendar
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Saved Drafts List View */
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
              Saved Marketing Drafts ({drafts.length})
            </h3>
            <span className="text-xs text-slate-400">Persisted locally for easy reuse</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drafts.map((draft) => (
              <div key={draft.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{draft.type}</span>
                    <span>{draft.savedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{draft.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-slate-200">
                    {draft.content}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setGeneratedText(draft.content);
                      setContentType(draft.type || 'Google Business Profile Post');
                      setActiveTab('studio');
                      showToast('Draft loaded into Studio Editor!', 'info');
                    }}
                    className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg"
                  >
                    Load into Editor
                  </button>
                  <button
                    onClick={() => {
                      deleteDraft(draft.id);
                      showToast('Draft removed', 'info');
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
