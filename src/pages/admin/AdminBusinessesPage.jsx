import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import BusinessTable from '../../components/admin/BusinessTable';

const CATEGORIES = [
  'All',
  'Retail & Local Shops',
  'Food & Beverage',
  'Technology & Online',
  'Home & Construction',
  'Agriculture',
  'Education',
  'Beauty & Fashion',
  'Health & Fitness',
  'Transportation',
  'Tourism & Hospitality',
  'Manufacturing',
  'Events & Entertainment',
  'Professional Services',
  'Pet & Animal Services',
];

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // Deletion modal state
  const [deletingBusiness, setDeletingBusiness] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadBusinesses = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search,
        category: category !== 'All' ? category : '',
        status: status !== 'all' ? status : '',
        sortBy,
      };
      const data = await adminService.getBusinesses(params);
      setBusinesses(data?.businesses || []);
      setPagination(data?.pagination || { page, limit: 10, total: 0, pages: 1 });
    } catch (err) {
      showToast(err.message || 'Failed to fetch businesses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses(1);
  }, [category, status, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadBusinesses(1);
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await adminService.updateBusinessStatus(id, { status: newStatus });
      showToast(`Business idea status updated to "${newStatus}".`);
      loadBusinesses(pagination.page);
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBusiness) return;
    setDeleteLoading(true);
    try {
      await adminService.deleteBusiness(deletingBusiness._id);
      showToast(`Business idea "${deletingBusiness.name}" deleted from catalog.`);
      setDeletingBusiness(null);
      loadBusinesses(pagination.page);
    } catch (err) {
      showToast(err.message || 'Failed to delete business', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
            Business Ideas Management
          </h2>
          <p className="text-xs text-gray-400">
            Dynamically author, inspect, publish, edit, or archive businesses across the entire platform.
          </p>
        </div>

        <Link
          to="/admin/businesses/add"
          className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Business Idea</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search query input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business name, keywords, or target customer..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>

          {/* Category Select */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#0D0D0D] bg-white outline-hidden focus:border-[#FF6B00]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#0D0D0D] bg-white outline-hidden focus:border-[#FF6B00]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#0D0D0D] bg-white outline-hidden focus:border-[#FF6B00]"
          >
            <option value="createdAt">Newest First</option>
            <option value="name">Alphabetical</option>
            <option value="investment">Min Investment</option>
            <option value="profit">Operating Profit</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Table */}
      <BusinessTable
        businesses={businesses}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onDeleteClick={(biz) => setDeletingBusiness(biz)}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-[#0D0D0D]">{businesses.length}</span> of{' '}
          <span className="font-bold text-[#0D0D0D]">{pagination.total}</span> business ideas
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1 || loading}
            onClick={() => loadBusinesses(pagination.page - 1)}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#0D0D0D]">
            Page {pagination.page} of {pagination.pages || 1}
          </span>

          <button
            type="button"
            disabled={pagination.page >= pagination.pages || loading}
            onClick={() => loadBusinesses(pagination.page + 1)}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Deletion */}
      {deletingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0D0D0D]">
                Delete Business Idea?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to remove <strong className="text-[#0D0D0D]">{deletingBusiness.name}</strong> from the catalog? This will remove it from the public explore page and user recommendations.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeletingBusiness(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors cursor-pointer"
              >
                {deleteLoading ? 'Removing...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
