import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useBusiness } from '../../context/BusinessContext';
import { useToast } from '../../context/ToastContext';
import { SUBSCRIPTION_PLANS } from '../../data/mockData';
import { Check, Shield, Zap } from 'lucide-react';

export default function UpgradePlanModal({ isOpen, onClose }) {
  const { currentPlan, setCurrentPlan } = useBusiness();
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlan);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCurrentPlan(selectedPlanId);
      setIsProcessing(false);
      showToast(`Subscription updated to ${selectedPlanId.toUpperCase()} plan! (Demo Payment Simulated)`, 'success');
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade LocalBoost AI Plan" subtitle="Select a plan tailored for your local business growth" maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-medium">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition ${
                billingCycle === 'monthly' ? 'bg-white text-slate-800 shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                billingCycle === 'annual' ? 'bg-white text-slate-800 shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              Annual Billing
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-px rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isCurrent = currentPlan === plan.id;
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between active:scale-[0.99] ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/40 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-slate-900">₹{price}</span>
                    <span className="text-xs text-slate-500">/mo</span>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className={`w-full py-1.5 text-center rounded-lg text-xs font-semibold transition ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isSelected ? 'Selected' : 'Choose Plan'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo payment notice */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Simulated checkout via Razorpay (No card charge in Demo Mode)</span>
          </div>
          <span className="font-semibold text-slate-700">Instant Activation</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Simulating Payment...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Confirm {selectedPlanId.toUpperCase()} Plan
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
