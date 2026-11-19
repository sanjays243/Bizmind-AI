import React from 'react';
import { TrendingUp, DollarSign, Percent, AlertCircle } from 'lucide-react';

export default function ProfitAnalysis({ business }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const rev = business.revenueEstimate || {};
  const prof = business.profitEstimate || {};
  const exp = business.monthlyExpenses || {};

  return (
    <div className="space-y-8">
      {/* Top Banner with Profit High-Water Mark */}
      <div className="bg-gradient-to-r from-[#0D0D0D] to-[#1F1F1F] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Illustrative Unit Economics</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Revenue & Potential Profit Projection
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed">
            Modeled under standard steady-state operating volume with regular seasonal smoothing.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Potential Operating Profit</span>
            <p className="text-2xl sm:text-3xl font-black text-[#FF6B00] font-mono">
              {formatCurrency(prof.potentialOperatingProfit)}
              <span className="text-xs font-normal text-gray-400"> / mo</span>
            </p>
          </div>
          <div className="h-10 w-[1px] bg-white/20" />
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Profit Margin</span>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">
              {prof.potentialProfitMargin}%
            </p>
          </div>
        </div>
      </div>

      {/* Illustrative Unit Economics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Average Customers / Day
          </span>
          <p className="text-2xl font-black text-[#0D0D0D] font-mono">
            {rev.averageCustomersDay || 65}
          </p>
          <span className="text-[11px] text-gray-500">Peak & weekday volume blend</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Average Order Value (AOV)
          </span>
          <p className="text-2xl font-black text-[#0D0D0D] font-mono">
            {formatCurrency(rev.averageOrderValue)}
          </p>
          <span className="text-[11px] text-gray-500">Basket size / ticket average</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Estimated Daily Revenue
          </span>
          <p className="text-2xl font-black text-[#0D0D0D] font-mono">
            {formatCurrency(rev.estimatedDailyRevenue)}
          </p>
          <span className="text-[11px] text-gray-500">Gross receipt run-rate</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Estimated Monthly Revenue
          </span>
          <p className="text-2xl font-black text-[#FF6B00] font-mono">
            {formatCurrency(rev.estimatedMonthlyRevenue)}
          </p>
          <span className="text-[11px] text-gray-500">Based on 26 operating days</span>
        </div>
      </div>

      {/* P&L Waterfall Summary */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <h4 className="font-extrabold text-base text-[#0D0D0D]">
          Monthly Net Cash Flow Flowchart
        </h4>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 font-semibold">
            <span className="text-[#0D0D0D]">(+) Gross Monthly Revenue</span>
            <span className="font-mono text-[#0D0D0D] font-bold">{formatCurrency(rev.estimatedMonthlyRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 text-gray-600">
            <span>(-) Direct Cost of Inventory / Supplies (COGS)</span>
            <span className="font-mono text-red-600 font-medium">-{formatCurrency(exp.inventoryMaterials)}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 text-gray-600">
            <span>(-) Payroll, Wages & Contractor Compensation</span>
            <span className="font-mono text-red-600 font-medium">-{formatCurrency(exp.salaries)}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 text-gray-600">
            <span>(-) Facility Lease, Utilities & Maintenance</span>
            <span className="font-mono text-red-600 font-medium">-{formatCurrency((exp.rent || 0) + (exp.electricity || 0) + (exp.maintenance || 0))}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 text-gray-600">
            <span>(-) Marketing, Software & Overhead</span>
            <span className="font-mono text-red-600 font-medium">-{formatCurrency((exp.marketing || 0) + (exp.software || 0) + (exp.otherExpenses || 0))}</span>
          </div>
          <div className="flex justify-between items-center text-base py-3 bg-[#F4F4F5] px-4 rounded-xl font-extrabold text-[#0D0D0D]">
            <span>(=) Net Estimated Operating Cash Flow</span>
            <span className="font-mono text-[#FF6B00] text-lg font-black">{formatCurrency(prof.potentialOperatingProfit)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
          <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
          <span>Note: Figures represent illustrative pro forma projections and exclude federal/state corporate income tax.</span>
        </div>
      </div>
    </div>
  );
}
