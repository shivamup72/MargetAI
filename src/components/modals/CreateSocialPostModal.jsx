import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, Send, Clock, Check } from 'lucide-react';

export default function CreateSocialPostModal({ isOpen, onClose }) {
  const { addSocialPost } = useBusiness();
  const { showToast } = useToast();

  const [selectedPlatforms, setSelectedPlatforms] = useState(['Google Business', 'Instagram']);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80');
  const [scheduledFor, setScheduledFor] = useState('2026-11-06 01:00 PM');
  const [postNow, setPostNow] = useState(false);

  const availablePlatforms = ['Google Business', 'Instagram', 'Facebook', 'WhatsApp'];

  const sampleImages = [
    { label: 'Food Dish', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80' },
    { label: 'Restaurant Hall', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80' },
    { label: 'Special Thali', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80' },
    { label: 'Healthcare Care', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80' },
  ];

  const togglePlatform = (p) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
      } else {
        showToast('At least one platform must be selected', 'warning');
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Please enter post text', 'warning');
      return;
    }

    addSocialPost({
      platforms: selectedPlatforms,
      content,
      image: imageUrl,
      scheduledFor: postNow ? 'Published Just Now' : scheduledFor,
      status: postNow ? 'Published' : 'Scheduled'
    });

    showToast(postNow ? 'Post published successfully across selected channels!' : 'Post scheduled on content calendar!', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Social & Google Post" subtitle="Publish updates, specials, and photos to your local channels">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Select Channels *
          </label>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map((p) => {
              const isSelected = selectedPlatforms.includes(p);
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Post Content / Caption *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Write an engaging message, mention festive greetings, specials, phone number, and location..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
            <span>Tip: Posts with contact numbers get 40% more call clicks</span>
            <span>{content.length} characters</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Attach Image (Select Demo Photo)
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {sampleImages.map((img) => (
              <div
                key={img.label}
                onClick={() => setImageUrl(img.url)}
                className={`cursor-pointer rounded-lg overflow-hidden border transition active:scale-95 ${
                  imageUrl === img.url ? 'border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.label} className="w-full h-14 object-cover" />
                <div className="text-[10px] text-center bg-slate-100 py-0.5 truncate">{img.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 shrink-0">
            <input
              type="checkbox"
              checked={postNow}
              onChange={(e) => setPostNow(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Publish immediately (Skip schedule)
          </label>

          {!postNow && (
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="2026-11-06 01:00 PM"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:border-indigo-600"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
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
            {postNow ? <Send className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            {postNow ? 'Publish Now' : 'Schedule Post'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
