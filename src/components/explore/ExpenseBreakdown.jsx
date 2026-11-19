import React from 'react';
import { CreditCard, TrendingDown, Layers } from 'lucide-react';

export default function ExpenseBreakdown({ business }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const exp = business.monthlyExpenses || {};

  const expenseItems = [
    { label: 'Facility Rent & Common Area Maintenance', val: exp.rent, desc: 'Commercial physical space occupancy cost' },
    { label: 'Staff Salaries & Hourly Payroll', val: exp.salaries, desc: 'Base wages, employer payroll taxes, contractor fees' },
    { label: 'Cost of Goods / Raw Materials / Inventory', val: exp.inventoryMaterials, desc: 'Direct COGS to sustain monthly customer volume' },
    { label: 'Electricity, Gas & Water Utilities', val: exp.electricity, desc: 'Commercial power, HVAC, water service' },
    { label: 'Digital Ads & Growth Marketing', val: exp.marketing, desc: 'Meta/Google local campaigns, creative assets' },
    { label: 'Logistics, Fuel & Transportation', val: exp.transportation, desc: 'Delivery vehicle fuel, supplier freight' },
    { label: 'Software, POS & Cloud SaaS Subscriptions', val: exp.software, desc: 'POS fees, accounting, CRM, analytics tools' },
    { label: 'Preventative Equipment Maintenance', val: exp.maintenance, desc: 'Machine servicing, repairs, cleaning contracts' },
    { label: 'Insurance, Accounting & Sundry Expenses', val: exp.otherExpenses, desc: 'General liability, merchant charges, miscellaneous' }
  ];

  const totalCalculated = expenseItems.reduce((sum, it) => sum + (it.val || 0), 0);

  return (
    <div className="space-y-8">
      {/* Monthly Expense Header Banner */}
      <div className="bg-[#FFFFFF] border border-gray-200/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            <TrendingDown className="w-4 h-4" />
            <span>Monthly Cost of Doing Business</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D]">
            Recurring Monthly Operating Expenses (OPEX)
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            A comprehensive overview of monthly cash outflows required to operate at target capacity.
          </p>
        </div>

        <div className="bg-[#F4F4F5] border border-gray-200 p-4 rounded-xl text-left sm:text-right min-w-[220px]">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total Monthly Burn</span>
          <p className="text-2xl font-black text-[#0D0D0D]">
            {formatCurrency(totalCalculated)}
            <span className="text-xs font-normal text-gray-500"> / mo</span>
          </p>
        </div>
      </div>

      {/* Itemized Grid of Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenseItems.map((item, idx) => {
          const pct = totalCalculated > 0 ? Math.round((item.val / totalCalculated) * 100) : 0;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-200/80 rounded-xl p-4 space-y-2 hover:border-[#FF6B00] transition-colors shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-extrabold text-[#0D0D0D] leading-tight">
                  {item.label}
                </span>
                <span className="text-xs font-bold font-mono text-[#FF6B00]">
                  {pct}%
                </span>
              </div>
              <p className="text-lg font-black text-[#0D0D0D] font-mono">
                {formatCurrency(item.val)}
              </p>
              <p className="text-[11px] text-gray-500 line-clamp-2">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
