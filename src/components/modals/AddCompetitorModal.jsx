import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../context/ToastContext';
import { Crosshair, Star, MessageSquare, Image, Check } from 'lucide-react';

export default function AddCompetitorModal({ isOpen, onClose }) {
  const { addCompetitor } = useBusiness();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    rating: 4.2,
    reviews: 120,
    completeness: 80,
    photos: 35,
    responseRate: 60,
    localRank: '#4 in Local Area'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a competitor business name', 'warning');
      return;
    }
    addCompetitor({
      name: formData.name,
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews, 10),
      completeness: parseInt(formData.completeness, 10),
      photos: parseInt(formData.photos, 10),
      responseRate: parseInt(formData.responseRate, 10),
      localRank: formData.localRank
    });
    showToast(`Added "${formData.name}" to Competitor Radar!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Competitor to Track" subtitle="Monitor rating, review velocity, and photo updates in your catchment area">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Competitor Business Name *
          </label>
          <div className="relative">
            <Crosshair className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Sagar Ratna or Zaika Corner"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Google Rating (1.0 - 5.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Reviews Count
            </label>
            <input
              type="number"
              min="0"
              value={formData.reviews}
              onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Photos Count
            </label>
            <input
              type="number"
              min="0"
              value={formData.photos}
              onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Response Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.responseRate}
              onChange={(e) => setFormData({ ...formData, responseRate: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
          >
            <Check className="w-4 h-4" />
            Track Competitor
          </button>
        </div>
      </form>
    </Modal>
  );
}

