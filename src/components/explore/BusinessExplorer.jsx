import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';

import { BUSINESSES_DATA, BUSINESS_CATEGORIES } from '../../data/businessesData';
import { businessService } from '../../services/business.service';
import BusinessCategoryFilter from './BusinessCategoryFilter';
import BusinessGrid from './BusinessGrid';
import BusinessDetail from './BusinessDetail';

export default function BusinessExplorer({ onGetStarted }) {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [allBusinesses, setAllBusinesses] = useState(BUSINESSES_DATA);
  const [loadingBackend, setLoadingBackend] = useState(false);

  // Fetch real MongoDB published businesses dynamically from API
  React.useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoadingBackend(true);
      try {
        const res = await businessService.getPublicBusinesses({ limit: 100 });
        if (isMounted && res?.businesses && res.businesses.length > 0) {
          // Merge: Put backend MongoDB published businesses first, deduplicated by slug or name
          const backendBusinesses = res.businesses;
          const backendNames = new Set(backendBusinesses.map((b) => b.name.toLowerCase()));
          const extraLocal = BUSINESSES_DATA.filter((b) => !backendNames.has(b.name.toLowerCase()));
          setAllBusinesses([...backendBusinesses, ...extraLocal]);
        }
      } catch (err) {
        console.warn('API catalog sync fallback to local store:', err.message);
      } finally {
        if (isMounted) setLoadingBackend(false);
      }
    };

    fetchCatalog();
    return () => { isMounted = false; };
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [investmentFilter, setInvestmentFilter] = useState('all'); // all, under25k, 25to50k, 50to100k, over100k
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // all, Beginner, Moderate, Advanced
  const [riskFilter, setRiskFilter] = useState('all'); // all, Low, Medium, High
  const [sortBy, setSortBy] = useState('aiScore'); // aiScore, invAsc, invDesc, profitDesc, nameAsc
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: allBusinesses.length };
    BUSINESS_CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = allBusinesses.filter((b) => b.category === cat).length;
      }
    });
    return counts;
  }, [allBusinesses]);

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    return allBusinesses.filter((b) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = b.name.toLowerCase().includes(query);
        const matchDesc = b.shortDescription.toLowerCase().includes(query);
        const matchCat = b.category.toLowerCase().includes(query);
        const matchCust = b.targetCustomers?.toLowerCase().includes(query);
        const matchSkills = b.requiredSkills?.some((s) => s.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchCat && !matchCust && !matchSkills) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All' && b.category !== selectedCategory) {
        return false;
      }

      // 3. Investment Level
      if (investmentFilter === 'under25k' && b.investmentMin >= 25000) return false;
      if (investmentFilter === '25to50k' && (b.investmentMin > 50000 || b.investmentMax < 25000)) return false;
      if (investmentFilter === '50to100k' && (b.investmentMin > 100000 || b.investmentMax < 50000)) return false;
      if (investmentFilter === 'over100k' && b.investmentMax < 100000) return false;

      // 4. Difficulty
      if (difficultyFilter !== 'all' && b.difficulty !== difficultyFilter) {
        return false;
      }

      // 5. Risk
      if (riskFilter !== 'all' && b.riskLevel !== riskFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'aiScore') {
        return (b.aiRecommendation?.score || 0) - (a.aiRecommendation?.score || 0);
      }
      if (sortBy === 'invAsc') {
        return a.investmentMin - b.investmentMin;
      }
      if (sortBy === 'invDesc') {
        return b.investmentMax - a.investmentMax;
      }
      if (sortBy === 'profitDesc') {
        return (b.profitEstimate?.potentialProfitMargin || 0) - (a.profitEstimate?.potentialProfitMargin || 0);
      }
      if (sortBy === 'nameAsc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, investmentFilter, difficultyFilter, riskFilter, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (investmentFilter !== 'all' ? 1 : 0) +
    (difficultyFilter !== 'all' ? 1 : 0) +
    (riskFilter !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setInvestmentFilter('all');
    setDifficultyFilter('all');
    setRiskFilter('all');
    setSortBy('aiScore');
  };

  // If a business is selected, render the full detailed view
  if (selectedBusiness) {
    return (
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BusinessDetail
          business={selectedBusiness}
          onBack={() => setSelectedBusiness(null)}
          onGetStarted={onGetStarted}
        />
      </section>
    );
  }

  return (
    <section id="explore-businesses" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* ─── SECTION HEADER ───────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            EXPLORE BUSINESS IDEAS
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D0D0D] tracking-tight leading-tight">
          Tailored Intelligence for Every <span className="text-[#FF6B00]">Small Business Sector</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Every business has different costs, customers, margins, risks, and growth opportunities. BizMind AI adapts its analysis to each business model and helps you understand the numbers before you invest.
        </p>

        <p className="text-xs sm:text-sm font-semibold text-[#0D0D0D] pt-1">
          Explore a business. Understand the opportunity. Plan your next move.
        </p>
      </div>

      {/* ─── SEARCH & CONTROLS TOOLBAR ────────────────────────────────── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, skills, category, or target customers (e.g. coffee, solar, pet, online)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs sm:text-sm bg-[#F4F4F5]/50 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters Toggle (Mobile/Desktop) */}
          <button
            type="button"
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
              activeFiltersCount > 0
                ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF6B00]" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative min-w-[200px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-bold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] cursor-pointer"
            >
              <option value="aiScore">✨ Sort: AI Opportunity Score</option>
              <option value="invAsc">💰 Investment: Low to High</option>
              <option value="invDesc">💎 Investment: High to Low</option>
              <option value="profitDesc">📈 Profit Potential Margin</option>
              <option value="nameAsc">🔤 Business Name A – Z</option>
            </select>
          </div>
        </div>

        {/* Expandable Advanced Filter Panel */}
        {showFiltersDrawer && (
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            {/* Investment Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                Investment Budget
              </label>
              <select
                value={investmentFilter}
                onChange={(e) => setInvestmentFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 text-xs font-semibold bg-[#F4F4F5]"
              >
                <option value="all">Any Investment Level</option>
                <option value="under25k">Micro Capital (Under $25,000)</option>
                <option value="25to50k">Moderate ($25,000 – $50,000)</option>
                <option value="50to100k">Growth ($50,000 – $100,000)</option>
                <option value="over100k">Substantial ($100,000+)</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                Execution Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 text-xs font-semibold bg-[#F4F4F5]"
              >
                <option value="all">All Skill Levels</option>
                <option value="Beginner">Beginner Friendly</option>
                <option value="Moderate">Moderate Management</option>
                <option value="Advanced">Advanced Technical / Specialized</option>
              </select>
            </div>

            {/* Risk Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                Risk Profile
              </label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 text-xs font-semibold bg-[#F4F4F5]"
              >
                <option value="all">All Risk Levels</option>
                <option value="Low">Low Risk Profile</option>
                <option value="Medium">Medium Risk Profile</option>
                <option value="High">Higher Risk / High Upside</option>
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Reset Row */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
            <span>
              Found <strong className="text-[#0D0D0D]">{filteredBusinesses.length}</strong> matching models
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-bold text-[#FF6B00] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── 15 CATEGORY HORIZONTAL FILTER ────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
          <span>Filter by Industry Sector</span>
          <span>15 Categories</span>
        </div>
        <BusinessCategoryFilter
          categories={BUSINESS_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* ─── 4-COLUMN RESPONSIVE BUSINESS GRID ────────────────────────── */}
      <BusinessGrid
        businesses={filteredBusinesses}
        onSelectBusiness={setSelectedBusiness}
        onResetFilters={handleResetFilters}
      />

      {/* ─── MANDATORY OFFICIAL DISCLAIMER ────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#F4F4F5] border border-gray-200/90 text-center space-y-2">
        <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto">
          <strong className="text-[#0D0D0D]">Official Financial Disclaimer: </strong>
          Business estimates shown by BizMind AI are illustrative and may vary based on location, market conditions, competition, operating costs, customer demand and other factors. They are intended for informational and planning purposes and should not be considered professional financial, legal or investment advice.
        </p>
      </div>
    </section>
  );
}
