import React from 'react';
import { Megaphone, Target, Share2, Award } from 'lucide-react';

export default function MarketingStrategy({ business }) {
  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
          <Megaphone className="w-4 h-4" />
          <span>Customer Acquisition & Brand Engine</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D]">
          Marketing Playbook & Growth Channels
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {business.marketingStrategy}
        </p>
      </div>

      {/* 3 Core Marketing Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm sm:text-base text-[#0D0D0D]">
            Hyper-Local Paid Discovery
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Targeted Google Local Service ads and radius Meta campaigns designed to capture immediate high-intent local buyers within 5 to 10 miles.
          </p>
        </div>

        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm sm:text-base text-[#0D0D0D]">
            5-Star Review Funnel
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Automated SMS and receipt review prompts turning happy customers into organic search ambassadors, dominating local map pack rankings.
          </p>
        </div>

        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] text-white flex items-center justify-center">
            <Share2 className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <h4 className="font-extrabold text-sm sm:text-base text-[#0D0D0D]">
            Repeat Retention & Loyalty
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tiered digital loyalty punch cards and monthly VIP perks ensuring customers make recurring visits, driving higher Lifetime Value (LTV).
          </p>
        </div>
      </div>
    </div>
  );
}
