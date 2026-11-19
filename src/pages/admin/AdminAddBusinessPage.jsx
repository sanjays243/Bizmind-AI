import React, { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BusinessForm from '../../components/admin/BusinessForm';
import { adminService } from '../../services/admin.service';

export default function AdminAddBusinessPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleCreateBusiness = async (formData) => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await adminService.createBusiness(formData);
      navigate('/admin/businesses', {
        state: { message: `Business idea "${formData.name}" created and published successfully!` },
      });
    } catch (err) {
      console.error('Error creating business:', err);
      setServerError(err.message || 'Failed to save business idea to database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          to="/admin/businesses"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FF6B00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
          <span>Back to Business Catalog</span>
        </Link>
        <span className="text-xs font-semibold text-gray-400">
          Admin / Businesses / <strong className="text-[#0D0D0D]">Create Idea</strong>
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
          Create New Business Opportunity
        </h2>
        <p className="text-xs text-gray-500">
          Populate full operating parameters, startup cost breakdowns, revenue estimates, and strategic intelligence.
        </p>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
          ⚠️ Server Error: {serverError}
        </div>
      )}

      {/* Main Form */}
      <BusinessForm
        isEdit={false}
        loading={loading}
        onSubmit={handleCreateBusiness}
      />
    </div>
  );
}
