import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Briefcase,
  Calendar,
  Building2,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { adminService } from '../../services/admin.service';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getUserById(id);
        if (isMounted) {
          setUserData(data?.user);
          setBusinesses(data?.businesses || []);
          setActivity(data?.activity || []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch user record.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Inspecting user profile in database...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-4">
        <h3 className="text-lg font-bold text-red-900">User Not Found</h3>
        <p className="text-xs text-red-700">{error || 'Requested user does not exist.'}</p>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 py-2 px-4 bg-[#0D0D0D] text-white text-xs font-bold rounded-xl"
        >
          Return to User Management
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FF6B00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
          <span>Back to Users Directory</span>
        </Link>
        <span className="text-xs font-semibold text-gray-400">
          Admin / Users / <strong className="text-[#0D0D0D]">{userData.email}</strong>
        </span>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D0D0D] text-[#FF6B00] font-black flex items-center justify-center text-2xl border border-[#1F1F1F] shadow-sm">
              {userData.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0D0D0D]">
                  {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    userData.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {userData.isActive ? 'Active Account' : 'Deactivated'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#F4F4F5] border border-gray-200 text-xs font-bold text-[#0D0D0D] uppercase">
              Role: <strong className="text-[#FF6B00]">{userData.role}</strong>
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block">Registration Date</span>
            <span className="font-semibold text-[#0D0D0D] block mt-1">
              {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A'}
            </span>
          </div>

          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block">Phone Number</span>
            <span className="font-semibold text-[#0D0D0D] block mt-1">
              {userData.phone || 'Not provided'}
            </span>
          </div>

          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block">Registered Entity</span>
            <span className="font-semibold text-[#0D0D0D] block mt-1">
              {userData.businessProfile?.businessName || 'None assigned'}
            </span>
          </div>

          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block">Total Logins</span>
            <span className="font-semibold text-[#0D0D0D] block mt-1">
              {userData.loginCount || 1} session logins
            </span>
          </div>
        </div>
      </div>

      {/* User's Owned Businesses */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-[#0D0D0D]">Associated Owned Businesses</h3>
          <p className="text-xs text-gray-400">Businesses tracked directly by this user in their workspace</p>
        </div>

        {businesses.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">User has not created any business workspace profiles yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {businesses.map((b) => (
              <div key={b._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#0D0D0D]">{b.name}</h4>
                  <span className="text-gray-400">Type: {b.type} • Slug: /{b.slug}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">
                    Health Score: {b.metrics?.healthScore || 80}/100
                  </span>
                  <span className="text-gray-400">Created: {new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
