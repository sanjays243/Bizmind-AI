import React, { useState } from 'react';
import { Sliders, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function WhatIfSimulator({ business }) {
  // Baseline financials
  const baseRev = business.revenueEstimate?.estimatedMonthlyRevenue || 35000;
  const baseExp = business.monthlyExpenses?.total || 26000;
  const baseProfit = business.profitEstimate?.potentialOperatingProfit || 9000;
  const baseRent = business.monthlyExpenses?.rent || 4000;
  const baseMarketing = business.monthlyExpenses?.marketing || 2500;
  const baseSalaries = business.monthlyExpenses?.salaries || 8000;

  // Interactive Slider States
  const [salesChangePct, setSalesChangePct] = useState(0); // -50% to +50%
  const [priceChangePct, setPriceChangePct] = useState(0); // -30% to +30%
  const [rentChangePct, setRentChangePct] = useState(0); // -20% to +50%
  const [marketingBudget, setMarketingBudget] = useState(baseMarketing);
  const [employeeCountDelta, setEmployeeCountDelta] = useState(0); // -2 to +5

  // Calculations
  const adjustedRevenue = Math.round(
    baseRev * (1 + salesChangePct / 100) * (1 + priceChangePct / 100)
  );

  const adjustedRent = Math.round(baseRent * (1 + rentChangePct / 100));
  const avgWagePerEmployee = 2200;
  const adjustedSalaries = Math.max(2000, baseSalaries + employeeCountDelta * avgWagePerEmployee);
  const adjustedMaterials = Math.round(business.monthlyExpenses?.inventoryMaterials * (1 + salesChangePct / 100));
  const otherFixed = (baseExp - baseRent - baseMarketing - baseSalaries - (business.monthlyExpenses?.inventoryMaterials || 0));

  const adjustedExpenses = Math.round(
    adjustedRent + adjustedSalaries + adjustedMaterials + marketingBudget + otherFixed
  );

  const adjustedProfit = adjustedRevenue - adjustedExpenses;
  const adjustedMargin = Math.round((adjustedProfit / adjustedRevenue) * 100);

  const profitDifference = adjustedProfit - baseProfit;
  const isPositive = profitDifference >= 0;

  const handleReset = () => {
    setSalesChangePct(0);
    setPriceChangePct(0);
    setRentChangePct(0);
    setMarketingBudget(baseMarketing);
    setEmployeeCountDelta(0);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-8">
      {/* Simulator Card */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              <Sliders className="w-4 h-4" />
              <span>Interactive Decision Sandbox</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0D0D0D]">
              What-If Business Scenario Simulator
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Stress-test the business model. Adjust sales volume, pricing power, and cost assumptions to see real-time impact.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#0D0D0D] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        {/* Live Simulator KPI Output Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0D0D0D] text-white">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400">Simulated Revenue</span>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              {formatCurrency(adjustedRevenue)}
            </p>
            <span className="text-[10px] text-gray-400">Baseline: {formatCurrency(baseRev)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400">Simulated OPEX</span>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              {formatCurrency(adjustedExpenses)}
            </p>
            <span className="text-[10px] text-gray-400">Baseline: {formatCurrency(baseExp)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#FF6B00]">Simulated Profit</span>
            <p className="text-xl sm:text-2xl font-black text-[#FF6B00] font-mono">
              {formatCurrency(adjustedProfit)}
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {isPositive ? (
                <span className="text-emerald-400">+{formatCurrency(profitDifference)} vs base</span>
              ) : (
                <span className="text-rose-400">{formatCurrency(profitDifference)} vs base</span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400">Net Profit Margin</span>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              {adjustedMargin}%
            </p>
            <span className="text-[10px] text-gray-400">Baseline: {business.profitEstimate?.potentialProfitMargin || 24}%</span>
          </div>
        </div>

        {/* Controls / Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          
          {/* Slider 1: Sales Volume */}
          <div className="space-y-3 bg-[#F4F4F5]/60 p-5 rounded-2xl border border-gray-200/80">
            <div className="flex justify-between items-center text-xs font-extrabold text-[#0D0D0D]">
              <span>Customer Foot-Traffic / Sales Volume</span>
              <span className={`font-mono text-sm ${salesChangePct >= 0 ? 'text-[#FF6B00]' : 'text-red-600'}`}>
                {salesChangePct > 0 ? `+${salesChangePct}%` : `${salesChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={salesChangePct}
              onChange={(e) => setSalesChangePct(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>-50% (Recession / Low footfall)</span>
              <span>Baseline</span>
              <span>+50% (High Season)</span>
            </div>
          </div>

          {/* Slider 2: Price Change */}
          <div className="space-y-3 bg-[#F4F4F5]/60 p-5 rounded-2xl border border-gray-200/80">
            <div className="flex justify-between items-center text-xs font-extrabold text-[#0D0D0D]">
              <span>Price Point / Basket Inflation</span>
              <span className={`font-mono text-sm ${priceChangePct >= 0 ? 'text-[#FF6B00]' : 'text-red-600'}`}>
                {priceChangePct > 0 ? `+${priceChangePct}%` : `${priceChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="2"
              value={priceChangePct}
              onChange={(e) => setPriceChangePct(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>-30% Discounting</span>
              <span>Baseline</span>
              <span>+30% Premium Pricing</span>
            </div>
          </div>

          {/* Slider 3: Rent Change */}
          <div className="space-y-3 bg-[#F4F4F5]/60 p-5 rounded-2xl border border-gray-200/80">
            <div className="flex justify-between items-center text-xs font-extrabold text-[#0D0D0D]">
              <span>Lease Rent Rate Variance</span>
              <span className="font-mono text-sm text-[#0D0D0D]">
                {formatCurrency(adjustedRent)} ({rentChangePct > 0 ? `+${rentChangePct}%` : `${rentChangePct}%`})
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              step="5"
              value={rentChangePct}
              onChange={(e) => setRentChangePct(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>-20% Cheaper Location</span>
              <span>Base Rent</span>
              <span>+50% Prime Downtown</span>
            </div>
          </div>

          {/* Slider 4: Marketing Budget */}
          <div className="space-y-3 bg-[#F4F4F5]/60 p-5 rounded-2xl border border-gray-200/80">
            <div className="flex justify-between items-center text-xs font-extrabold text-[#0D0D0D]">
              <span>Monthly Paid Ad Budget</span>
              <span className="font-mono text-sm text-[#0D0D0D]">
                {formatCurrency(marketingBudget)} / mo
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={marketingBudget}
              onChange={(e) => setMarketingBudget(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>$500 (Organic focus)</span>
              <span>{formatCurrency(baseMarketing)} (Base)</span>
              <span>$10,000 (Aggressive)</span>
            </div>
          </div>

          {/* Slider 5: Staff Delta */}
          <div className="space-y-3 bg-[#F4F4F5]/60 p-5 rounded-2xl border border-gray-200/80 md:col-span-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-[#0D0D0D]">
              <span>Team Size Adjustment (Full/Part-time Staff)</span>
              <span className="font-mono text-sm text-[#FF6B00] font-bold">
                {employeeCountDelta === 0 ? 'Baseline Headcount' : `${employeeCountDelta > 0 ? `+${employeeCountDelta}` : employeeCountDelta} Employees`}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="5"
              step="1"
              value={employeeCountDelta}
              onChange={(e) => setEmployeeCountDelta(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>-2 (Lean founder-operated)</span>
              <span>Standard Team</span>
              <span>+5 (Heavy Service Staff)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
