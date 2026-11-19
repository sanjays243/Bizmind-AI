import React from 'react';
import { ArrowLeft } from 'lucide-react';
import BusinessExplorer from '../components/explore/BusinessExplorer';

/**
 * Explore Businesses Page
 * 
 * Strict Design System:
 * - Rich Black: #0D0D0D
 * - White: #FFFFFF
 * - Orange: #FF6B00
 * - Dark Border: #1F1F1F
 * - Light Gray: #F4F4F5
 * - Font: Inter
 */
export default function ExploreBusinessesPage({ onBackToHome, onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D0D0D] flex flex-col font-sans selection:bg-[#FF6B00]/20 selection:text-[#FF6B00]">
      {/* ─── Breadcrumb Navigation Header ─────────────────────────────── */}
      <div className="bg-[#F4F4F5]/80 border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0D0D0D] hover:text-[#FF6B00] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
            <span>← Back to Home Overview</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span>Platform Hub</span>
            <span>/</span>
            <span className="text-[#FF6B00] font-bold">Explore Business Ideas</span>
          </div>
        </div>
      </div>

      {/* ─── Main Business Explorer Experience ────────────────────────── */}
      <main className="flex-1">
        <BusinessExplorer onGetStarted={onGetStarted} />
      </main>
    </div>
  );
}
