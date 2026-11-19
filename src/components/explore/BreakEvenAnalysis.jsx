import React from 'react';
import { Target, Scale, Clock, Award } from 'lucide-react';

export default function BreakEvenAnalysis({ business }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const be = business.breakEvenEstimate || {};
  const monthsNum = parseInt(be.estimatedBreakEvenPoint) || 9;
  const breakEvenProgress = Math.min(100, Math.round((12 / monthsNum) * 50));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
          <Scale className="w-4 h-4" />
          <span>Capital Payback & Risk Threshold</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D]">
          Break-Even & Investment Recoup Analysis
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          The point at which cumulative gross revenue completely covers total fixed and startup capital expenses.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400">
            Initial Capital Deployed
          </span>
          <p className="text-2xl font-black text-[#0D0D0D] font-mono">
            {formatCurrency(be.initialInvestment)}
          </p>
          <span className="text-xs text-gray-500">Capex + startup buffer</span>
        </div>

        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400">
            Monthly Fixed Burden
          </span>
          <p className="text-2xl font-black text-[#0D0D0D] font-mono">
            {formatCurrency(be.monthlyFixedCosts)}
          </p>
          <span className="text-xs text-gray-500">Unavoidable monthly cost</span>
        </div>

        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400">
            Gross Profit Margin
          </span>
          <p className="text-2xl font-black text-[#0D0D0D] font-mono">
            {be.averageGrossMargin || '65%'}
          </p>
          <span className="text-xs text-gray-500">Margin to service fixed debt</span>
        </div>

        <div className="bg-[#0D0D0D] text-white rounded-2xl p-5 space-y-1 shadow-md">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#FF6B00]">
            Est. Time to Break Even
          </span>
          <p className="text-2xl font-black text-white font-mono">
            {be.estimatedBreakEvenPoint}
          </p>
          <span className="text-xs text-gray-400">Full capital payback window</span>
        </div>
      </div>

      {/* Visual Runway Timeline Gauge */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-base text-[#0D0D0D]">
              Capital Recovery Timeline Gauge
            </h4>
            <p className="text-xs text-gray-500">
              Projected trajectory based on steady operating ramp-up.
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-orange-200 text-xs font-bold text-[#FF6B00]">
            Target Velocity: {be.requiredDailySales}
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-[#0D0D0D] to-[#FF6B00] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(25, 100 - (monthsNum * 4)))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-gray-400">
            <span>Month 0 (Launch)</span>
            <span>Month 3 (Ramp)</span>
            <span>Month 6 (Fixed Cost Neutral)</span>
            <span>{be.estimatedBreakEvenPoint} (Full Capital Recoup)</span>
            <span>Month 24 (Net Expansion)</span>
          </div>
        </div>

        {/* Operating Rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F4F4F5] border border-gray-200/80 space-y-1">
            <span className="text-xs font-extrabold text-[#0D0D0D]">Minimum Daily Sales Goal</span>
            <p className="text-sm font-bold text-[#FF6B00] font-mono">{be.requiredDailySales}</p>
            <p className="text-[11px] text-gray-500">To maintain operational zero-loss safety.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4F4F5] border border-gray-200/80 space-y-1">
            <span className="text-xs font-extrabold text-[#0D0D0D]">Recommended Reserve Buffer</span>
            <p className="text-sm font-bold text-[#0D0D0D] font-mono">4 Months OPEX</p>
            <p className="text-[11px] text-gray-500">Safeguards against initial slow winter or summer lull.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4F4F5] border border-gray-200/80 space-y-1">
            <span className="text-xs font-extrabold text-[#0D0D0D]">Financial Risk Rating</span>
            <p className="text-sm font-bold text-[#0D0D0D] font-mono">{business.riskLevel} Risk Profile</p>
            <p className="text-[11px] text-gray-500">Evaluated against 10-year small business failure benchmarks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
