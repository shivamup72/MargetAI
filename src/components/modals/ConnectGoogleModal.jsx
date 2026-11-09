import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Info, Check, Lock, ExternalLink } from 'lucide-react';

export default function ConnectGoogleModal({ isOpen, onClose, businessId }) {
  const { businesses, connectGoogleProfile } = useBusiness();
  const { showToast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState('shivam.marketing@gmail.com');
  const [isConnecting, setIsConnecting] = useState(false);

  const targetBiz = businesses.find(b => b.id === businessId) || businesses[0];

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      connectGoogleProfile(targetBiz.id, selectedAccount);
      setIsConnecting(false);
      showToast(`Google Business Profile connected for ${targetBiz.name}!`, 'success');
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Google Business Profile" subtitle="Simulated OAuth 2.0 Integration" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Clear Demo Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-900">Prototype Demo Simulation:</strong>
            <p className="mt-0.5 text-amber-700">
              This simulates the standard Google Business Profile API OAuth flow. No real Google credentials or API calls are made.
            </p>
          </div>
        </div>

        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-center p-2 mb-3">
            {/* Google G Logo SVG */}
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-slate-800">
            Sign in with Google
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Choose an account to connect with <strong>{targetBiz?.name}</strong>
          </p>
        </div>

        {/* Demo Account Options */}
        <div className="space-y-2">
          {[
            { email: 'shivam.marketing@gmail.com', name: 'Shivam Gupta (Owner)', role: 'Primary Verified Account' },
            { email: 'sharma.hospitality@gmail.com', name: 'Sharma Hospitality Admin', role: 'Business Location Manager' }
          ].map((acc) => (
            <div
              key={acc.email}
              onClick={() => setSelectedAccount(acc.email)}
              className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                selectedAccount === acc.email
                  ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {acc.name[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">{acc.name}</div>
                  <div className="text-[11px] text-slate-500">{acc.email}</div>
                </div>
              </div>
              {selectedAccount === acc.email && (
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Permissions preview */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="font-medium text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Permissions granted in LocalBoost AI:
          </div>
          <ul className="text-slate-500 text-[11px] list-disc list-inside space-y-0.5 pl-1">
            <li>Read business profile metrics and search performance</li>
            <li>Respond to customer Google reviews on your behalf</li>
            <li>Update business hours, special services, and menus</li>
            <li>Publish promotional updates and festive posts</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isConnecting}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting OAuth...
              </>
            ) : (
              <>
                Authorize & Connect
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

