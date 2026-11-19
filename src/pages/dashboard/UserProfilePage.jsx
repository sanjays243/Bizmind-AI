import React, { useState } from 'react';
import { User, Mail, Phone, Building2, Lock, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

export default function UserProfilePage() {
  const { currentUser, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [businessName, setBusinessName] = useState(currentUser?.businessProfile?.businessName || '');
  const [industry, setIndustry] = useState(currentUser?.businessProfile?.industry || '');

  // Password update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await apiRequest('/v1/users/profile', {
        method: 'PUT',
        body: {
          firstName,
          lastName,
          phone,
          businessProfile: {
            businessName,
            industry,
          },
        },
      });
      await refreshUser();
      setMsg({ type: 'success', text: 'Profile details saved successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    setSaving(true);
    setMsg(null);
    try {
      await apiRequest('/v1/users/update-password', {
        method: 'PUT',
        body: { currentPassword, newPassword },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
          Account & Profile Settings
        </h2>
        <p className="text-xs text-gray-400">
          Manage your personal founder credentials, legal entity details, and security passwords.
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-2 ${
            msg.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {msg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Profile Details Form */}
      <form onSubmit={handleProfileSave} className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-[#0D0D0D]">Personal & Business Information</h3>
          <p className="text-xs text-gray-400">Basic contact and primary legal entity identifiers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Business / Legal Entity Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Apex Retail Solutions LLC"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Primary Industry Sector
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Food & Beverage"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#FF6B00]" />
            <span>{saving ? 'Saving...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>

      {/* Password Update Form */}
      <form onSubmit={handlePasswordChange} className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-[#0D0D0D]">Change Account Password</h3>
          <p className="text-xs text-gray-400">Ensure your account uses a strong, secure passphrase</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              New Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0D0D0D] border border-gray-200 text-xs font-bold transition-all cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
