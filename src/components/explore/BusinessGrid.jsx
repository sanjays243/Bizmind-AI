import React, { useState } from 'react';
import BusinessCard from './BusinessCard';
import { SearchX, ArrowDown } from 'lucide-react';

export default function BusinessGrid({ businesses, onSelectBusiness, onResetFilters }) {
  const [displayCount, setDisplayCount] = useState(16);

  const displayedBusinesses = businesses.slice(0, displayCount);
  const hasMore = displayCount < businesses.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(businesses.length, prev + 16));
  };

  if (businesses.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm my-8">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#0D0D0D]">No business models match your filters</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Try loosening your investment range, risk level, or search keyword to discover opportunities.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#0D0D0D] hover:bg-black text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 4-column desktop, 2-column tablet, 1-column mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedBusinesses.map((biz) => (
          <BusinessCard
            key={biz.id}
            business={biz}
            onSelect={onSelectBusiness}
          />
        ))}
      </div>

      {/* Pagination / Load More Bar */}
      <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-semibold text-gray-500">
          Showing <span className="font-bold text-[#0D0D0D]">{displayedBusinesses.length}</span> of{' '}
          <span className="font-bold text-[#0D0D0D]">{businesses.length}</span> business models
        </p>

        {hasMore && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-[#0D0D0D] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md shadow-black/10 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <span>Load More Businesses ({businesses.length - displayCount} remaining)</span>
            <ArrowDown className="w-4 h-4 text-[#FF6B00]" />
          </button>
        )}
      </div>
    </div>
  );
}
