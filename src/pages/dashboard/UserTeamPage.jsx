import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Trash2, Shield, Eye, Calculator,
  RefreshCw, AlertCircle, CheckCircle2, Crown, Mail,
  ChevronDown, Loader2
} from 'lucide-react';
import { businessService } from '../../services/business.service';

const ROLE_CONFIG = {
  owner: { label: 'Owner', color: 'bg-[#FF6B00]/15 text-[#FF6B00]', icon: Crown },
  accountant: { label: 'Accountant', color: 'bg-blue-500/15 text-blue-400', icon: Calculator },
  staff: { label: 'Staff', color: 'bg-purple-500/15 text-purple-400', icon: Users },
  viewer: { label: 'Viewer', color: 'bg-gray-500/15 text-gray-400', icon: Eye },
};

const STATUS_CONFIG = {
  invited: { label: 'Invited', color: 'bg-yellow-500/10 text-yellow-400' },
  active: { label: 'Active', color: 'bg-green-500/10 text-green-400' },
};

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.viewer;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.invited;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function UserTeamPage() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bizLoading, setBizLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [invite, setInvite] = useState({ email: '', firstName: '', lastName: '', role: 'viewer' });

  // Load user businesses
  useEffect(() => {
    setBizLoading(true);
    businessService.getMyBusinesses()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.businesses || []);
        setBusinesses(list);
        if (list.length > 0) setSelectedBiz(list[0]);
      })
      .catch(() => setError('Could not load businesses.'))
      .finally(() => setBizLoading(false));
  }, []);

  // Load team when business changes
  useEffect(() => {
    if (!selectedBiz?._id) return;
    loadTeam(selectedBiz._id);
  }, [selectedBiz]);

  const loadTeam = async (bizId) => {
    setLoading(true);
    setError('');
    try {
      const data = await businessService.getTeam(bizId);
      setTeam(data?.collaborators || data || []);
    } catch (err) {
      // Offline/dev mode — show empty state gracefully
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!invite.email || !invite.firstName) {
      setError('Email and first name are required.');
      return;
    }
    setInviting(true);
    setError('');
    setSuccess('');
    try {
      await businessService.inviteTeamMember(selectedBiz._id, invite);
      setSuccess(`Invitation sent to ${invite.email}!`);
      setInvite({ email: '', firstName: '', lastName: '', role: 'viewer' });
      setShowInviteForm(false);
      await loadTeam(selectedBiz._id);
    } catch (err) {
      setError(err.message || 'Failed to send invite.');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId, memberEmail) => {
    if (!window.confirm(`Remove ${memberEmail} from the team?`)) return;
    setRemoving(memberId);
    setError('');
    try {
      await businessService.removeTeamMember(selectedBiz._id, memberId);
      setTeam(prev => prev.filter(m => m._id !== memberId));
      setSuccess('Team member removed.');
    } catch (err) {
      setError(err.message || 'Failed to remove member.');
    } finally {
      setRemoving(null);
    }
  };

  const clearMessages = () => { setError(''); setSuccess(''); };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0D0D0D] flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#FF6B00]" />
            Team & Access
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage collaborators and permissions for your business</p>
        </div>

        {/* Business Selector */}
        {businesses.length > 1 && (
          <div className="relative">
            <select
              value={selectedBiz?._id || ''}
              onChange={e => {
                const biz = businesses.find(b => b._id === e.target.value);
                setSelectedBiz(biz);
                clearMessages();
              }}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 cursor-pointer"
            >
              {businesses.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {bizLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
        </div>
      ) : !selectedBiz ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-500">No businesses found</p>
          <p className="text-sm text-gray-400 mt-1">Create a business first to manage team access.</p>
        </div>
      ) : (
        <>
          {/* Business Context Banner */}
          <div className="bg-[#0D0D0D] rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Managing Team For</p>
              <h2 className="text-lg font-extrabold text-white">{selectedBiz.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{selectedBiz.industry || 'Business'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadTeam(selectedBiz._id)}
                className="p-2 rounded-xl bg-[#1F1F1F] text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setShowInviteForm(!showInviteForm); clearMessages(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#E05300] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
            </div>
          </div>

          {/* Invite Form */}
          {showInviteForm && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-[#0D0D0D] mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#FF6B00]" />
                Invite a Collaborator
              </h3>
              <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    value={invite.firstName}
                    onChange={e => setInvite(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="Jane"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 placeholder:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={invite.lastName}
                    onChange={e => setInvite(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Smith"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={invite.email}
                    onChange={e => setInvite(p => ({ ...p, email: e.target.value }))}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 placeholder:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Role</label>
                  <div className="relative">
                    <select
                      value={invite.role}
                      onChange={e => setInvite(p => ({ ...p, role: e.target.value }))}
                      className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 cursor-pointer"
                    >
                      <option value="accountant">Accountant — Full financial access</option>
                      <option value="staff">Staff — Transactions only</option>
                      <option value="viewer">Viewer — Read only</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05300] disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer"
                  >
                    {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    {inviting ? 'Sending…' : 'Send Invitation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowInviteForm(false); clearMessages(); }}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Owner Row */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-extrabold text-[#0D0D0D]">Team Members</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Owner (always shown) */}
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] font-black flex items-center justify-center text-sm shrink-0">
                    {selectedBiz.owner?.firstName?.charAt(0) || selectedBiz.ownerName?.charAt(0) || 'O'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0D0D0D] truncate">
                      {selectedBiz.owner?.firstName
                        ? `${selectedBiz.owner.firstName} ${selectedBiz.owner.lastName || ''}`.trim()
                        : selectedBiz.ownerName || 'Business Owner'}
                      <span className="ml-2 text-[11px] font-semibold text-gray-400">(you)</span>
                    </p>
                    <p className="text-xs text-gray-400 truncate">{selectedBiz.owner?.email || selectedBiz.ownerEmail || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <RoleBadge role="owner" />
                  <StatusBadge status="active" />
                </div>
              </div>

              {/* Collaborators */}
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
                </div>
              ) : team.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Shield className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="font-bold text-gray-400 text-sm">No collaborators yet</p>
                  <p className="text-xs text-gray-300 mt-1">Invite accountants, staff, or viewers to collaborate on this business.</p>
                </div>
              ) : (
                team.map(member => (
                  <div key={member._id} className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 font-black flex items-center justify-center text-sm shrink-0">
                        {member.firstName?.charAt(0) || member.email?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#0D0D0D] truncate">
                          {member.firstName ? `${member.firstName} ${member.lastName || ''}`.trim() : member.email}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <RoleBadge role={member.role} />
                      <StatusBadge status={member.status || 'invited'} />
                      <button
                        onClick={() => handleRemove(member._id, member.email)}
                        disabled={removing === member._id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Remove member"
                      >
                        {removing === member._id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Permission Guide */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#0D0D0D] mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF6B00]" />
              Role Permissions Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  role: 'accountant',
                  perms: ['View & edit transactions', 'Create invoices', 'View P&L reports', 'Manage budgets'],
                },
                {
                  role: 'staff',
                  perms: ['Add transactions', 'View dashboard', 'Scan receipts', 'No financial reports'],
                },
                {
                  role: 'viewer',
                  perms: ['View dashboard only', 'Read-only access', 'No edits allowed', 'Ideal for advisors'],
                },
              ].map(({ role, perms }) => {
                const cfg = ROLE_CONFIG[role];
                const Icon = cfg.icon;
                return (
                  <div key={role} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {perms.map(p => (
                        <li key={p} className="text-xs text-gray-500 flex items-start gap-1.5">
                          <span className="text-[#FF6B00] font-black mt-0.5">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

