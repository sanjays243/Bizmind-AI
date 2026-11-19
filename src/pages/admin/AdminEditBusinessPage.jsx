import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import BusinessForm from '../../components/admin/BusinessForm';
import { adminService } from '../../services/admin.service';

export default function AdminEditBusinessPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [businessData, setBusinessData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBusiness = async () => {
      setLoadingInitial(true);
      setError(null);
      try {
        const data = await adminService.getBusinessById(id);
        if (isMounted) {
          setBusinessData(data?.business);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load business idea details.');
        }
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };

    fetchBusiness();
    return () => { isMounted = false; };
  }, [id]);

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await adminService.updateBusiness(id, formData);
      navigate('/admin/businesses', {
        state: { message: `Business idea "${formData.name}" successfully updated in MongoDB.` },
      });
    } catch (err) {
      setError(err.message || 'Failed to update business idea.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Fetching business record from MongoDB...</p>
      </div>
    );
  }

  if (error && !businessData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <h3 className="text-lg font-bold text-red-900">Unable to load business</h3>
        <p className="text-xs text-red-700">{error}</p>
        <Link
          to="/admin/businesses"
          className="inline-flex items-center gap-2 py-2 px-4 bg-[#0D0D0D] text-white text-xs font-bold rounded-xl"
        >
          Return to Business Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          to="/admin/businesses"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FF6B00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
          <span>Back to Business Catalog</span>
        </Link>
        <span className="text-xs font-semibold text-gray-400">
          Admin / Businesses / <strong className="text-[#0D0D0D]">Edit: {businessData?.name}</strong>
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
          Edit Business Model
        </h2>
        <p className="text-xs text-gray-500">
          Modify financial estimates, market opportunity rating, or publishing status. Changes persist directly to the database and update public exploration.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
          ⚠️ {error}
        </div>
      )}

      <BusinessForm
        initialData={businessData}
        isEdit={true}
        loading={submitting}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
