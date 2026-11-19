import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import BusinessDetail from '../components/explore/BusinessDetail';
import { businessService } from '../services/business.service';
import { BUSINESSES_DATA } from '../data/businessesData';

export default function BusinessDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBusiness = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await businessService.getPublicBusinessBySlug(slug);
        if (isMounted && res?.business) {
          setBusiness(res.business);
          return;
        }
      } catch (apiErr) {
        // Fallback to local hardcoded database if backend is offline
        const localMatch = BUSINESSES_DATA.find(
          (b) => b.slug === slug || b.id === slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
        );
        if (isMounted) {
          if (localMatch) {
            setBusiness(localMatch);
          } else {
            setError(`Business idea "${slug}" could not be found or is not currently published.`);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBusiness();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Loading business opportunity intelligence...
        </p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-[70vh] bg-[#F4F4F5] flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0D0D0D]">Business Opportunity Not Found</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {error || 'This business model might be in draft mode or archived by administrators.'}
          </p>
          <Link
            to="/businesses"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
            <span>Return to Explore Businesses</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Header */}
      <div className="bg-[#F4F4F5]/80 border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/businesses"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0D0D0D] hover:text-[#FF6B00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
            <span>← Back to All Business Ideas</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span>Explore</span>
            <span>/</span>
            <span className="text-[#FF6B00] font-bold truncate max-w-[150px] sm:max-w-none">
              {business.name}
            </span>
          </div>
        </div>
      </div>

      <main className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BusinessDetail
          business={business}
          onBack={() => navigate('/businesses')}
          onGetStarted={() => navigate('/register')}
        />
      </main>
    </div>
  );
}
