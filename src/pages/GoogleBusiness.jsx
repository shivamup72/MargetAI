import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Edit3,
  ExternalLink,
  MapPin,
  Phone,
  Globe,
  Clock,
  Sparkles,
  Camera,
  UploadCloud,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import ConnectGoogleModal from '../components/modals/ConnectGoogleModal';
import DemoNotice from '../components/common/DemoNotice';
import Modal from '../components/common/Modal';

export default function GoogleBusiness() {
  const { selectedBusiness, updateBusiness, disconnectGoogleProfile } = useBusiness();
  const { showToast } = useToast();

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mapsModalOpen, setMapsModalOpen] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: selectedBusiness?.name || '',
    category: selectedBusiness?.category || '',
    phone: selectedBusiness?.phone || '',
    website: selectedBusiness?.website || '',
    address: selectedBusiness?.address || '',
    description: selectedBusiness?.description || ''
  });

  // Photo gallery
  const [photos, setPhotos] = useState([
    { id: 1, title: 'Storefront Exterior', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', views: 4210 },
    { id: 2, title: 'Signature Dishes', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80', views: 3120 },
    { id: 3, title: 'Dining Hall Seating', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80', views: 2450 },
    { id: 4, title: 'Team & Kitchen', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', views: 1890 }
  ]);

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Google Business Profile data synchronized with Google Maps servers!', 'success');
    }, 1200);
  };

  const handleAIEnhanceDescription = () => {
    const enhanced = `Experience the finest ${formData.category} in ${selectedBusiness?.city}. Serving authentic specialties prepared with uncompromising hygiene, premium ingredients, and warm hospitality. Rated ${selectedBusiness?.rating} stars by over ${selectedBusiness?.totalReviews} local patrons. Visit us at ${formData.address} or call ${formData.phone} for reservations.`;
    setFormData(prev => ({ ...prev, description: enhanced }));
    showToast('Description optimized with Local SEO keywords and AI!', 'success');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateBusiness(selectedBusiness.id, {
      name: formData.name,
      category: formData.category,
      phone: formData.phone,
      website: formData.website,
      address: formData.address,
      description: formData.description
    });
    showToast('Business details updated successfully!', 'success');
    setEditProfileOpen(false);
  };

  const handleSimulatePhotoUpload = () => {
    const newPhoto = {
      id: Date.now(),
      title: 'Uploaded Photo',
      url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80',
      views: 12
    };
    setPhotos([newPhoto, ...photos]);
    showToast('New photo uploaded to Google Business listing!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            Google Business Profile Management
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Control your verified Google Maps presence, business hours, photos, and live contact cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </button>

          <button
            onClick={() => setMapsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            View on Google Maps
          </button>

          <button
            onClick={() => setEditProfileOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-soft"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>
      </div>

      <DemoNotice text="Simulated Google Business Profile API: Changes modify local prototype state." />

      {/* Connection Status Banner */}
      <div className={`p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
        selectedBusiness?.googleConnected
          ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/30 border-emerald-200'
          : 'bg-gradient-to-r from-amber-50 to-orange-50/50 border-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            selectedBusiness?.googleConnected ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {selectedBusiness?.googleConnected ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-sm font-semibold text-slate-900 break-words min-w-0">
                {selectedBusiness?.googleConnected
                  ? `Connected Google Account: ${selectedBusiness?.googleAccountEmail || 'Verified Google Account'}`
                  : 'Google Business Profile Not Connected'}
              </h3>
              <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                selectedBusiness?.googleConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedBusiness?.googleConnected ? 'VERIFIED LISTING' : 'ACTION REQUIRED'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {selectedBusiness?.googleConnected
                ? 'Your business profile is actively syncing reviews, phone call insights, and directions.'
                : 'Connect your Google account via simulated OAuth to enable AI automated review replies and search analytics.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {selectedBusiness?.googleConnected ? (
            <button
              onClick={() => disconnectGoogleProfile(selectedBusiness.id)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => setConnectModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Connect Google Account
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Business Info & Operating Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Business Information & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Official Business Details</h3>
              <span className="text-xs font-semibold text-indigo-600">Google Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Category</span>
                <div className="font-bold text-slate-800 text-sm">{selectedBusiness?.category}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Phone</span>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {selectedBusiness?.phone}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1 md:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Maps Physical Address</span>
                <div className="font-medium text-slate-800 text-xs flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  {selectedBusiness?.address}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1 md:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Website</span>
                <div className="font-medium text-slate-800 text-xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  <a href={selectedBusiness?.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                    {selectedBusiness?.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Google Business Description (650/750 Characters)
                </span>
                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-violet-500" />
                  AI Enhance
                </button>
              </div>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                {selectedBusiness?.description}
              </p>
            </div>
          </div>

          {/* Business Photos Gallery */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Google Photos & Storefront Gallery</h3>
                <p className="text-xs text-slate-500">Listings with 10+ photos get 42% more directions requests</p>
              </div>

              <button
                onClick={handleSimulatePhotoUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                    <span className="text-[11px] font-bold truncate leading-tight">{photo.title}</span>
                    <span className="text-[10px] text-slate-300">{photo.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Opening Hours & Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                Weekly Business Hours
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Open Now
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {Object.entries(selectedBusiness?.openingHours || {}).map(([day, hours]) => {
                const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                return (
                  <div key={day} className={`py-2 flex items-center justify-between ${isToday ? 'font-bold text-indigo-700 bg-indigo-50/40 px-2 rounded-lg' : 'text-slate-600'}`}>
                    <span>{day}</span>
                    <span>{hours}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => showToast('Hours are synchronized with Google Maps schedule', 'info')}
              className="w-full mt-2 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-center border border-slate-200"
            >
              Update Holiday & Special Hours
            </button>
          </div>

          {/* Maps Preview Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-xl p-5 shadow-[0_14px_32px_-14px_rgba(67,56,202,0.55)] space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-300" />
              <h4 className="text-sm font-bold">Google Maps Local Search Pin</h4>
            </div>
            <p className="text-xs text-indigo-100/85 leading-relaxed">
              When users search for "{selectedBusiness?.category} near me" in {selectedBusiness?.city}, your listing ranks with 4.6★ rating and direct call button.
            </p>
            <button
              onClick={() => setMapsModalOpen(true)}
              className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-100 transition shadow-sm"
            >
              Preview Maps Listing
            </button>
          </div>
        </div>
      </div>

      {/* Connect Google OAuth Modal */}
      <ConnectGoogleModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        businessId={selectedBusiness?.id}
      />

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Google Business Profile"
        subtitle="Changes will sync directly to Google Search & Maps"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Business Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase">Description</label>
              <button
                type="button"
                onClick={handleAIEnhanceDescription}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                AI Generate
              </button>
            </div>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Save & Sync Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Simulated Google Maps Preview Modal */}
      <Modal
        isOpen={mapsModalOpen}
        onClose={() => setMapsModalOpen(false)}
        title="Google Maps Simulated Preview"
        subtitle="How customers see your listing on Google Maps Mobile & Web"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-soft">
            <img src={selectedBusiness?.coverImage} alt="Listing" className="w-full h-44 object-cover" />
            <div className="p-4 space-y-2 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedBusiness?.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                    <span className="font-bold text-amber-500">★ {selectedBusiness?.rating}</span>
                    <span>({selectedBusiness?.totalReviews} Google reviews)</span>
                  </div>
                  <div className="text-xs text-slate-500">{selectedBusiness?.category}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <button className="p-2 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">Directions</button>
                <button className="p-2 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">Call</button>
                <button className="p-2 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">Save</button>
                <button className="p-2 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">Share</button>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedBusiness?.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Open • Closes 11 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedBusiness?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMapsModalOpen(false)}
            className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
          >
            Close Preview
          </button>
        </div>
      </Modal>
    </div>
  );
}
