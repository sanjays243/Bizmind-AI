import React from 'react';
import { Eye, TrendingUp, BrainCircuit, Rocket, ArrowRight } from 'lucide-react';

/**
 * BusinessValueStrip Component
 * 
 * Strict Design System:
 * - Rich Black: #0D0D0D
 * - White: #FFFFFF
 * - Orange: #FF6B00
 * - Dark Border: #1F1F1F
 * - Light Gray: #F4F4F5
 * 
 * Displays the 4 pillars: Understand, Predict, Decide, Grow
 */
export default function BusinessValueStrip({ onActionClick }) {
  const valueItems = [
    {
      step: '01',
      title: 'Understand',
      icon: Eye,
      description:
        'Know exactly what is happening with your revenue, expenses, cash flow, and profitability.',
    },
    {
      step: '02',
      title: 'Predict',
      icon: TrendingUp,
      description:
        'See potential financial outcomes with AI-powered forecasts and business projections.',
    },
    {
      step: '03',
      title: 'Decide',
      icon: BrainCircuit,
      description:
        'Get clear recommendations based on your business data and goals.',
    },
    {
      step: '04',
      title: 'Grow',
      icon: Rocket,
      description:
        'Identify opportunities, reduce unnecessary costs, manage risks, and plan your next move.',
    },
  ];

  return (
    <section className="bg-[#FFFFFF] py-16 sm:py-20 border-b border-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              CORE INTELLIGENCE PILLARS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight">
            Everything You Need to Make{' '}
            <span className="text-[#FF6B00]">Smarter Business Decisions</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            BizMind AI guides small business owners through four continuous stages of financial clarity and growth.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group bg-[#FFFFFF] border border-[#F4F4F5] hover:border-[#FF6B00] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(13,13,13,0.03)] hover:shadow-[0_12px_30px_rgba(255,107,0,0.12)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Step number */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0D0D0D] group-hover:text-[#FF6B00] transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Subtle Interactive Footer */}
                <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF6B00] group-hover:translate-x-0.5 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
