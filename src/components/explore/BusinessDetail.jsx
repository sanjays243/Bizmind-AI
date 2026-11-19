import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  DollarSign,
  TrendingUp,
  Scale,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Share2,
  Printer,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

import BusinessOverview from './BusinessOverview';
import StartupPlan from './StartupPlan';
import InvestmentBreakdown from './InvestmentBreakdown';
import ExpenseBreakdown from './ExpenseBreakdown';
import ProfitAnalysis from './ProfitAnalysis';
import BreakEvenAnalysis from './BreakEvenAnalysis';
import RiskAnalysis from './RiskAnalysis';
import MarketingStrategy from './MarketingStrategy';
import AIRecommendation from './AIRecommendation';
import WhatIfSimulator from './WhatIfSimulator';

export default function BusinessDetail({ business, onBack, onGetStarted }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [business]);

  if (!business) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const tabs = [
    { id: 'overview', label: '1. Overview & Location' },
    { id: 'startup-plan', label: '2. Step-by-Step Plan' },
    { id: 'investment', label: '3. Startup Capital Breakdown' },
    { id: 'expenses', label: '4. Monthly Expenses' },
    { id: 'profit', label: '5. Revenue & Profit Model' },
    { id: 'break-even', label: '6. Break-Even Payback' },
    { id: 'risks-marketing', label: '7. Risks, Advantages & Marketing' },
    { id: 'ai-recommendation', label: '8. BizMind AI Recommendation' },
    { id: 'simulator', label: '9. What-If Business Simulator' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ─── Breadcrumb & Back Action Bar ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-[#0D0D0D] hover:text-[#FF6B00] hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
          <span>← Back to All Business Models</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline">Category:</span>
          <span className="text-xs font-bold text-[#0D0D0D] bg-gray-100 px-3 py-1 rounded-full">
            {business.category}
          </span>
        </div>
      </div>

      {/* ─── DETAIL HERO HEADER ───────────────────────────────────────── */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-3xl overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Text & Key Specs */}
          <div className="p-6 sm:p-10 lg:w-7/12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0D0D0D] text-white">
                  {business.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#FF6B00] border border-orange-200">
                  {business.difficulty} Effort
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                  {business.riskLevel} Risk Profile
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#0D0D0D] text-[#FF6B00]">
                  <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                  <span>AI Score {business.aiRecommendation?.score || 85}/100</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight leading-tight">
                {business.name}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {business.shortDescription}
              </p>
            </div>

            {/* Financial Highlights Pill Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F4F4F5] border border-gray-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Est. Investment</span>
                <p className="text-xs sm:text-sm font-black text-[#0D0D0D]">
                  {formatCurrency(business.investmentMin)} – {formatCurrency(business.investmentMax)}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Est. Monthly Profit</span>
                <p className="text-xs sm:text-sm font-black text-[#FF6B00]">
                  {formatCurrency(business.profitEstimate?.potentialOperatingProfit)} / mo
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Break-Even Time</span>
                <p className="text-xs sm:text-sm font-black text-[#0D0D0D]">
                  {business.breakEvenEstimate?.estimatedBreakEvenPoint}
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:w-5/12 min-h-[260px] lg:min-h-auto relative bg-gray-100 overflow-hidden">
            <img
              src={business.image}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="border-t border-gray-200 bg-[#F4F4F5]/60 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0D0D0D] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#0D0D0D] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── TAB CONTENT PANELS ───────────────────────────────────────── */}
      <div className="transition-all duration-200">
        {activeTab === 'overview' && <BusinessOverview business={business} />}
        {activeTab === 'startup-plan' && <StartupPlan business={business} />}
        {activeTab === 'investment' && <InvestmentBreakdown business={business} />}
        {activeTab === 'expenses' && <ExpenseBreakdown business={business} />}
        {activeTab === 'profit' && <ProfitAnalysis business={business} />}
        {activeTab === 'break-even' && <BreakEvenAnalysis business={business} />}
        {activeTab === 'risks-marketing' && (
          <div className="space-y-8">
            <RiskAnalysis business={business} />
            <MarketingStrategy business={business} />
          </div>
        )}
        {activeTab === 'ai-recommendation' && <AIRecommendation business={business} />}
        {activeTab === 'simulator' && <WhatIfSimulator business={business} />}
      </div>

      {/* ─── BOTTOM PLATFORM ACTION CALLOUT ───────────────────────────── */}
      <div className="bg-[#0D0D0D] text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            <ShieldCheck className="w-4 h-4" />
            <span>Ready to turn this idea into reality?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Simulate and Track This Business in BizMind AI
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Get personalized cash-flow forecasting, automate your monthly budgets, and talk to your 24/7 AI Advisor.
          </p>
        </div>

        <div className="z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onGetStarted}
            className="py-3 px-6 rounded-xl bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all text-center cursor-pointer"
          >
            Start with This Model
          </button>
          <button
            type="button"
            onClick={onBack}
            className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors text-center cursor-pointer"
          >
            Explore Other Ideas
          </button>
        </div>
      </div>

      {/* ─── MANDATORY OFFICIAL DISCLAIMER ────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-[#F4F4F5] border border-gray-200/90 text-center space-y-2">
        <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto">
          <strong className="text-[#0D0D0D]">Official Financial Disclaimer: </strong>
          Business estimates shown by BizMind AI are illustrative and may vary based on location, market conditions, competition, operating costs, customer demand and other factors. They are intended for informational and planning purposes and should not be considered professional financial, legal or investment advice.
        </p>
      </div>
    </div>
  );
}
