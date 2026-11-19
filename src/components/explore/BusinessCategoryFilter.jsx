import React from 'react';

/**
 * Category Filter Bar with counts & scrollable pills
 */
export default function BusinessCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {}
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-[#0D0D0D] text-white border-[#0D0D0D] shadow-md shadow-black/10'
                  : 'bg-white text-[#0D0D0D] border-gray-200/90 hover:border-[#FF6B00] hover:bg-[#FFF7ED]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white'
                    : 'bg-[#F4F4F5] text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
