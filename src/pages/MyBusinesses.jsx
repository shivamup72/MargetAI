import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Plus,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Settings,
  MoreVertical
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import AddBusinessModal from '../components/modals/AddBusinessModal';
import ConnectGoogleModal from '../components/modals/ConnectGoogleModal';
import DemoNotice from '../components/common/DemoNotice';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function MyBusinesses() {
  const navigate = useNavigate();
  const {
    businesses,
    selectedBusinessId,
    setSelectedBusinessId
  } = useBusiness();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [targetBizId, setTargetBizId] = useState(null);
  const [detailModalBiz, setDetailModalBiz] = useState(null);
  // Remember the last business shown so the details stay visible while the modal animates closed
  const [lastDetailBiz, setLastDetailBiz] = useState(null);
  if (detailModalBiz && detailModalBiz !== lastDetailBiz) setLastDetailBiz(detailModalBiz);
  const detailBiz = detailModalBiz || lastDetailBiz;

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All' || b.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = ['All', 'Pratapgarh', 'Prayagraj', 'Lucknow', 'Varanasi'];

  const handleSelectBusiness = (biz) => {
    setSelectedBusinessId(biz.id);
    showToast(`Switched active workspace to "${biz.name}"`, 'success');
  };

  const handleConnectClick = (bizId, e) => {
    e.stopPropagation();
    setTargetBizId(bizId);
    setConnectModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            My Business Locations ({businesses.length})
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Manage your local branches, Google Business Profile connections, and local presence across Uttar Pradesh.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Business
        </button>
      </div>

      <DemoNotice text="Simulated Multi-location Management: Real-time sync simulated with local state." />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, category, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> City:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition shrink-0 ${
                selectedCity === city
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBusinesses.map((biz) => {
          const isSelected = biz.id === selectedBusinessId;

          return (
            <div
              key={biz.id}
              onClick={() => handleSelectBusiness(biz)}
              className={`bg-white rounded-xl overflow-hidden border transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.99] ${
                isSelected
                  ? 'border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
                  : 'border-slate-200 hover:border-slate-300 shadow-card hover:shadow-card-hover'
              }`}
            >
              {/* Cover Image & Status Badge */}
              <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                <img
                  src={biz.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'}
                  alt={biz.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                {/* Active Workspace Pill */}
                {isSelected && (
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVE WORKSPACE
                  </div>
                )}

                {/* Google Connection Badge */}
                <div className="absolute top-3 right-3">
                  {biz.googleConnected ? (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      ✓ Connected
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      ⚠️ Not Connected
                    </span>
                  )}
                </div>

                {/* Business Title Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-2xl mr-2">{biz.logo || '🏢'}</span>
                    <h3 className="text-base font-bold text-white drop-shadow-sm leading-tight inline">
                      {biz.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {biz.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {biz.city}, UP
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {biz.description}
                  </p>
                </div>

                {/* Metrics Bar */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 rounded-xl mb-3">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Rating</div>
                      <div className="text-xs font-bold text-amber-500">★ {biz.rating}</div>
                    </div>
                    <div className="border-x border-slate-200">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Reviews</div>
                      <div className="text-xs font-bold text-slate-800">{biz.totalReviews}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Profile</div>
                      <div className="text-xs font-bold text-indigo-600">{biz.completionPercentage}%</div>
                    </div>
                  </div>

                  {/* Profile Completion Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Profile Completeness</span>
                      <span className="font-bold text-slate-700">{biz.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full"
                        style={{ width: `${biz.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailModalBiz(biz);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-center"
                    >
                      View Details
                    </button>

                    {biz.googleConnected ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBusinessId(biz.id);
                          navigate('/google-business');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-center flex items-center justify-center gap-1"
                      >
                        Manage
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleConnectClick(biz.id, e)}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition text-center"
                      >
                        Connect Google
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Business Modal */}
      <AddBusinessModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Connect Google Modal */}
      <ConnectGoogleModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        businessId={targetBizId || selectedBusinessId}
      />

      {/* View Business Details Modal */}
      <Modal
        isOpen={!!detailModalBiz}
        onClose={() => setDetailModalBiz(null)}
        title={detailBiz ? `${detailBiz.logo || ''} ${detailBiz.name}` : 'Business details'}
        subtitle={detailBiz?.category}
      >
        {detailBiz && (
          <div className="space-y-4">
            <dl className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-x-4 gap-y-1.5 sm:gap-y-2 text-sm">
              <dt className="text-xs font-medium text-slate-500 sm:pt-0.5">Address</dt>
              <dd className="text-slate-800 mb-1.5 sm:mb-0">{detailBiz.address}</dd>
              <dt className="text-xs font-medium text-slate-500 sm:pt-0.5">Phone</dt>
              <dd className="text-slate-800 mb-1.5 sm:mb-0">{detailBiz.phone}</dd>
              <dt className="text-xs font-medium text-slate-500 sm:pt-0.5">Website</dt>
              <dd className="text-slate-800 break-all mb-1.5 sm:mb-0">{detailBiz.website}</dd>
              <dt className="text-xs font-medium text-slate-500 sm:pt-0.5">Description</dt>
              <dd className="text-slate-700 leading-relaxed">{detailBiz.description}</dd>
            </dl>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-700 mb-1">Opening Hours</div>
              {Object.entries(detailBiz.openingHours || {}).map(([day, hrs]) => (
                <div key={day} className="flex justify-between gap-3 text-xs">
                  <span className="text-slate-500">{day}</span>
                  <span className="font-medium text-slate-800 text-right">{hrs}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:flex sm:justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDetailModalBiz(null)}
                className="btn-outline order-2 sm:order-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedBusinessId(detailBiz.id);
                  setDetailModalBiz(null);
                  navigate('/google-business');
                }}
                className="btn-primary order-1 sm:order-2"
              >
                Open Google Business Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
