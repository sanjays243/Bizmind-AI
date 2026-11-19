import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Sparkles, DollarSign, Clock, TrendingUp } from 'lucide-react';

export default function CalculatorPage({ onBackToHome, onGetStarted }) {
  const [cashBalance, setCashBalance] = useState(120000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(45000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000);

  const netCashFlow = monthlyRevenue - monthlyExpenses;
  const monthlyBurn = netCashFlow < 0 ? Math.abs(netCashFlow) : 0;
  const runwayMonths =
    monthlyBurn > 0 ? (cashBalance / monthlyBurn).toFixed(1) : 'Infinite (Profitable)';

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
            <span className="text-[#FF6B00] font-bold">Calculator</span>
          </div>
        </div>
      </div>

      <section id="calculator" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              INTERACTIVE BUSINESS CALCULATOR
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D0D0D] tracking-tight">
            Simulate Your <span className="text-[#FF6B00]">Cash Runway & Burn Rate</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Adjust the sliders below to calculate how changes in revenue, overhead, and cash reserves impact your business survival timeline.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          {/* Sliders Form */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-[#0D0D0D] mb-2">
                <span>Current Cash Reserves</span>
                <span className="text-[#FF6B00] font-mono text-base">${cashBalance.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={cashBalance}
                onChange={(e) => setCashBalance(Number(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-[#0D0D0D] mb-2">
                <span>Monthly Inflow / Revenue</span>
                <span className="text-[#FF6B00] font-mono text-base">${monthlyRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={2500}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-[#0D0D0D] mb-2">
                <span>Monthly Outflow / Operating Expenses</span>
                <span className="text-[#FF6B00] font-mono text-base">${monthlyExpenses.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={2500}
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="md:col-span-5 bg-[#0D0D0D] text-white p-6 sm:p-8 rounded-2xl border border-[#1F1F1F] shadow-inner space-y-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Calculated Projection
            </span>
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#FF6B00] font-mono">
                {runwayMonths} {typeof runwayMonths === 'string' && runwayMonths.includes('Infinite') ? '' : 'Mo'}
              </div>
              <p className="text-xs text-gray-400">Estimated Cash Runway</p>
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-3 text-left text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Net Flow:</span>
                <span className={`font-bold ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-[#FF6B00]'}`}>
                  {netCashFlow >= 0 ? `+$${netCashFlow.toLocaleString()}` : `-$${Math.abs(netCashFlow).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Burn Rate:</span>
                <span className="font-bold text-white">
                  ${monthlyBurn.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F4F4F5] border border-gray-200 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D]">
            Need More Granular Financial Scenario Testing?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            BizMind AI includes multi-variable scenario modeling for hiring, inventory cycles, and tax forecasting.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Full Financial Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
