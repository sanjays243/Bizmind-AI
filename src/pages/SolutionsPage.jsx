import React from 'react';
import { BarChart3, ShieldCheck, TrendingUp, Layers, Zap, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SolutionsPage({ onBackToHome, onGetStarted }) {
  const solutions = [
    {
      title: 'Cash Flow & Runway Intelligence',
      description: 'Predict cash balance fluctuations up to 90 days ahead. Prevent unexpected payroll droughts and avoid high-interest emergency borrowing.',
      metrics: '+90 Days Visibility',
      icon: TrendingUp
    },
    {
      title: 'Profit Margin & Leak Guard',
      description: 'Automatically monitor rising unit costs, vendor fees, and declining product margins. Get notified immediately when cost creep threatens profits.',
      metrics: 'Save 3-7% Revenue',
      icon: ShieldCheck
    },
    {
      title: 'Smart Capital Allocation',
      description: 'Plan equipment purchases, inventory restocking, and new hires with simulated ROI projections before spending your capital.',
      metrics: 'Zero Guesswork',
      icon: BarChart3
    },
    {
      title: 'Automated Financial Health Score',
      description: 'Get an executive-level health rating combining liquidity, operating efficiency, debt safety, and profit consistency in plain English.',
      metrics: 'Real-Time Score',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D0D0D] flex flex-col font-sans">
      {/* Breadcrumb Header */}
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
            <span className="text-[#FF6B00] font-bold">Solutions</span>
          </div>
        </div>
      </div>

      <section id="solutions" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              SOLUTIONS BY BIZMIND AI
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D0D0D] tracking-tight">
            Financial Intelligence Built for <span className="text-[#FF6B00]">High-Impact Decisions</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Stop drowning in spreadsheets. BizMind AI automates complex financial analysis and delivers clear, decisive recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-gray-200 hover:border-[#FF6B00] bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold font-mono px-3 py-1 bg-[#FFF7ED] text-[#FF6B00] rounded-full border border-[#FFEDD5]">
                    {item.metrics}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0D0D0D]">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0D0D0D] text-white p-8 sm:p-12 rounded-3xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to Transform How You Manage Your Business?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Get instant financial intelligence, predictive runway models, and an AI advisory co-pilot today.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Free with BizMind AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D0D0D]">BizMind <span className="text-[#FF6B00]">AI</span></span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <button onClick={onBackToHome} className="hover:text-[#FF6B00] transition-colors cursor-pointer">
            Back to Home
          </button>
        </div>
      </footer>
    </div>
  );
}
