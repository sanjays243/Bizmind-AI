import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsersPage() {
  const { currentUser: authAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Confirmation Modals
  const [roleActionUser, setRoleActionUser] = useState(null);
  const [statusActionUser, setStatusActionUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search,
        role: roleFilter !== 'all' ? roleFilter : '',
        status: statusFilter !== 'all' ? statusFilter : '',
      };
      const data = await adminService.getUsers(params);
      setUsers(data?.users || []);
      setPagination(data?.pagination || { page, limit: 10, total: 0, pages: 1 });
    } catch (err) {
      showToast(err.message || 'Failed to load user records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers(1);
  };

  const handleToggleStatus = async () => {
    if (!statusActionUser) return;
    setActionLoading(true);
    try {
      const newStatus = !statusActionUser.isActive;
      await adminService.updateUserStatus(statusActionUser._id, newStatus);
      showToast(`User ${statusActionUser.email} has been ${newStatus ? 'activated' : 'deactivated'}.`);
      setStatusActionUser(null);
      loadUsers(pagination.page);
    } catch (err) {
      showToast(err.message || 'Error updating user status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRole = async () => {
    if (!roleActionUser) return;
    setActionLoading(true);
    try {
      const newRole = roleActionUser.role === 'admin' ? 'user' : 'admin';
      await adminService.updateUserRole(roleActionUser._id, newRole);
      showToast(`User ${roleActionUser.email} role updated to "${newRole}".`);
      setRoleActionUser(null);
      loadUsers(pagination.page);
    } catch (err) {
      showToast(err.message || 'Error updating user role', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border animate-fade-in ${
            toastMessage.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
          Registered Users Management
        </h2>
        <p className="text-xs text-gray-400">
          Supervise user accounts, monitor business ownership, activate/deactivate accounts, and adjust roles with audit logging.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user name, email, or business entity..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#0D0D0D] bg-white outline-hidden focus:border-[#FF6B00]"
          >
            <option value="all">All Roles</option>
            <option value="user">User (Standard)</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#0D0D0D] bg-white outline-hidden focus:border-[#FF6B00]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="deactivated">Deactivated</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-gray-500">
            Loading user directory...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No registered users match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F4F5] border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Businesses Owned</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const isSelf = authAdmin?._id === user._id;
                  const isAdmin = user.role === 'admin';

                  return (
                    <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0D0D0D] text-[#FF6B00] font-black flex items-center justify-center text-xs shrink-0">
                            {user.firstName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-[#0D0D0D] block truncate">
                              {user.fullName || `${user.firstName} ${user.lastName}`}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] text-[#FF6B00] font-bold">
                                (You / Current Session)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-xs font-medium text-gray-600">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isAdmin
                              ? 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </td>

                      {/* Businesses Owned */}
                      <td className="py-3 px-4 text-xs font-semibold text-[#0D0D0D]">
                        {user.businessesOwned || 0} business profiles
                      </td>

                      {/* Registered Date */}
                      <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            user.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* View details */}
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0D0D0D] hover:bg-gray-100 transition-colors"
                            title="Inspect User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Role Toggle button */}
                          <button
                            type="button"
                            onClick={() => setRoleActionUser(user)}
                            className="px-2 py-1 rounded-lg text-[11px] font-bold border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                            title="Change Role"
                          >
                            {isAdmin ? 'Demote' : 'Promote Admin'}
                          </button>

                          {/* Status Activate / Deactivate */}
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => setStatusActionUser(user)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              isSelf
                                ? 'opacity-30 cursor-not-allowed text-gray-400'
                                : user.isActive
                                ? 'text-red-500 hover:bg-red-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={isSelf ? 'Cannot deactivate self' : user.isActive ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-[#0D0D0D]">{users.length}</span> of{' '}
          <span className="font-bold text-[#0D0D0D]">{pagination.total}</span> registered accounts
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1 || loading}
            onClick={() => loadUsers(pagination.page - 1)}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#0D0D0D]">
            Page {pagination.page} of {pagination.pages || 1}
          </span>

          <button
            type="button"
            disabled={pagination.page >= pagination.pages || loading}
            onClick={() => loadUsers(pagination.page + 1)}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Role Change */}
      {roleActionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center border border-[#FF6B00]/20">
              <Shield className="w-6 h-6 text-[#FF6B00]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0D0D0D]">
                Change User Role Privilege?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You are about to change the role for <strong className="text-[#0D0D0D]">{roleActionUser.email}</strong> from <span className="font-bold uppercase text-gray-700">{roleActionUser.role}</span> to <span className="font-bold uppercase text-[#FF6B00]">{roleActionUser.role === 'admin' ? 'user' : 'admin'}</span>. This administrative action will be recorded in the security audit log.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setRoleActionUser(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleToggleRole}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#0D0D0D] hover:bg-black shadow-md transition-colors cursor-pointer"
              >
                {actionLoading ? 'Updating Role...' : 'Confirm Role Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Status (Activate / Deactivate) */}
      {statusActionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0D0D0D]">
                {statusActionUser.isActive ? 'Deactivate Account?' : 'Reactivate Account?'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {statusActionUser.isActive
                  ? `Deactivating ${statusActionUser.email} will revoke their login sessions and prevent API access.`
                  : `Reactivating ${statusActionUser.email} will restore normal platform access.`}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setStatusActionUser(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleToggleStatus}
                className={`py-2.5 px-5 rounded-xl text-xs font-bold text-white shadow-md transition-colors cursor-pointer ${
                  statusActionUser.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {actionLoading ? 'Updating...' : statusActionUser.isActive ? 'Confirm Deactivation' : 'Confirm Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
