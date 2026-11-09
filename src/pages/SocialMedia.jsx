import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  Plus,
  Trash2,
  Heart,
  Eye,
  CheckCircle2,
  Clock,
  Compass,
  Camera,
  MessageSquare
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import CreateSocialPostModal from '../components/modals/CreateSocialPostModal';
import DemoNotice from '../components/common/DemoNotice';

const FacebookIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function SocialMedia() {
  const { socialPosts, deleteSocialPost, selectedBusiness } = useBusiness();
  const { showToast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState('All');

  const platforms = [
    { name: 'Google Business', icon: Compass, connected: selectedBusiness?.googleConnected, color: 'text-blue-600 bg-blue-50' },
    { name: 'Instagram', icon: Camera, connected: true, color: 'text-pink-600 bg-pink-50' },
    { name: 'Facebook', icon: FacebookIcon, connected: true, color: 'text-indigo-600 bg-indigo-50' },
    { name: 'WhatsApp', icon: MessageSquare, connected: true, color: 'text-emerald-600 bg-emerald-50' }
  ];

  const filteredPosts = socialPosts.filter(post => {
    if (filterPlatform === 'All') return true;
    return post.platforms.includes(filterPlatform);
  });

  const scheduledCount = socialPosts.filter(p => p.status === 'Scheduled').length;
  const publishedCount = socialPosts.filter(p => p.status === 'Published').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-600" />
            Social Media & Local Feed Manager
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Publish and schedule multi-channel updates across Google Maps, Instagram, and Facebook for <strong>{selectedBusiness?.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create / Schedule Post
        </button>
      </div>

      <DemoNotice text="Simulated Social Publishing: Multi-platform posting is emulated with local schedules and image previews." />

      {/* Connected Accounts & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {platforms.map((plat) => {
          const Icon = plat.icon;
          return (
            <div key={plat.name} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${plat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{plat.name}</div>
                  <span className={`text-[10px] font-semibold ${plat.connected ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {plat.connected ? '✓ Connected' : 'Not Linked'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Posts</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{scheduledCount}</div>
          <span className="text-[11px] text-slate-500">Queued on calendar</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published This Month</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{publishedCount}</div>
          <span className="text-[11px] text-slate-500">Live across channels</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Social Reach</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">6,570</div>
          <span className="text-[11px] text-slate-500">Local views & impressions</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Engagement Rate</span>
          <div className="text-2xl font-bold text-violet-600 mt-1">7.4%</div>
          <span className="text-[11px] text-slate-500">Likes, shares & clicks</span>
        </div>
      </div>

      {/* Content Calendar / Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto overflow-x-auto scrollbar-none">
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 shrink-0 whitespace-nowrap">Filter Channel:</span>
          {['All', 'Google Business', 'Instagram', 'Facebook'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-lg transition active:scale-95 ${
                filterPlatform === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 self-start sm:self-auto">
          Showing {filteredPosts.length} posts
        </span>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-soft-md transition"
          >
            <div>
              {/* Media Preview */}
              {post.image && (
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img src={post.image} alt="Social post" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {post.status === 'Scheduled' ? (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Scheduled
                      </span>
                    ) : (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {post.platforms.map((plat) => (
                    <span key={plat} className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {plat}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                  {post.content}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.scheduledFor}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  {post.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  {post.reach || 0}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    deleteSocialPost(post.id);
                    showToast('Post removed from social schedule', 'info');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <CreateSocialPostModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
