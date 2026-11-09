import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  Download,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import UpgradePlanModal from '../components/modals/UpgradePlanModal';
import DemoNotice from '../components/common/DemoNotice';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

export default function BillingSubscription() {
  const { currentPlan, setCurrentPlan, selectedBusiness } = useBusiness();
  const { showToast } = useToast();

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const currentPlanObj = SUBSCRIPTION_PLANS.find(p => p.id === currentPlan) || SUBSCRIPTION_PLANS[1];

  const billingHistory = [
    { id: 'INV-2026-10', date: 'Oct 01, 2026', amount: '₹1,999', plan: 'Growth Plan', status: 'Paid', method: 'UPI / Razorpay' },
    { id: 'INV-2026-09', date: 'Sep 01, 2026', amount: '₹1,999', plan: 'Growth Plan', status: 'Paid', method: 'UPI / Razorpay' },
    { id: 'INV-2026-08', date: 'Aug 01, 2026', amount: '₹1,999', plan: 'Growth Plan', status: 'Paid', method: 'UPI / Razorpay' },
  ];

  const handleDownloadInvoice = (invId) => {
    showToast(`Invoice ${invId} downloaded as PDF (Demo)!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Billing & Subscription Management
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Transparent pricing in INR (₹) designed for single outlets to multi-location regional chains.
          </p>
        </div>

        <button
          onClick={() => setUpgradeModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          <Zap className="w-4 h-4" />
          Change Plan
        </button>
      </div>

      <DemoNotice text="Simulated Billing: Subscription upgrades simulate instant activation with Razorpay test mode." />

      {/* Current Active Plan Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-xl p-5 sm:p-6 text-white shadow-[0_14px_32px_-14px_rgba(67,56,202,0.55)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Active Subscription
            </span>
            <span className="text-[10px] font-bold bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full">
              AUTO-RENEW ACTIVE
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            LocalBoost {currentPlanObj.name} Tier
          </h2>
          <p className="text-xs text-indigo-100/85 max-w-lg leading-relaxed">
            {currentPlanObj.description} Next billing date is <strong>December 01, 2026</strong> for ₹{currentPlanObj.monthlyPrice}/month.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl border border-white/10 shrink-0 space-y-2 min-w-[220px]">
          <div className="flex justify-between text-xs text-indigo-100/85">
            <span>AI Generations Quota</span>
            <span className="font-bold text-white">182 / 250 Used</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-300 to-white/90 h-full rounded-full" style={{ width: '72%' }} />
          </div>
          <span className="text-[10px] text-indigo-200/80 block">Renews automatically in 26 days</span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Available Subscription Plans</h3>
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-lg transition ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Annual <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-px rounded font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between relative ${
                  isCurrent
                    ? 'border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
                    : 'border-slate-200 shadow-card hover:border-slate-300 hover:shadow-card-hover'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-4">{plan.description}</p>

                  <div className="mb-5">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular">₹{price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (isCurrent) {
                      showToast('You are already subscribed to this plan!', 'info');
                    } else {
                      setUpgradeModalOpen(true);
                    }
                  }}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing & Invoice History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Billing History & GST Invoices</h3>
            <p className="text-xs text-slate-500">Download PDF tax invoices for your local business accounts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Invoice ID</th>
                <th className="px-5 py-3">Billing Date</th>
                <th className="px-5 py-3">Plan Details</th>
                <th className="px-5 py-3">Payment Method</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Invoice PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {billingHistory.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{inv.id}</td>
                  <td className="px-5 py-3.5 text-slate-600">{inv.date}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{inv.plan}</td>
                  <td className="px-5 py-3.5 text-slate-600">{inv.method}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{inv.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}
