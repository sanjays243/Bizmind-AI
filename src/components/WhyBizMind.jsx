import React from 'react';
import {
  Lightbulb,
  Wallet,
  ChartNoAxesCombined,
  TriangleAlert,
  Compass,
  ArrowRight,
  Check,
  X,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

/**
 * Reusable ProblemCard Component
 * Displays a problem topic with an image, Lucide icon, problem description,
 * and BizMind AI proactive decision solution.
 */
function ProblemCard({
  icon: Icon,
  image,
  title,
  description,
  solution,
  stepNumber,
}) {
  return (
    <div className="group bg-[#FFFFFF] border border-[#F4F4F5] hover:border-[#FF6B00] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(13,13,13,0.03)] hover:shadow-[0_12px_30px_rgba(255,107,0,0.12)] transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Topic Visual Header */}
      <div className="relative h-48 w-full overflow-hidden bg-[#0D0D0D]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
          loading="lazy"
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-70" />

        {/* Floating Icon & Step Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#0D0D0D]/90 border border-white/10 backdrop-blur-md flex items-center justify-center text-[#FF6B00] shadow-md group-hover:bg-[#FF6B00] group-hover:text-white transition-colors duration-300">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-1 rounded-md bg-[#0D0D0D]/80 text-[#FFFFFF] backdrop-blur-sm border border-white/10">
            {stepNumber}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
        {/* Problem Section */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#0D0D0D] leading-snug group-hover:text-[#FF6B00] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* BizMind AI Solution Box */}
        <div className="p-4 rounded-xl bg-[#F4F4F5] border-l-4 border-[#FF6B00] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>BizMind Solution</span>
          </div>
          <p className="text-xs sm:text-[13px] text-[#0D0D0D] font-medium leading-relaxed">
            {solution}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * WhyBizMind Component
 * 
 * Strict Color Palette:
 * - Rich Black: #0D0D0D
 * - White: #FFFFFF
 * - Orange: #FF6B00
 * - Light Gray: #F4F4F5
 * - Dark Border: #1F1F1F
 */
export default function WhyBizMind({
  onExploreBizMind,
  onExploreIdeas,
}) {
  // Five Problem Cards configuration with corresponding images and Lucide icons
  const problemCards = [
    {
      id: 1,
      stepNumber: '01',
      icon: Lightbulb,
      image: '/images/validation.jpg',
      title: "Don't Know Which Business to Start?",
      description:
        'New entrepreneurs often struggle to understand market demand, competition, investment requirements, and profit potential before starting a business.',
      solution:
        'BizMind AI helps users explore business ideas, analyze market opportunities, estimate investment, and understand possible risks before making a decision.',
    },
    {
      id: 2,
      stepNumber: '02',
      icon: Wallet,
      image: '/images/investment.jpg',
      title: "Don't Know Where to Invest Your Money?",
      description:
        'Small business owners have limited capital and may not know how much to spend on equipment, inventory, employees, marketing, or working capital.',
      solution:
        'BizMind AI provides investment planning and helps compare different spending scenarios before money is committed.',
    },
    {
      id: 3,
      stepNumber: '03',
      icon: ChartNoAxesCombined,
      image: '/images/financial.jpg',
      title: "Don't Know Where Your Money Is Going?",
      description:
        'Many owners record transactions but do not clearly understand why their profit is increasing or decreasing.',
      solution:
        'BizMind AI analyzes income, expenses, cash flow, and profitability in simple language so owners can understand what is happening.',
    },
    {
      id: 4,
      stepNumber: '04',
      icon: TriangleAlert,
      image: '/images/risk.jpg',
      title: "Don't Know When a Problem Is Coming?",
      description:
        'Declining sales, overdue payments, unnecessary expenses, and slow-moving inventory can create serious business problems.',
      solution:
        'BizMind AI detects unusual patterns, identifies possible risks, and provides early warnings before problems become bigger.',
    },
    {
      id: 5,
      stepNumber: '05',
      icon: Compass,
      image: '/images/growth.jpg',
      title: "Don't Know What to Do Next?",
      description:
        'Business owners may know their numbers but still feel confused about pricing, marketing, hiring, expansion, or improving profit.',
      solution:
        'BizMind AI explains the numbers and suggests possible actions based on business performance and available data.',
    },
  ];

  return (
    <section
      id="problem"
      className="scroll-mt-20 bg-[#FFFFFF] py-20 lg:py-28 border-t border-[#F4F4F5] relative overflow-hidden"
    >
      {/* Secondary anchor support for direct URL navigation */}
      <span id="why-bizmind" className="absolute top-0 -mt-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* ─── 1. Header & Main Visual Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Section Label, Main Heading, Description */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Section Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                WHY BIZMIND AI
              </span>
            </div>

            {/* 2. Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D0D0D] tracking-tight leading-[1.15]">
              Small Businesses Don't Need More Data.{' '}
              <span className="text-[#FF6B00] block mt-1">
                They Need Better Decisions.
              </span>
            </h2>

            {/* 3. Description */}
            <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
              <p>
                Running a small business is not only about recording sales and expenses.
                Business owners need to understand where their money is going, what is
                causing problems, where to invest, and what they should do next.
              </p>
              <p className="font-medium text-[#0D0D0D]">
                BizMind AI converts business data into simple insights, useful
                recommendations, and practical decisions.
              </p>
            </div>
          </div>

          {/* Right Column: Main Visual SaaS Dashboard Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-[#0D0D0D] group">
              {/* Hero Image */}
              <img
                src="/images/decision_hero.jpg"
                alt="Small business owner reviewing business performance and financial intelligence"
                className="w-full h-80 sm:h-96 object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark FinTech Overlay with Orange Highlights */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />

              {/* Floating Dashboard Card: Profit & Revenue Indicator */}
              <div className="absolute top-4 right-4 bg-[#FFFFFF]/95 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF7ED] flex items-center justify-center text-[#FF6B00]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Net Profit Growth
                  </div>
                  <div className="text-sm font-extrabold text-[#0D0D0D] flex items-center gap-1">
                    +$29,850{' '}
                    <span className="text-xs font-semibold text-[#FF6B00]">
                      (+24.8%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Dashboard Bottom Notification: AI Insight */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0D0D0D]/95 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                      BizMind AI Insight
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">Just now</span>
                </div>
                <p className="text-xs text-white leading-relaxed">
                  "Supplier costs increased by 8% on batch inventory. Switching to bulk terms will save{' '}
                  <strong className="text-[#FF6B00]">$1,450/month</strong> and protect your 61% gross margin."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. Five Problem Cards ─── */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              The Core Challenges
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] mt-2">
              Five Critical Questions Every Business Owner Faces
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              BizMind AI replaces uncertainty with step-by-step clarity for each stage of your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
            {problemCards.slice(0, 3).map((card) => (
              <ProblemCard key={card.id} {...card} />
            ))}
          </div>

          {/* Bottom 2 Cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {problemCards.slice(3).map((card) => (
              <ProblemCard key={card.id} {...card} />
            ))}
          </div>
        </div>

        {/* ─── 3. Comparison Banner: Traditional Tools vs BizMind AI ─── */}
        <div className="bg-[#0D0D0D] rounded-3xl p-8 sm:p-12 lg:p-14 text-white border border-[#1F1F1F] shadow-2xl relative overflow-hidden">
          {/* Subtle Orange Glow Decor */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Banner Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Clear Paradigm Shift
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-2 text-white leading-tight">
              Traditional Tools Show What Happened.{' '}
              <span className="text-[#FF6B00] block sm:inline">
                BizMind AI Helps Explain What to Do Next.
              </span>
            </h3>
          </div>

          {/* Two Columns with Orange Divider */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-center relative z-10">
            {/* Column 1: Traditional Business Tools */}
            <div className="lg:col-span-5 bg-[#1F1F1F]/60 border border-white/5 p-6 sm:p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-lg font-bold text-gray-300">
                  Traditional Business Tools
                </h4>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>Record transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>Show reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>Track income and expenses</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>Require users to interpret the data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>Usually do not provide personalized next steps</span>
                </li>
              </ul>
            </div>

            {/* Middle Divider / Arrow */}
            <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Column 2: BizMind AI */}
            <div className="lg:col-span-5 bg-[#1F1F1F] border border-[#FF6B00]/40 p-6 sm:p-8 rounded-2xl space-y-4 shadow-xl shadow-orange-500/5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#FF6B00]/20">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  BizMind <span className="text-[#FF6B00]">AI</span>
                </h4>
              </div>
              <ul className="space-y-3 text-sm text-white">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Understands business patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Explains why changes happened</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Forecasts possible future outcomes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Detects risks and unusual activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Suggests practical decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Helps beginners understand business concepts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── 4. Bottom CTA ─── */}
        <div className="bg-[#F4F4F5] border border-gray-200 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight">
              Turn Your Business Data Into Better Decisions.
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Understand your business clearly, identify risks early, and discover
              opportunities for smarter growth.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onExploreBizMind}
              className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#FF6B00] hover:bg-[#E05E00] border border-transparent hover:border-[#0D0D0D] rounded-xl shadow-md hover:shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore BizMind AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onExploreIdeas}
              className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#FF6B00] hover:bg-[#E05E00] border border-transparent hover:border-[#0D0D0D] rounded-xl shadow-md hover:shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Business Ideas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
