import React from 'react';
import HeroSection from '../components/HeroSection';
import BusinessValueStrip from '../components/BusinessValueStrip';
import FinancialDashboardSection from '../components/FinancialDashboardSection';
import WhyBizMind from '../components/WhyBizMind';
import { BarChart3, TrendingUp, Layers, ShieldCheck, Bot, Calculator, ArrowRight } from 'lucide-react';

/**
 * HomePage Component
 * 
 * Strict Color System:
 * - Rich Black: #0D0D0D
 * - White: #FFFFFF
 * - Orange: #FF6B00
 * - Dark Border: #1F1F1F
 * - Light Gray: #F4F4F5
 * 
 * Page Flow:
 * 1. Hero Section (Unobstructed background image on right, crisp headline & CTAs on left)
 * 2. Business Value Strip (Understand, Predict, Decide, Grow)
 * 3. Financial Dashboard Section (Dashboard card below with detailed explanations of Revenue, Expenses, Profit, Health, 90D Forecast, AI Advice & Risks)
 * 4. Why BizMind Section (5 Problem cards with topic images, Comparison banner, Bottom CTA)
 * 5. Platform Hub Fast Navigator
 */
export default function HomePage({
  onNavigate,
  onSignUp,
  onLiveDemo,
  onExploreBizMind,
  onExploreIdeas,
}) {
  return (
    <div className="space-y-0">
      {/* ─── 1. Hero Section (Clean background image, no overlapping card) ─── */}
      <HeroSection
        onSignUp={onSignUp}
        onLiveDemo={onLiveDemo}
      />

      {/* ─── 2. Business Value Strip ─── */}
      <BusinessValueStrip
        onActionClick={onExploreBizMind}
      />

      {/* ─── 3. Financial Intelligence Dashboard & Detailed Breakdown ─── */}
      <FinancialDashboardSection
        onGetStarted={onSignUp}
      />

      {/* ─── 4. Why BizMind Section (Connected to #problem) ─── */}
      <WhyBizMind
        onExploreBizMind={onExploreBizMind}
        onExploreIdeas={onExploreIdeas}
      />

      {/* ─── 5. Platform Hub / Fast Navigator to Other Dedicated Pages ─── */}
      <section className="py-20 bg-[#F4F4F5]/60 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              EXPLORE THE PLATFORM
            </span>
            <h2 className="text-3xl font-extrabold text-[#0D0D0D]">
              Every Tool You Need to Scale Confidently
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Click any section below to view its dedicated page and in-depth capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'solutions',
                label: 'Solutions',
                desc: 'Cash flow intelligence, profit margin guardian, and smart capital planning.',
                icon: BarChart3
              },
              {
                id: 'how-it-works',
                label: 'How It Works',
                desc: 'Simple 3-step engine: sync accounts, synthesize trends, receive clear decisions.',
                icon: Layers
              },
              {
                id: 'explore-businesses',
                label: 'Explore Businesses',
                desc: 'Sector-specific intelligence for retail, e-commerce, restaurants, agencies, and trades.',
                icon: TrendingUp
              },
              {
                id: 'features',
                label: 'Features',
                desc: 'Scenario simulator, burn & runway meter, margin health radar, and risk alerts.',
                icon: ShieldCheck
              },
              {
                id: 'ai-advisor',
                label: 'AI Advisor',
                desc: 'Your 24/7 virtual CFO co-pilot ready to answer any business decision question.',
                icon: Bot
              },
              {
                id: 'calculator',
                label: 'Business Calculator',
                desc: 'Interactive cash runway, monthly burn, and investment scenario modeler.',
                icon: Calculator
              }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => onNavigate(card.id)}
                  className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#FF6B00] shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-[#0D0D0D] group-hover:text-[#FF6B00] transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                    <span>Open {card.label} Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
