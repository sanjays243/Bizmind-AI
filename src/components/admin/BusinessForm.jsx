import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  X,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CATEGORIES = [
  'Retail & Local Shops',
  'Food & Beverage',
  'Technology & Online',
  'Home & Construction',
  'Agriculture',
  'Education',
  'Beauty & Fashion',
  'Health & Fitness',
  'Transportation',
  'Tourism & Hospitality',
  'Manufacturing',
  'Events & Entertainment',
  'Professional Services',
  'Pet & Animal Services',
];

export default function BusinessForm({
  initialData = null,
  isEdit = false,
  onSubmit,
  loading = false,
}) {
  const navigate = useNavigate();

  // Basic Information
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Retail & Local Shops');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [image, setImage] = useState('');
  const [targetCustomers, setTargetCustomers] = useState('');
  const [locationGuidance, setLocationGuidance] = useState('');

  // Business Estimates (Strictly Labelled as Estimates)
  const [investmentMin, setInvestmentMin] = useState(25000);
  const [investmentMax, setInvestmentMax] = useState(50000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(20000);
  const [monthlyExpensesTotal, setMonthlyExpensesTotal] = useState(14000);
  const [estimatedOperatingProfit, setEstimatedOperatingProfit] = useState(6000);
  const [estimatedProfitMargin, setEstimatedProfitMargin] = useState(30);

  // Breakdown objects
  const [startupEquipment, setStartupEquipment] = useState(15000);
  const [startupDeposit, setStartupDeposit] = useState(8000);
  const [startupInventory, setStartupInventory] = useState(7000);
  const [startupMarketing, setStartupMarketing] = useState(5000);
  const [breakEvenMonths, setBreakEvenMonths] = useState('6-9 Months');
  const [breakEvenDailySales, setBreakEvenDailySales] = useState('25 orders/day');

  // Business Strategic Analysis
  const [difficulty, setDifficulty] = useState('Moderate');
  const [riskLevel, setRiskLevel] = useState('Medium');
  const [profitPotential, setProfitPotential] = useState('High');
  const [marketOpportunityScore, setMarketOpportunityScore] = useState(85);

  // Lists
  const [advantagesText, setAdvantagesText] = useState('');
  const [disadvantagesText, setDisadvantagesText] = useState('');
  const [majorRisksText, setMajorRisksText] = useState('');
  const [requiredSkillsText, setRequiredSkillsText] = useState('');
  const [marketingStrategyText, setMarketingStrategyText] = useState('');
  const [growthOpportunitiesText, setGrowthOpportunitiesText] = useState('');

  // AI Recommendation
  const [aiScore, setAiScore] = useState(85);
  const [aiSummary, setAiSummary] = useState('');
  const [aiActionPlan, setAiActionPlan] = useState('');
  const [aiVerdict, setAiVerdict] = useState('Recommended Opportunity');

  // Publishing
  const [status, setStatus] = useState('published');
  const [isFeatured, setIsFeatured] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Auto-generate slug from name if empty
  const handleNameChange = (val) => {
    setName(val);
    if (!isEdit || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Populate data in edit mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSlug(initialData.slug || '');
      setCategory(initialData.category || 'Retail & Local Shops');
      setShortDescription(initialData.shortDescription || '');
      setFullDescription(initialData.fullDescription || initialData.description || '');
      setImage(initialData.image || '');
      setTargetCustomers(initialData.targetCustomers || '');
      setLocationGuidance(initialData.locationGuidance || initialData.whereToStart || '');

      setInvestmentMin(initialData.investmentMin || 0);
      setInvestmentMax(initialData.investmentMax || 0);

      const rev = initialData.revenueEstimate?.estimatedMonthlyRevenue || initialData.estimatedMonthlyRevenue || 0;
      const exp = initialData.monthlyExpenses?.total || initialData.monthlyExpensesEstimate || 0;
      setMonthlyRevenue(rev);
      setMonthlyExpensesTotal(exp);

      const opProfit = initialData.profitEstimate?.potentialOperatingProfit || initialData.estimatedOperatingProfit || (rev - exp);
      setEstimatedOperatingProfit(opProfit);
      setEstimatedProfitMargin(initialData.profitEstimate?.potentialProfitMargin || initialData.estimatedProfitMargin || 25);

      setBreakEvenMonths(initialData.breakEvenEstimate?.estimatedBreakEvenPoint || '6 Months');
      setBreakEvenDailySales(initialData.breakEvenEstimate?.requiredDailySales || '20 orders/day');

      setDifficulty(initialData.difficulty || 'Moderate');
      setRiskLevel(initialData.riskLevel || 'Medium');
      setProfitPotential(initialData.profitPotential || 'High');
      setMarketOpportunityScore(initialData.marketOpportunityScore || 85);

      setAdvantagesText((initialData.advantages || []).join('\n'));
      setDisadvantagesText((initialData.disadvantages || []).join('\n'));
      setMajorRisksText((initialData.majorRisks || initialData.risks || []).join('\n'));
      setRequiredSkillsText((initialData.requiredSkills || []).join('\n'));
      setMarketingStrategyText((initialData.marketingStrategy || []).join('\n'));
      setGrowthOpportunitiesText((initialData.growthOpportunities || []).join('\n'));

      if (initialData.aiRecommendation) {
        setAiScore(initialData.aiRecommendation.score || 85);
        setAiSummary(initialData.aiRecommendation.summary || '');
        setAiActionPlan(initialData.aiRecommendation.actionPlan || '');
        setAiVerdict(initialData.aiRecommendation.verdict || 'Recommended Opportunity');
      }

      setStatus(initialData.status || 'published');
      setIsFeatured(Boolean(initialData.isFeatured));
    }
  }, [initialData]);

  // Recalculate profit estimate on revenue/expense change
  const handleRevenueChange = (val) => {
    const num = Number(val) || 0;
    setMonthlyRevenue(num);
    const profit = num - monthlyExpensesTotal;
    setEstimatedOperatingProfit(profit);
    setEstimatedProfitMargin(num > 0 ? parseFloat(((profit / num) * 100).toFixed(1)) : 0);
  };

  const handleExpensesChange = (val) => {
    const num = Number(val) || 0;
    setMonthlyExpensesTotal(num);
    const profit = monthlyRevenue - num;
    setEstimatedOperatingProfit(profit);
    setEstimatedProfitMargin(monthlyRevenue > 0 ? parseFloat(((profit / monthlyRevenue) * 100).toFixed(1)) : 0);
  };

  const handleFormSubmit = (e, forcedStatus) => {
    if (e) e.preventDefault();
    const finalStatus = forcedStatus || status;

    const validationErrors = {};
    if (!name.trim()) validationErrors.name = 'Business name is required.';
    if (!category) validationErrors.category = 'Business category is required.';
    if (!shortDescription.trim()) validationErrors.shortDescription = 'Short description is required for catalog cards.';
    if (investmentMin < 0 || investmentMax < investmentMin) {
      validationErrors.investment = 'Maximum investment must be greater than or equal to minimum investment.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});

    const parseLines = (text) => text.split('\n').map(l => l.trim()).filter(Boolean);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      category,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      description: fullDescription.trim() || shortDescription.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      targetCustomers: targetCustomers.trim(),
      locationGuidance: locationGuidance.trim(),
      investmentMin: Number(investmentMin),
      investmentMax: Number(investmentMax),
      startupCostBreakdown: {
        equipment: Number(startupEquipment),
        locationDeposit: Number(startupDeposit),
        initialInventory: Number(startupInventory),
        marketingLaunch: Number(startupMarketing),
      },
      monthlyExpenses: {
        total: Number(monthlyExpensesTotal),
      },
      monthlyExpensesEstimate: Number(monthlyExpensesTotal),
      revenueEstimate: {
        estimatedMonthlyRevenue: Number(monthlyRevenue),
      },
      estimatedMonthlyRevenue: Number(monthlyRevenue),
      profitEstimate: {
        potentialOperatingProfit: Number(estimatedOperatingProfit),
        potentialProfitMargin: Number(estimatedProfitMargin),
      },
      estimatedOperatingProfit: Number(estimatedOperatingProfit),
      estimatedProfitMargin: Number(estimatedProfitMargin),
      breakEvenEstimate: {
        estimatedBreakEvenPoint: breakEvenMonths,
        requiredDailySales: breakEvenDailySales,
      },
      difficulty,
      riskLevel,
      profitPotential,
      marketOpportunityScore: Number(marketOpportunityScore),
      advantages: parseLines(advantagesText),
      disadvantages: parseLines(disadvantagesText),
      majorRisks: parseLines(majorRisksText),
      risks: parseLines(majorRisksText),
      requiredSkills: parseLines(requiredSkillsText),
      marketingStrategy: parseLines(marketingStrategyText),
      growthOpportunities: parseLines(growthOpportunitiesText),
      aiRecommendation: {
        score: Number(aiScore),
        summary: aiSummary || `Strategic assessment identifies ${name} as a viable enterprise opportunity.`,
        actionPlan: aiActionPlan || 'Conduct preliminary demographic testing, secure favorable lease terms, and execute launch marketing.',
        verdict: aiVerdict,
      },
      status: finalStatus,
      isFeatured: Boolean(isFeatured),
    };

    onSubmit(payload);
  };

  return (
    <form className="space-y-8 animate-fade-in" onSubmit={(e) => handleFormSubmit(e)}>
      {/* Disclaimer Banner */}
      <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-2xl p-4 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
        <div className="text-xs text-[#0D0D0D] leading-relaxed">
          <strong className="font-bold text-[#FF6B00]">Financial Estimates Compliance:</strong> All investment, revenue, expense, and break-even figures are calculated strictly as <em>illustrative planning estimates</em> for decision intelligence. BizMind AI never guarantees earnings or investment outcomes.
        </div>
      </div>

      {/* Error alert */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong className="font-bold block mb-1">Please correct the following fields:</strong>
            <ul className="list-disc pl-4 space-y-0.5">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-[#0D0D0D]">1. Basic Information</h2>
          <p className="text-xs text-gray-400">Core identity, category placement, and catalog descriptions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Business Name <span className="text-[#FF6B00]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Specialty Artisan Coffee Roastery"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden transition-all"
            />
          </div>

          {/* Unique Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              URL Slug <span className="text-[#FF6B00]">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-500 font-mono">
                /businesses/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="specialty-artisan-coffee"
                className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-sm font-mono focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Business Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Business Category <span className="text-[#FF6B00]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden bg-[#FFFFFF]"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Business Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Cover Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
            Short Description (Catalog Card Summary) <span className="text-[#FF6B00]">*</span>
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A compelling 1-2 sentence executive overview displayed on exploration cards..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
          />
        </div>

        {/* Full Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
            Full Business Description & Value Proposition
          </label>
          <textarea
            rows={4}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Comprehensive description of the business model, unit operations, target market, and customer journey..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
          />
        </div>

        {/* Target Customers & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Target Customers
            </label>
            <input
              type="text"
              value={targetCustomers}
              onChange={(e) => setTargetCustomers(e.target.value)}
              placeholder="e.g. Urban professionals, local families, B2B corporate buyers"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Location Guidance
            </label>
            <input
              type="text"
              value={locationGuidance}
              onChange={(e) => setLocationGuidance(e.target.value)}
              placeholder="e.g. High-density pedestrian corridors, suburban retail strip with parking"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: BUSINESS ESTIMATES */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0D0D0D]">2. Business Financial Estimates</h2>
            <p className="text-xs text-gray-400">Capital requirements, revenue projections, and operating margins (Illustrative)</p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F4F4F5] text-gray-600 border border-gray-200">
            USD Currency
          </span>
        </div>

        {/* Investment Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Min. Investment ($)
            </label>
            <input
              type="number"
              min="0"
              value={investmentMin}
              onChange={(e) => setInvestmentMin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Max. Investment ($)
            </label>
            <input
              type="number"
              min="0"
              value={investmentMax}
              onChange={(e) => setInvestmentMax(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Est. Monthly Revenue ($)
            </label>
            <input
              type="number"
              min="0"
              value={monthlyRevenue}
              onChange={(e) => handleRevenueChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Est. Monthly Expenses ($)
            </label>
            <input
              type="number"
              min="0"
              value={monthlyExpensesTotal}
              onChange={(e) => handleExpensesChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-hidden"
            />
          </div>
        </div>

        {/* Operating Profit & Profit Margin preview */}
        <div className="bg-[#F4F4F5] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-200">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Est. Monthly Operating Profit
            </span>
            <span className="text-lg font-extrabold text-emerald-700">
              ${Number(estimatedOperatingProfit).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Est. Profit Margin
            </span>
            <span className="text-lg font-extrabold text-[#0D0D0D]">
              {estimatedProfitMargin}%
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Est. Break-Even Timeline
            </span>
            <input
              type="text"
              value={breakEvenMonths}
              onChange={(e) => setBreakEvenMonths(e.target.value)}
              placeholder="e.g. 8-10 Months"
              className="mt-1 w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-300 bg-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: STRATEGIC ANALYSIS & ATTRIBUTES */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-[#0D0D0D]">3. Strategic Business Analysis</h2>
          <p className="text-xs text-gray-400">Risk rating, execution difficulty, advantages, risks, and required skillsets</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden bg-[#FFFFFF]"
            >
              <option value="Beginner">Beginner</option>
              <option value="Moderate">Moderate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Risk Level
            </label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden bg-[#FFFFFF]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Profit Potential
            </label>
            <select
              value={profitPotential}
              onChange={(e) => setProfitPotential(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden bg-[#FFFFFF]"
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Market Opportunity (0-100)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={marketOpportunityScore}
              onChange={(e) => setMarketOpportunityScore(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#FF6B00] outline-hidden"
            />
          </div>
        </div>

        {/* Text Area Lists (one item per line) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Core Advantages (one per line)
            </label>
            <textarea
              rows={3}
              value={advantagesText}
              onChange={(e) => setAdvantagesText(e.target.value)}
              placeholder="High repeat customer purchase rate&#10;Durable gross margins on services&#10;Low initial inventory footprint"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Disadvantages / Challenges (one per line)
            </label>
            <textarea
              rows={3}
              value={disadvantagesText}
              onChange={(e) => setDisadvantagesText(e.target.value)}
              placeholder="Requires dedicated operational oversight&#10;Sensitivity to commercial lease escalation"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Major Risks to Monitor (one per line)
            </label>
            <textarea
              rows={3}
              value={majorRisksText}
              onChange={(e) => setMajorRisksText(e.target.value)}
              placeholder="Foot traffic variations&#10;Supplier price volatility&#10;Local competitor saturation"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              Required Skills (one per line)
            </label>
            <textarea
              rows={3}
              value={requiredSkillsText}
              onChange={(e) => setRequiredSkillsText(e.target.value)}
              placeholder="Customer Management&#10;Inventory Control&#10;Basic Financial Bookkeeping"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#FF6B00] outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: PUBLISHING & VISIBILITY */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-[#0D0D0D]">4. Publishing & Status</h2>
          <p className="text-xs text-gray-400">Control immediate public availability on the Explore Business Ideas page</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-xl bg-[#F4F4F5] border border-gray-200">
          <div className="space-y-1">
            <span className="font-bold text-sm text-[#0D0D0D] block">
              Publication Status
            </span>
            <p className="text-xs text-gray-500">
              Published businesses appear immediately on public explore pages. Drafts remain hidden from normal visitors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                status === 'published'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              ● Published (Public)
            </button>
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                status === 'draft'
                  ? 'bg-[#0D0D0D] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Draft Mode
            </button>
          </div>
        </div>

        {/* Featured Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded-sm text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300"
          />
          <div>
            <span className="text-sm font-bold text-[#0D0D0D] block">
              Feature this business idea on platform hero & highlights
            </span>
            <span className="text-xs text-gray-500">
              Displays prominent featured badge and ranks high in catalog exploration.
            </span>
          </div>
        </label>
      </div>

      {/* FORM ACTION BUTTONS */}
      <div className="sticky bottom-4 z-20 bg-[#FFFFFF]/95 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/businesses')}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleFormSubmit(e, 'draft')}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#0D0D0D] bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors cursor-pointer"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isEdit ? 'Save Changes & Update Catalog' : 'Publish Business Idea'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
