import React from 'react';
import WhyBizMind from '../components/WhyBizMind';
import { ArrowLeft, Sparkles } from 'lucide-react';

/**
 * WhyBizMindPage Component
 * Dedicated standalone page for "Why BizMind"
 * URL: http://localhost:3000/#problem
 */
export default function WhyBizMindPage({
  onBackToHome,
  onExploreBizMind,
  onExploreIdeas,
}) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D0D0D] flex flex-col font-sans selection:bg-[#FF6B00]/20 selection:text-[#FF6B00]">
      {/* Breadcrumb / Back to Home navigation header */}
      <div className="bg-[#F4F4F5]/80 border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0D0D0D] hover:text-[#FF6B00] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
            <span>← Back to Home Overview</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span>Platform</span>
            <span>/</span>
            <span className="text-[#FF6B00] font-bold">Why BizMind</span>
          </div>
        </div>
      </div>

      {/* Main Content Component */}
      <main className="flex-1">
        <WhyBizMind
          onExploreBizMind={onExploreBizMind}
          onExploreIdeas={onExploreIdeas}
        />
      </main>

      {/* Dedicated Page Footer */}
      <footer className="border-t border-gray-200 py-10 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D0D0D]">
              BizMind <span className="text-[#FF6B00]">AI</span>
            </span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onBackToHome}
              className="hover:text-[#FF6B00] transition-colors cursor-pointer"
            >
              Home
            </button>
            <a href="#solutions" className="hover:text-[#FF6B00] transition-colors">
              Solutions
            </a>
            <a href="#calculator" className="hover:text-[#FF6B00] transition-colors">
              Calculator
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
