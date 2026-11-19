import React from 'react';
import { DollarSign, PieChart, ShieldAlert } from 'lucide-react';

export default function InvestmentBreakdown({ business }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const bd = business.investmentBreakdown || {};

  const items = [
    { label: 'Business Registration & Permits', key: 'businessRegistration', val: bd.businessRegistration, desc: 'Entity filing, local licenses, insurance bind' },
    { label: 'Location Security Deposit / Lease', key: 'locationDeposit', val: bd.locationDeposit, desc: 'Initial commercial lease deposit (1-2 months)' },
    { label: 'Core Commercial Equipment', key: 'equipment', val: bd.equipment, desc: 'Primary hardware, machinery, specialized tools' },
    { label: 'Interior Fitout & Branding', key: 'interior', val: bd.interior, desc: 'Lighting, painting, customer counters, signage' },
    { label: 'Opening Inventory & Raw Materials', key: 'inventory', val: bd.inventory, desc: 'First 45-day operational batch of supplies' },
    { label: 'Technology & POS Systems', key: 'technology', val: bd.technology, desc: 'Terminals, receipt printers, security cameras, cloud POS' },
    { label: 'Launch Marketing & Signage', key: 'marketing', val: bd.marketing, desc: 'Exterior brand sign, opening local ad spend' },
    { label: 'Staff Recruitment & Training Setup', key: 'staffSetup', val: bd.staffSetup, desc: 'Uniforms, background checks, initial onboarding' },
    { label: 'Operating Working Capital Buffer', key: 'workingCapital', val: bd.workingCapital, desc: '3-4 month cash runway buffer for early cash flow stability' },
    { label: 'Contingency & Other Costs', key: 'otherCosts', val: bd.otherCosts, desc: 'Incidentals, unexpected freight, petty cash reserve' }
  ];

  const totalCalculated = items.reduce((acc, item) => acc + (item.val || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Summary Banner */}
      <div className="bg-[#0D0D0D] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            CAPITAL DEPLOYMENT PLAN
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Estimated Startup Investment
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md">
            Itemized capital allocation model based on standard turnkey setup benchmarks.
          </p>
        </div>

        <div className="z-10 text-left sm:text-right bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
          <span className="text-xs uppercase font-bold text-gray-400">Total Capital Required</span>
          <p className="text-2xl sm:text-3xl font-black text-[#FF6B00]">
            {formatCurrency(business.investmentMin)} – {formatCurrency(business.investmentMax)}
          </p>
          <span className="text-[11px] text-gray-400">Illustrative target midpoint: {formatCurrency(totalCalculated)}</span>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#FF6B00]" />
            <h4 className="font-extrabold text-base text-[#0D0D0D]">
              Itemized Startup Cost Schedule
            </h4>
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            All figures illustrative
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F4F4F5] border-b border-gray-200/80 text-[#0D0D0D] font-extrabold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-5">Expense Category</th>
                <th className="py-3.5 px-5">Description & Scope</th>
                <th className="py-3.5 px-5 text-right">Estimated Cost</th>
                <th className="py-3.5 px-5 text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, idx) => {
                const sharePct = totalCalculated > 0 ? Math.round((it.val / totalCalculated) * 100) : 0;
                return (
                  <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#0D0D0D]">
                      {it.label}
                    </td>
                    <td className="py-3.5 px-5 text-gray-600 text-xs">
                      {it.desc}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-[#0D0D0D]">
                      {formatCurrency(it.val)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-gray-500">
                      {sharePct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#0D0D0D] text-white font-extrabold">
                <td colSpan={2} className="py-4 px-5 text-sm uppercase tracking-wider">
                  Total Initial Investment Capital
                </td>
                <td className="py-4 px-5 text-right font-mono text-base text-[#FF6B00]">
                  {formatCurrency(totalCalculated)}
                </td>
                <td className="py-4 px-5 text-right font-mono text-sm">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
