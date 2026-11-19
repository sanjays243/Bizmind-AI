import React from 'react';
import { ArrowLeft, ArrowRight, Layers, TrendingUp, AlertTriangle, Calculator, Bot, ShieldCheck, Zap } from 'lucide-react';

export default function FeaturesPage({ onBackToHome, onGetStarted }) {
  const features = [
    {
      title: 'Interactive Scenario Simulator',
      desc: 'Test "what-if" decisions before spending a dollar. Simulate new employee hires, price increases, marketing budget spikes, or seasonal revenue drops.',
      icon: Layers
    },
    {
      title: 'Predictive Cash Runway Meter',
      desc: 'Live countdown of your operational runway based on current trailing burn rate and receivable turnaround timelines.',
      icon: TrendingUp
    },
    {
      title: 'Real-Time Anomaly & Risk Alerts',
      desc: 'Detect duplicate vendor invoices, abnormal subscription cost increases, and sudden drops in product gross margin.',
      icon: AlertTriangle
    },
    {
      title: 'Plain-English AI CFO Co-Pilot',
      desc: 'Ask complex financial questions in conversation and get immediate, contextual advice backed by your actual transaction data.',
      icon: Bot
    },
    {
      title: 'Unit Economics Deconstruct',
      desc: 'Unpack the exact profitability of every customer segment, product line, or hourly service contract.',
      icon: Calculator
    },
    {
      title: 'Loss Prevention & Waste Detection',
      desc: 'Highlight unprofitable operations, stagnant inventory holding costs, and low-margin customer profiles.',
      icon: ShieldCheck
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
            <span className="text-[#FF6B00] font-bold">Features</span>
          </div>
        </div>
      </div>

      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              CORE PLATFORM CAPABILITIES
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D0D0D] tracking-tight">
            Engineered for <span className="text-[#FF6B00]">Clarity and Action</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Every feature in BizMind AI is designed to protect your margin, forecast runway, and guide your next move.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-gray-200 hover:border-[#FF6B00] shadow-sm hover:shadow-xl transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0D0D0D]">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-[#0D0D0D] text-white p-8 sm:p-12 rounded-3xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Take Control of Your Financial Future?</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Get access to all enterprise features tailored specifically for small business owners.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Using Features</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
