import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  User,
  Users,
  Bell,
  Shield,
  Key,
  Check,
  Plus,
  Trash2,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import DemoNotice from '../components/common/DemoNotice';

export default function Settings() {
  const { selectedBusiness, updateBusiness } = useBusiness();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('business'); // 'business' | 'account' | 'team' | 'notifications' | 'security'

  // Business Profile Form
  const [bizForm, setBizForm] = useState({
    name: selectedBusiness?.name || '',
    category: selectedBusiness?.category || '',
    phone: selectedBusiness?.phone || '',
    city: selectedBusiness?.city || '',
    address: selectedBusiness?.address || '',
    gstin: '09AAECR1234D1Z2',
    timezone: 'Asia/Kolkata (IST +5:30)'
  });

  // Team members
  const [team, setTeam] = useState([
    { id: 'tm-1', name: 'Shivam Gupta', email: 'shivam.marketing@gmail.com', role: 'Owner / Admin', avatar: 'SG' },
    { id: 'tm-2', name: 'Ramesh Sharma', email: 'ramesh.manager@gmail.com', role: 'Location Manager', avatar: 'RS' },
    { id: 'tm-3', name: 'Pooja Verma', email: 'pooja.social@gmail.com', role: 'Marketing Editor', avatar: 'PV' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Marketing Editor');

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    criticalReviews: true,
    weeklyDigest: true,
    whatsappAlerts: true,
    rankChanges: true,
    promotions: false
  });

  // Security
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSaveBusiness = (e) => {
    e.preventDefault();
    updateBusiness(selectedBusiness.id, {
      name: bizForm.name,
      category: bizForm.category,
      phone: bizForm.phone,
      city: bizForm.city,
      address: bizForm.address
    });
    showToast('Business profile settings saved!', 'success');
  };

  const handleInviteTeam = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = {
      id: `tm-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.substring(0, 2).toUpperCase()
    };
    setTeam([...team, newMember]);
    setInviteEmail('');
    showToast(`Team invitation sent to ${inviteEmail}! (Simulated)`, 'success');
  };

  const handleRemoveMember = (id) => {
    setTeam(team.filter(t => t.id !== id));
    showToast('Member removed from team access', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-600" />
            Workspace & Account Settings
          </h1>
          <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed mt-0.5">
            Configure business information, team member roles, notification alerts, and API security.
          </p>
        </div>
      </div>

      <DemoNotice text="Simulated Settings: Preferences and team permissions persist in browser localStorage." />

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs (3 Cols) */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'business', label: 'Business Profile', icon: Store },
            { id: 'account', label: 'Admin Account', icon: User },
            { id: 'team', label: 'Team Management', icon: Users, badge: team.length },
            { id: 'notifications', label: 'Notification Alerts', icon: Bell },
            { id: 'security', label: 'Security & 2FA', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-soft'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-px rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Pane (9 Cols) */}
        <div className="lg:col-span-9 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft">
          {activeTab === 'business' && (
            <form onSubmit={handleSaveBusiness} className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Business Profile & Tax Settings</h3>
                <p className="text-xs text-slate-500">Official listing parameters for {selectedBusiness?.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Business Name</label>
                  <input
                    type="text"
                    value={bizForm.name}
                    onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={bizForm.category}
                    onChange={(e) => setBizForm({ ...bizForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={bizForm.phone}
                    onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">City / Region</label>
                  <input
                    type="text"
                    value={bizForm.city}
                    onChange={(e) => setBizForm({ ...bizForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Physical Address</label>
                  <input
                    type="text"
                    value={bizForm.address}
                    onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GSTIN Number (India)</label>
                  <input
                    type="text"
                    value={bizForm.gstin}
                    onChange={(e) => setBizForm({ ...bizForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Operating Timezone</label>
                  <input
                    type="text"
                    disabled
                    value={bizForm.timezone}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-soft transition"
                >
                  Save Business Profile
                </button>
              </div>
            </form>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Personal Admin Account</h3>
                <p className="text-xs text-slate-500">Manage credentials for the master LocalBoost AI account</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xl flex items-center justify-center shadow-soft">
                  SG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Shivam Gupta</h4>
                  <p className="text-xs text-slate-500">shivam.marketing@gmail.com</p>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mt-1 inline-block">
                    Super Admin
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Display Name</label>
                  <input
                    type="text"
                    defaultValue="Shivam Gupta"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Admin Email</label>
                  <input
                    type="email"
                    defaultValue="shivam.marketing@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => showToast('Account details updated!', 'success')}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-soft transition"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Team Members & Role Access</h3>
                <p className="text-xs text-slate-500">Grant permissions to restaurant managers, floor staff, or marketing agencies</p>
              </div>

              {/* Invite Form */}
              <form onSubmit={handleInviteTeam} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="colleague@gmail.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Location Manager">Location Manager</option>
                  <option value="Marketing Editor">Marketing Editor</option>
                  <option value="Read-Only Analyst">Read-Only Analyst</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shrink-0"
                >
                  Invite Member
                </button>
              </form>

              {/* Members List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {team.map((member) => (
                  <div key={member.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{member.name}</div>
                        <div className="text-[11px] text-slate-400">{member.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {member.role}
                      </span>
                      {member.role !== 'Owner / Admin' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Notification Preferences</h3>
                <p className="text-xs text-slate-500">Configure alert thresholds for urgent customer reviews and ranking shifts</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'criticalReviews', label: '1 & 2 Star Negative Review Alerts', desc: 'Instant WhatsApp & Email ping when a dissatisfied rating is posted.' },
                  { key: 'weeklyDigest', label: 'Weekly Performance Report Summary', desc: 'PDF summary of calls, direction requests, and views sent Monday 8 AM.' },
                  { key: 'whatsappAlerts', label: 'WhatsApp Lead Notifications', desc: 'Notify floor staff when customers click "Call" or request reservation info.' },
                  { key: 'rankChanges', label: 'Local 3-Pack Google Rank Movement', desc: 'Notify when tracked keywords gain or drop 2+ positions on Google Maps.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-3 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={notifPrefs[item.key]}
                        onChange={(e) => {
                          setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked });
                          showToast('Notification preference updated!', 'info');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">Security & Access Tokens</h3>
                <p className="text-xs text-slate-500">Two-factor authentication and Google Business Profile API keys</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Protect client profiles with SMS or Google Authenticator OTP</p>
                </div>
                <button
                  onClick={() => {
                    setTwoFactor(!twoFactor);
                    showToast(twoFactor ? '2FA disabled (Demo)' : '2FA enabled with SMS verification!', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    twoFactor ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {twoFactor ? 'Active (Protected)' : 'Enable 2FA'}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase">LocalBoost Public Client API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="lb_live_839210938491823901"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-600"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('lb_live_839210938491823901');
                      showToast('API key copied to clipboard!', 'info');
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Copy Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

