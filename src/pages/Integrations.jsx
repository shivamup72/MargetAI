import React from 'react';
import {
  Layers,
  Compass,
  BarChart3,
  MessageSquare,
  Camera,
  Share2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import DemoNotice from '../components/common/DemoNotice';

export default function Integrations() {
  const { integrations, toggleIntegration } = useBusiness();
  const { showToast } = useToast();

  const getIcon = (name) => {
    switch (name) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-blue-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6 text-amber-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-emerald-600" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-pink-600" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-indigo-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-violet-600" />;
      default:
        return <Layers className="w-6 h-6 text-indigo-600" />;
    }
  };

  const handleToggle = (integ) => {
    toggleIntegration(integ.id);
    const willConnect = !integ.connected;
    showToast(
      willConnect
        ? `Connected to ${integ.name} (Simulated Auth)!`
        : `Disconnected from ${integ.name}`,
      willConnect ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Integrations & API Connections
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Connect your local marketing stack to automate data synchronization, social feeds, and AI review responses.
          </p>
        </div>

        <button
          onClick={() => showToast('All connected webhooks verified and operational', 'success')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          Test All Connections
        </button>
      </div>

      <DemoNotice text="Simulated Webhooks: Toggling switches connection states in client-side storage." />

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((integ) => (
          <div
            key={integ.id}
            className={`bg-white rounded-xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between ${
              integ.connected
                ? 'border-indigo-200 shadow-card'
                : 'border-slate-200 shadow-card hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                  {getIcon(integ.iconName)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {integ.badge}
                  </span>
                  {integ.connected ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Disabled
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-tight">{integ.name}</h3>
              <div className="text-[11px] font-medium text-indigo-600 mb-2">{integ.category}</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {integ.description}
              </p>

              {integ.account && (
                <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-600 font-mono truncate">
                  Account: <strong>{integ.account}</strong>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Last sync: {integ.lastSync}
              </span>

              <button
                onClick={() => handleToggle(integ)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-sm ${
                  integ.connected
                    ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {integ.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

