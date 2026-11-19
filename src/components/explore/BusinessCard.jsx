import React, { useState } from 'react';
import { ArrowRight, DollarSign, Gauge, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function BusinessCard({ business, onSelect }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getDifficultyBadge = (diff) => {
    if (diff === 'Beginner') {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Beginner Friendly' };
    }
    if (diff === 'Moderate') {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Moderate Effort' };
    }
    return { bg: 'bg-stone-100 text-stone-700 border-stone-300', label: 'Advanced Skills' };
  };

  const getRiskBadge = (risk) => {
    if (risk === 'Low') {
      return { bg: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Low Risk' };
    }
    if (risk === 'Medium') {
      return { bg: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Moderate Risk' };
    }
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Higher Risk' };
  };

  const diffBadge = getDifficultyBadge(business.difficulty);
  const riskBadge = getRiskBadge(business.riskLevel);

  return (
    <div
      onClick={() => onSelect(business)}
      className="group bg-white rounded-2xl border border-gray-200/90 hover:border-[#FF6B00] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Card Image with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={business.image}
          alt={business.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0D0D0D]/90 text-white backdrop-blur-md shadow-sm">
            {business.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-white/95 text-[#FF6B00] border border-[#FF6B00]/30 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#FF6B00]" />
            <span>AI {business.aiRecommendation?.score || 85}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-extrabold text-[#0D0D0D] group-hover:text-[#FF6B00] transition-colors leading-snug line-clamp-2">
            {business.name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {business.shortDescription}
          </p>
        </div>

        {/* Financial Metrics Strip */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Est. Investment
              </span>
              <p className="text-xs sm:text-sm font-black text-[#0D0D0D]">
                {formatCurrency(business.investmentMin)} – {formatCurrency(business.investmentMax)}
              </p>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Profit Margin
              </span>
              <p className="text-xs sm:text-sm font-black text-[#FF6B00]">
                ~{business.profitEstimate?.potentialProfitMargin || 24}%
              </p>
            </div>
          </div>

          {/* Badges Pill Row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${diffBadge.bg}`}>
              {diffBadge.label}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${riskBadge.bg}`}>
              {riskBadge.label}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF7ED] text-[#FF6B00] border border-orange-200">
              {business.profitPotential} Margin
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#F4F4F5] group-hover:bg-[#FF6B00] text-[#0D0D0D] group-hover:text-white transition-all duration-200 shadow-sm"
          >
            <span>View Business Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
