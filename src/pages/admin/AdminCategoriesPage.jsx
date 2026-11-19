import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Search, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add category modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [addingLoading, setAddingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data?.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setAddingLoading(true);
    setError(null);
    try {
      await adminService.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
      });
      setSuccess(`Category "${newCatName.trim()}" created successfully.`);
      setNewCatName('');
      setNewCatDesc('');
      setIsModalOpen(false);
      loadCategories();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setAddingLoading(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
            Business Categories & Taxonomy
          </h2>
          <p className="text-xs text-gray-400">
            Structure the platform industry taxonomy and monitor business model distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-gray-500">
          Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat) => (
            <div
              key={cat.name}
              className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center border border-[#1F1F1F]">
                    <FolderTree className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                    {cat.publishedCount || cat.count} Live Ideas
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0D0D0D] pt-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  slug: /{cat.slug}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500">
                  {cat.count} total registered
                </span>
                <Link
                  to={`/admin/businesses?category=${encodeURIComponent(cat.name)}`}
                  className="font-bold text-[#FF6B00] hover:underline inline-flex items-center gap-1"
                >
                  <span>Filter Catalog</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#0D0D0D]">Create New Industry Category</h3>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Clean Energy & Solar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief description of businesses within this category..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingLoading}
                  className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] shadow-md transition-colors cursor-pointer"
                >
                  {addingLoading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
