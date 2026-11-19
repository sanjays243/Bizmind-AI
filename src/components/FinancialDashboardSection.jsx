import React, { useState } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

/**
 * FinancialDashboardSection Component
 * 
 * Displays the complete BizMind Financial Intelligence Dashboard
 * with in-depth explanations of every metric, chart, AI recommendation, and risk alert.
 * 
 * Strict Palette:
 * - Rich Black: #0D0D0D
 * - White: #FFFFFF
 * - Orange: #FF6B00
 * - Dark Border: #1F1F1F
 * - Light Gray: #F4F4F5
 */
export default function FinancialDashboardSection({ onGetStarted }) {
  const [activeTab, setActiveTab] = useState('forecast');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metricExplanations = [
    {
      id: 'revenue',
      title: 'Real-Time Revenue Tracking (₹2.48L)',
      badge: '+18.4% MoM',
      desc: 'BizMind AI automatically aggregates sales across Stripe, bank accounts, POS, and invoices. It filters out one-time spikes to show recurring, predictable revenue so you know exactly what is bankable.',
      highlights: ['Automated transaction reconciliation', 'Seasonal baseline normalization', 'Zero manual ledger entry']
    },
    {
      id: 'expenses',
      title: 'Controlled Expenses (₹1.62L)',
      badge: 'Optimized',
      desc: 'Tracks fixed overhead vs. variable costs. Instantly flags vendor price creep, forgotten software subscriptions, and operating budget variances before they erode your bottom line.',
      highlights: ['Cost-leak detection algorithm', 'Vendor contract benchmark comparison', 'Overhead ceiling safeguards']
    },
    {
      id: 'profit',
      title: 'True Net Margin (₹86K / 34.7%)',
      badge: 'High Quality',
      desc: 'Separates vanity gross sales from real cash in the bank. Calculates unit margins after taxes, payment gateway fees, and operating expenditures so you always know your true take-home profit.',
      highlights: ['Real cash margin calculation', 'Gross vs Net disparity analysis', 'Tax & operational reserve buffering']
    },
    {
      id: 'health',
      title: 'Business Health Score (82/100)',
      badge: 'Strong Tier',
      desc: 'A proprietary executive rating combining cash runway, debt-service safety ratio, receivables turnaround speed, and profit consistency into a single plain-English health indicator.',
      highlights: ['Instant financial solvency check', 'Benchmark against similar businesses', 'Clear improvement roadmap']
    },
    {
      id: 'forecast',
      title: '90-Day Predictive Cash Flow Runway',
      badge: '+₹34K Expected',
      desc: 'Traditional accounting tells you what happened yesterday. BizMind AI uses neural forecasting to project cash balances 90 days forward, warning you about potential payroll droughts weeks in advance.',
      highlights: ['Simulated receivable delays', 'Working capital depletion warnings', 'Scenario testing before spending']
    },
    {
      id: 'ai-recommend',
      title: 'Proactive AI Decision Recommendations',
      badge: 'Actionable Advice',
      desc: 'Translates financial data into tangible business moves. Rather than leaving you to interpret raw graphs, BizMind gives you clear tactical advice on supplier terms, pricing adjustments, and capital allocation.',
      highlights: ['Specific dollar-saving suggestions', 'Working capital optimization', 'Continuous 24/7 financial co-pilot']
    },
    {
      id: 'risk-alert',
      title: 'Early Warning & Risk Alert Radar',
      badge: 'Zero Surprises',
      desc: 'Detects abnormal payment delays, customer churn risk, and cash runway drops in real-time. Gives you an early heads-up so you can take corrective action before a minor problem turns into a crisis.',
      highlights: ['Overdue invoice aging alerts', 'Margin erosion notifications', 'Cash burn acceleration triggers']
    }
  ];

  return (
    <section className="bg-[#FFFFFF] py-20 lg:py-24 border-b border-[#F4F4F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              LIVE FINANCIAL INTELLIGENCE ENGINE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D0D0D] tracking-tight">
            Inside the BizMind AI{' '}
            <span className="text-[#FF6B00]">Decision Dashboard</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A comprehensive breakdown of how BizMind AI monitors revenue, tracks expenses, predicts cash runway, and recommends high-impact business decisions.
          </p>
        </div>

        {/* Main Grid: Dashboard Display (Left) + Detailed Information Breakdown (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ─── LEFT: The Complete Financial Dashboard Visual ─── */}
          <div className="lg:col-span-7 bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-white">
            
            {/* Dashboard Top Header Bar */}
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    BizMind Financial Intelligence
                  </h3>
                  <p className="text-xs text-[#FF6B00] font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                    Live Neural Engine
                  </p>
                </div>
              </div>

              {/* Toggle Tabs */}
              <div className="flex items-center gap-1 bg-[#1F1F1F] p-1 rounded-xl text-xs font-semibold text-gray-400">
                <button
                  type="button"
                  onClick={() => setActiveTab('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'monthly' ? 'bg-[#0D0D0D] text-white shadow-sm' : 'hover:text-white'
                  }`}
                >
                  30D Actuals
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('forecast')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'forecast' ? 'bg-[#FF6B00] text-white font-bold shadow-sm' : 'hover:text-white'
                  }`}
                >
                  90D Forecast
                </button>
              </div>
            </div>

            {/* 4 Metric Summary Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Revenue Card */}
              <div
                onClick={() => setSelectedMetric('revenue')}
                className={`border rounded-2xl p-4 space-y-1 transition-all cursor-pointer ${
                  selectedMetric === 'revenue'
                    ? 'bg-[#1F1F1F] border-[#FF6B00] shadow-md shadow-orange-500/10'
                    : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-700'
                }`}
              >
                <span className="text-xs font-medium text-gray-400">Revenue</span>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  ₹2.48L
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#FF6B00]">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4%</span>
                </div>
              </div>

              {/* 2. Expenses Card */}
              <div
                onClick={() => setSelectedMetric('expenses')}
                className={`border rounded-2xl p-4 space-y-1 transition-all cursor-pointer ${
                  selectedMetric === 'expenses'
                    ? 'bg-[#1F1F1F] border-[#FF6B00] shadow-md shadow-orange-500/10'
                    : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-700'
                }`}
              >
                <span className="text-xs font-medium text-gray-400">Expenses</span>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  ₹1.62L
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                  <span>Controlled</span>
                </div>
              </div>

              {/* 3. Net Profit Card */}
              <div
                onClick={() => setSelectedMetric('profit')}
                className={`border rounded-2xl p-4 space-y-1 transition-all cursor-pointer ${
                  selectedMetric === 'profit'
                    ? 'bg-[#1F1F1F] border-[#FF6B00] shadow-md shadow-orange-500/10'
                    : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-700'
                }`}
              >
                <span className="text-xs font-medium text-gray-400">Net Profit</span>
                <div className="text-xl sm:text-2xl font-extrabold text-[#FF6B00] font-mono">
                  ₹86K
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300">
                  <span>34.7% Margin</span>
                </div>
              </div>

              {/* 4. Business Health Score */}
              <div
                onClick={() => setSelectedMetric('health')}
                className={`border rounded-2xl p-4 space-y-1 transition-all cursor-pointer ${
                  selectedMetric === 'health'
                    ? 'bg-[#1F1F1F] border-[#FF6B00] shadow-md shadow-orange-500/10'
                    : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-700'
                }`}
              >
                <span className="text-xs font-medium text-gray-400">Health Score</span>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono flex items-baseline gap-0.5">
                  <span>82</span>
                  <span className="text-xs text-gray-500 font-normal">/100</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#FF6B00]">
                  <span>Strong Tier</span>
                </div>
              </div>
            </div>

            {/* Trajectory & 90-Day Cash Flow Forecast Chart */}
            <div
              onClick={() => setSelectedMetric('forecast')}
              className={`border rounded-2xl p-4 sm:p-5 space-y-3 cursor-pointer transition-all ${
                selectedMetric === 'forecast'
                  ? 'bg-[#1A1A1A] border-[#FF6B00]'
                  : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                    Revenue Trajectory
                  </span>
                  <span className="font-medium text-gray-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-gray-500" />
                    Expense Baseline
                  </span>
                  <span className="font-medium text-gray-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#FF6B00] border-dashed border-t" />
                    90D Projected Runway
                  </span>
                </div>
                <span className="text-xs font-mono text-[#FF6B00] font-bold bg-[#FF6B00]/10 px-2 py-0.5 rounded border border-[#FF6B00]/30">
                  +₹34K Expected
                </span>
              </div>

              {/* Clean SVG Vector Line & Forecast Chart */}
              <div className="h-44 sm:h-48 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 130">
                  <defs>
                    <linearGradient id="dashboardRevenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Area fill under curve */}
                  <polygon
                    points="0,110 40,95 90,82 140,88 190,65 240,55 290,40 340,32 390,18 390,125 0,125"
                    fill="url(#dashboardRevenueGrad)"
                  />

                  {/* Expense Baseline */}
                  <polyline
                    points="0,98 50,95 100,92 150,93 200,90 250,88 300,86 350,85 400,84"
                    fill="none"
                    stroke="#525252"
                    strokeWidth="2"
                  />

                  {/* Solid Revenue Actuals Line */}
                  <polyline
                    points="0,110 40,95 90,82 140,88 190,65 240,55"
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dashed Projected Runway Line */}
                  <polyline
                    points="240,55 290,40 340,32 390,18"
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />

                  {/* Markers */}
                  <circle cx="240" cy="55" r="5" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="390" cy="18" r="4.5" fill="#FF6B00" />
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[11px] font-mono text-gray-500 pt-2 border-t border-[#1F1F1F]">
                <span>Month 1 (Past)</span>
                <span>Month 2 (Current)</span>
                <span className="text-[#FF6B00] font-semibold">90D Projected Runway →</span>
              </div>
            </div>

            {/* Bottom Insight & Risk Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* AI Recommendation Card */}
              <div
                onClick={() => setSelectedMetric('ai-recommend')}
                className={`border-l-4 border-[#FF6B00] p-4 rounded-xl space-y-1.5 cursor-pointer transition-all ${
                  selectedMetric === 'ai-recommend'
                    ? 'bg-[#1F1F1F] border-t border-r border-b border-[#FF6B00]'
                    : 'bg-[#141414] border-t border-r border-b border-[#1F1F1F] hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B00]">
                  <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                  <span>AI Recommendation</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Re-negotiating batch vendor terms preserves <strong className="text-white">₹14,200</strong> in cash reserves over next 60 days.
                </p>
              </div>

              {/* Risk Alert Card */}
              <div
                onClick={() => setSelectedMetric('risk-alert')}
                className={`p-4 rounded-xl space-y-1.5 cursor-pointer transition-all border ${
                  selectedMetric === 'risk-alert'
                    ? 'bg-[#1F1F1F] border-[#FF6B00]'
                    : 'bg-[#141414] border-[#1F1F1F] hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                  <AlertTriangle className="w-4 h-4 text-[#FF6B00]" />
                  <span>Risk Alert</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Overdue Invoices: <span className="text-white font-mono font-semibold">₹24,000</span> delayed past 15 days. Action advised.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-2 text-center">
              <span className="text-[10px] text-gray-500 font-mono">
                *Sample dashboard intelligence simulation. No guarantee of future financial returns.
              </span>
            </div>
          </div>

          {/* ─── RIGHT: In-Depth Explanation of Every Metric & Signal ─── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                DETAILED INFORMATION BREAKDOWN
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D]">
                How BizMind AI Interprets Your Financial Data
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Click any metric on the left or select an item below to see the intelligence logic behind each dashboard module.
              </p>
            </div>

            {/* Interactive Explanation Accordion / List */}
            <div className="space-y-3.5">
              {metricExplanations.map((item) => {
                const isSelected = selectedMetric === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMetric(item.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF7ED] border-[#FF6B00] shadow-md shadow-orange-500/10'
                        : 'bg-[#FFFFFF] border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className={`text-base font-bold ${isSelected ? 'text-[#FF6B00]' : 'text-[#0D0D0D]'}`}>
                        {item.title}
                      </h4>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#0D0D0D] text-white">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>

                    {isSelected && (
                      <ul className="mt-3 pt-3 border-t border-orange-200/60 space-y-1.5 text-xs text-gray-800 font-medium">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0D0D0D] hover:bg-black text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Try the Live Decision Simulator</span>
                <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
