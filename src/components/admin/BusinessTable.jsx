import React from 'react';
import { Eye, Edit3, Trash2, CheckCircle2, XCircle, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BusinessTable({
  businesses = [],
  loading = false,
  onToggleStatus,
  onDeleteClick,
}) {
  if (loading) {
    return (
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-12 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-500">Loading catalog business records...</p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
          <Eye className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-[#0D0D0D]">No business ideas found</h4>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, filter criteria, or click "Add Business Idea" to register a new opportunity.
          </p>
        </div>
        <Link
          to="/admin/businesses/add"
          className="inline-flex items-center gap-2 py-2 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Add Business Idea
        </Link>
      </div>
    );
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Moderate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F4F4F5] border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
            <tr>
              <th className="py-3.5 px-4">Business</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Investment Range</th>
              <th className="py-3.5 px-4">Difficulty</th>
              <th className="py-3.5 px-4">Risk Level</th>
              <th className="py-3.5 px-4">Profit Potential</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Created</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses.map((biz) => {
              const isPublished = biz.status === 'published';
              const isDraft = biz.status === 'draft';

              return (
                <tr key={biz._id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Image & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={biz.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80'}
                        alt={biz.name}
                        className="w-11 h-11 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#0D0D0D] truncate block">
                            {biz.name}
                          </span>
                          {biz.isFeatured && (
                            <Star className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00] shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400 block truncate">
                          /{biz.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F4F4F5] text-gray-700 border border-gray-200">
                      {biz.category}
                    </span>
                  </td>

                  {/* Investment Range */}
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-bold text-[#0D0D0D]">
                      {formatCurrency(biz.investmentMin)} – {formatCurrency(biz.investmentMax)}
                    </div>
                    <span className="text-[10px] text-gray-400 block">Est. Capital</span>
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${getDifficultyColor(biz.difficulty)}`}>
                      {biz.difficulty || 'Moderate'}
                    </span>
                  </td>

                  {/* Risk Level */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${getRiskColor(biz.riskLevel)}`}>
                      {biz.riskLevel || 'Medium'}
                    </span>
                  </td>

                  {/* Profit Potential */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-xs text-emerald-700">
                      {biz.profitPotential || 'High'}
                    </span>
                    {biz.estimatedProfitMargin > 0 && (
                      <span className="text-[10px] text-gray-400 block">
                        ~{biz.estimatedProfitMargin}% margin
                      </span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus && onToggleStatus(biz._id, isPublished ? 'draft' : 'published')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                    {biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : 'N/A'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View on Public Site */}
                      <Link
                        to={`/businesses/${biz.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#0D0D0D] hover:bg-gray-100 transition-colors"
                        title="View Public Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>

                      {/* Edit */}
                      <Link
                        to={`/admin/businesses/edit/${biz._id}`}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors"
                        title="Edit Business"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteClick && onDeleteClick(biz)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Business Idea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
