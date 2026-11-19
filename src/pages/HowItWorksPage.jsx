import React from 'react';
import { ArrowLeft, ArrowRight, Database, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage({ onBackToHome, onGetStarted }) {
  const steps = [
    {
      num: '01',
      title: 'Connect & Sync Your Business Data',
      desc: 'Link your business bank accounts, Stripe, QuickBooks, or upload simple CSV/Excel spreadsheets with end-to-end 256-bit encryption.',
      detail: 'Setup takes under 3 minutes with zero manual journal entry required.'
    },
    {
      num: '02',
      title: 'Neural Pattern & Margin Synthesis',
      desc: 'Our financial intelligence models analyze cash flows, customer acquisition expenses, vendor price inflation, and recurring burn rates.',
      detail: 'Detects invisible cost leaks and calculates realistic 90-day cash projections.'
    },
    {
      num: '03',
      title: 'Actionable Executive Decisions',
      desc: 'Receive proactive recommendations. Ask questions in plain English and simulate scenarios before committing business capital.',
      detail: 'Clear, plain-English roadmap without confusing accounting jargon.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D0D0D] flex flex-col font-sans">
      <div className="bg-[#F4F4F5]/80 border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0D0D0D] hover:text-[#FF6B00] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
            <span>← Back to Home Overview</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span>Platform</span>
            <span>/</span>
            <span className="text-[#FF6B00] font-bold">How It Works</span>
          </div>
        </div>
      </div>

      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              THE 3-STEP INTELLIGENCE ENGINE
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D0D0D] tracking-tight">
            From Raw Numbers to <span className="text-[#FF6B00]">Clear Decisions</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            BizMind AI strips away accounting friction and gives you the exact answers you need to scale profitably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#FF6B00] shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center font-extrabold text-2xl shadow-md">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-[#0D0D0D] leading-snug">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#FF6B00]">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                <span>{step.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0D0D0D] text-white p-8 sm:p-12 rounded-3xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Experience How It Works?</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Join thousands of small business owners making smarter financial decisions with BizMind AI.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
