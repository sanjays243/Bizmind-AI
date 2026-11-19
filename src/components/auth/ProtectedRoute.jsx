import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin" />
        <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement (e.g. requiredRole === 'admin')
  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4">
        <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl max-w-md w-full p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wider">
              Access Denied (403)
            </span>
            <h2 className="text-2xl font-bold text-[#0D0D0D]">
              Administrator Privileges Required
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your account (<span className="font-semibold text-[#0D0D0D]">{currentUser?.email}</span>) is assigned the <span className="font-bold text-[#FF6B00]">"{currentUser?.role}"</span> role. This management console is strictly restricted to verified system administrators.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0D0D0D] hover:bg-black text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
              Return to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
