import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  Sparkles,
  Receipt,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Building2,
  Calendar,
  Flame,
  ShieldAlert,
  Sliders,
  X,
  Loader2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { businessService } from '../../services/business.service';

export default function UserDashboardOverview() {
  const { currentUser } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [runwayData, setRunwayData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Budget Adjust Modal State
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editReserves, setEditReserves] = useState(25000);
  const [editBudgets, setEditBudgets] = useState([]);
  const [savingBudgets, setSavingBudgets] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [bizData, txData] = await Promise.all([
        businessService.getMyBusinesses(),
        businessService.getTransactions({ limit: 5 }),
      ]);

      const list = bizData?.businesses || [];
      setBusinesses(list);
      setTransactions(txData?.transactions || []);

      if (list.length > 0) {
        const defaultBiz = list.find((b) => b.isDefault) || list[0];
        try {
          const [sumData, rData] = await Promise.all([
            businessService.getBusinessSummary(defaultBiz._id).catch(() => null),
            businessService.getBudgetsAndRunway(defaultBiz._id).catch(() => null),
          ]);
          setSummary(sumData);
          if (rData?.data) {
            setRunwayData(rData.data);
            setEditReserves(rData.data.runway?.cashReserves || 25000);
            setEditBudgets(rData.data.budgets || []);
          }
        } catch {
          // Fallback if calculations not ready
        }
      }
    } catch (err) {
      console.warn('User dashboard data fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSaveBudgets = async (e) => {
    e.preventDefault();
    if (!activeBusiness) return;
    setSavingBudgets(true);
    try {
      await businessService.updateBudgets(activeBusiness._id, {
        cashReserves: Number(editReserves),
        categoryBudgets: editBudgets.map((b) => ({ category: b.category, budget: Number(b.budget) || 0 })),
      });
      showToast('Budget and cash reserve parameters updated!');
      setShowBudgetModal(false);
      loadUserData();
    } catch (err) {
      showToast(err.message || 'Failed to update budget settings.');
    } finally {
      setSavingBudgets(false);
    }
  };

  const activeBusiness = businesses.find((b) => b.isDefault) || businesses[0] || null;
  const currentMonthData = summary?.currentMonth || null;
  const hasFinancialData = currentMonthData && (currentMonthData.income > 0 || currentMonthData.expenses > 0);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-[#FFFFFF] border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Founder Decision Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Welcome back, {currentUser?.firstName || 'Founder'}!
          </h1>
          <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
            Manage your operating ventures, record actual income and expenditure, and evaluate new business opportunities with verified unit economic models.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard/invoices"
            className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#FF6B00]" />
            <span>Invoices & A/R</span>
          </Link>
          <Link
            to="/businesses"
            className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white text-xs font-bold rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Ideas</span>
          </Link>
        </div>
      </div>

      {/* If User has NO businesses yet: Empty State */}
      {!loading && businesses.length === 0 && (
        <div className="bg-[#FFFFFF] border border-dashed border-gray-300 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mx-auto border border-[#FF6B00]/20">
            <Briefcase className="w-8 h-8 text-[#FF6B00]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-[#0D0D0D]">
              No Business Profiles Created Yet
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Start by establishing your first operating venture profile to record transactions and unlock cash flow tracking, or explore proven small business opportunities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard/businesses"
              className="py-2.5 px-6 rounded-xl bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
            >
              Set Up Business Profile
            </Link>
            <Link
              to="/businesses"
              className="py-2.5 px-6 rounded-xl bg-[#FF6B00] hover:bg-[#E05300] text-white text-xs font-bold shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer w-full sm:w-auto"
            >
              Browse 100+ Business Ideas
            </Link>
          </div>
        </div>
      )}

      {/* ACTIVE BUSINESS SUMMARY & METRICS */}
      {activeBusiness && (
        <div className="space-y-6">
          {/* Active Business Selector Strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FF6B00]" />
              <h2 className="text-sm font-bold text-[#0D0D0D]">
                Active Business: <span className="text-[#FF6B00]">{activeBusiness.name}</span>
              </h2>
            </div>
            <Link
              to="/dashboard/businesses"
              className="text-xs font-bold text-gray-500 hover:text-[#0D0D0D] transition-colors"
            >
              Switch Business ({businesses.length} total) →
            </Link>
          </div>

          {/* Financial Summary Cards */}
          {hasFinancialData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Monthly Revenue
                </span>
                <span className="text-2xl font-extrabold text-[#0D0D0D] block">
                  {formatCurrency(currentMonthData.income)}
                </span>
                <span className="text-[11px] text-gray-500 block">Actual verified receipts</span>
              </div>

              <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Monthly Expenses
                </span>
                <span className="text-2xl font-extrabold text-[#0D0D0D] block">
                  {formatCurrency(currentMonthData.expenses)}
                </span>
                <span className="text-[11px] text-gray-500 block">Operating expenditures</span>
              </div>

              <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Operating Profit
                </span>
                <span
                  className={`text-2xl font-extrabold block ${
                    currentMonthData.profit >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(currentMonthData.profit)}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  {currentMonthData.profitMargin}% operating margin
                </span>
              </div>

              <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-5 shadow-xs space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Health Score
                </span>
                <span className="text-2xl font-extrabold text-[#FF6B00] block">
                  {activeBusiness.metrics?.healthScore || 80}/100
                </span>
                <span className="text-[11px] text-gray-500 block">Calculated from activity</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0D0D0D]">No Transactions Recorded for Current Month</h4>
                <p className="text-xs text-gray-500">
                  Add revenue or expense transactions to calculate real-time operating profit, unit margins, and health metrics.
                </p>
              </div>
              <Link
                to="/dashboard/transactions"
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#0D0D0D] text-white text-xs font-bold hover:bg-black transition-colors shrink-0"
              >
                <Plus className="w-4 h-4 text-[#FF6B00]" />
                <span>Add Transaction</span>
              </Link>
            </div>
          )}

          {/* ─── CASH RUNWAY & BUDGET CAPS DUAL WIDGET ─── */}
          {runwayData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Cash Runway Meter (5 cols) */}
              <div className="lg:col-span-5 bg-[#0D0D0D] text-white rounded-3xl p-6 shadow-md border border-[#1F1F1F] flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/20 text-[#FF6B00] flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Cash Runway Meter</h3>
                      <p className="text-[11px] text-gray-400">Survival buffer based on net burn</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(true)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                    title="Adjust Cash Reserves"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>

                {/* Big Runway Display */}
                <div className="bg-[#18181B] rounded-2xl p-5 border border-gray-800 text-center space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                    Estimated Survival Runway
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#FF6B00] font-mono">
                    {runwayData.runway?.months}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {runwayData.runway?.netCashFlow >= 0
                      ? 'Your business is currently cash-flow positive! Surplus is adding to reserves.'
                      : `Net Monthly Burn: $${runwayData.runway?.monthlyBurnRate?.toLocaleString()}/mo.`}
                  </p>
                </div>

                {/* Reserves & Burn Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Liquid Reserves</span>
                    <span className="font-extrabold text-white font-mono text-sm">
                      ${runwayData.runway?.cashReserves?.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Monthly Burn Rate</span>
                    <span className="font-extrabold text-amber-400 font-mono text-sm">
                      ${runwayData.runway?.monthlyBurnRate?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Budget Caps (7 cols) */}
              <div className="lg:col-span-7 bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0D0D0D]">Monthly Budget Limits & Consumption</h3>
                    <p className="text-[11px] text-gray-400">Track and curb category cost creep</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(true)}
                    className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Set Caps</span>
                  </button>
                </div>

                {/* Progress bars list */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {runwayData.budgets?.map((b, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-800">{b.category}</span>
                        <span className="font-mono text-gray-500 text-[11px]">
                          <strong>${b.spent.toLocaleString()}</strong> of ${b.budget.toLocaleString()} ({b.percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            b.isOver
                              ? 'bg-red-600'
                              : b.percent >= 80
                              ? 'bg-amber-500'
                              : 'bg-[#FF6B00]'
                          }`}
                          style={{ width: `${Math.min(100, b.percent)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Overall Budget Consumption:</span>
                  <span className="font-bold text-gray-900 font-mono">
                    ${runwayData.overallBudget?.totalSpent?.toLocaleString()} / ${runwayData.overallBudget?.totalBudget?.toLocaleString()} ({runwayData.overallBudget?.percentUsed}%)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Transactions Table (8 cols) */}
            <div className="lg:col-span-8 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0D0D0D]">Recent Transactions</h3>
                  <p className="text-xs text-gray-400">Latest recorded income and expense entries</p>
                </div>
                <Link
                  to="/dashboard/transactions"
                  className="text-xs font-bold text-[#FF6B00] hover:underline"
                >
                  View All
                </Link>
              </div>

              {transactions.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  No transactions recorded yet. Click "Add Transaction" to enter your first cash flow item.
                </p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0D0D0D] block">{tx.description || tx.category}</span>
                        <span className="text-gray-400">
                          {new Date(tx.date).toLocaleDateString()} • {tx.category}
                        </span>
                      </div>
                      <span
                        className={`font-extrabold text-sm ${
                          tx.type === 'income' ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Decision Tools (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#0D0D0D]">Quick Navigation</h3>
                <div className="space-y-2">
                  <Link
                    to="/dashboard/advisor"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FFF7ED] hover:bg-[#FFEDD5] transition-colors text-xs font-bold text-[#FF6B00]"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                      <span>Consult AI Advisor</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00]" />
                  </Link>

                  <Link
                    to="/dashboard/invoices"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F4F4F5] hover:bg-gray-200/70 transition-colors text-xs font-semibold text-[#0D0D0D]"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#FF6B00]" />
                      <span>Invoices & A/R</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    to="/dashboard/transactions"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F4F4F5] hover:bg-gray-200/70 transition-colors text-xs font-semibold text-[#0D0D0D]"
                  >
                    <span className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#FF6B00]" />
                      <span>Ledger, CSV Import & P&L</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                </div>
              </div>

              {/* Health Tip */}
              <div className="bg-[#0D0D0D] text-white rounded-2xl p-5 shadow-md border border-[#1F1F1F] space-y-2">
                <div className="flex items-center gap-2 text-[#FF6B00] font-bold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>BizMind Intelligence</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Keeping cash reserves above 3 months of operating expenses protects your business during seasonal dips and supplier price surges.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Set Category Budgets & Cash Reserves ───────────── */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0D0D0D]">Set Budget Limits & Cash Reserves</h3>
                <p className="text-[11px] text-gray-500">Configure thresholds for automated runway and burn calculations</p>
              </div>
              <button onClick={() => setShowBudgetModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudgets} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-800 block">Total Liquid Cash Reserves ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={editReserves}
                  onChange={(e) => setEditReserves(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold focus:border-[#FF6B00] outline-hidden font-mono"
                />
                <span className="text-[10px] text-gray-400">Cash in checking, savings, or treasury used to measure survival buffer.</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="font-bold text-gray-900 block">Monthly Category Spending Caps ($ USD)</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {editBudgets.map((b, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 p-2 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-800 truncate">{b.category}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={b.budget}
                          onChange={(e) => {
                            const updated = [...editBudgets];
                            updated[idx].budget = Number(e.target.value);
                            setEditBudgets(updated);
                          }}
                          className="w-24 px-2 py-1 bg-white border border-gray-300 rounded-lg text-right font-mono font-bold focus:border-[#FF6B00] outline-hidden"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="py-2 px-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBudgets}
                  className="py-2.5 px-5 rounded-xl font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] transition-colors flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  {savingBudgets && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Parameters</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
