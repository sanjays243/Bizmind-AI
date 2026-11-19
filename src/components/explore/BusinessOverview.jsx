import React from 'react';
import { Target, Users, MapPin, Lightbulb, Compass } from 'lucide-react';

export default function BusinessOverview({ business }) {
  return (
    <div className="space-y-8">
      {/* Executive Overview */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
          <Compass className="w-4 h-4" />
          <span>Executive Business Overview</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D]">
          The Core Business Model
        </h3>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {business.overview}
        </p>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Who This Business Is For */}
        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#0D0D0D] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span>Who This Business Is For</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {business.whoIsThisFor}
          </p>
        </div>

        {/* Target Customers */}
        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#0D0D0D] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span>Primary Target Customers</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {business.targetCustomers}
          </p>
        </div>

        {/* Market Opportunity */}
        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#0D0D0D] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] text-white flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <span>Market Opportunity & Trends</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {business.marketOpportunity}
          </p>
        </div>

        {/* Where to Start / Location Considerations */}
        <div className="bg-[#F4F4F5]/60 border border-gray-200/80 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#0D0D0D] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span>Ideal Location & Setup Criteria</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {business.whereToStart}
          </p>
        </div>
      </div>
    </div>
  );
}
