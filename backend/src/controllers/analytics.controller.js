const Transaction = require('../models/Transaction');
const Business = require('../models/Business');
const mongoose = require('mongoose');

const getDateRange = (period, customStart, customEnd) => {
  const now = new Date();
  switch (period) {
    case 'week':    return { start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7), end: now };
    case 'month':   return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
    case 'quarter': return { start: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1), end: now };
    case 'year':    return { start: new Date(now.getFullYear(), 0, 1), end: now };
    case 'custom':  return { start: new Date(customStart), end: new Date(customEnd) };
    default:        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
  }
};

// @desc  Get financial dashboard overview
// @route GET /api/v1/analytics/overview/:businessId
exports.getOverview = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    const { period = 'month', startDate, endDate } = req.query;
    const { start, end } = getDateRange(period, startDate, endDate);
    const matchBase = { business: businessId, status: 'completed', date: { $gte: start, $lte: end } };
    const [incomeAgg, expenseAgg, txCount, lastTx] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...matchBase, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Transaction.aggregate([
        { $match: { ...matchBase, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Transaction.countDocuments(matchBase),
      Transaction.find({ business: businessId }).sort({ date: -1 }).limit(5),
    ]);
    const totalIncome   = incomeAgg[0]?.total   || 0;
    const totalExpenses = expenseAgg[0]?.total  || 0;
    const netProfit     = totalIncome - totalExpenses;
    const profitMargin  = totalIncome > 0 ? parseFloat(((netProfit / totalIncome) * 100).toFixed(2)) : 0;
    res.json({
      success: true,
      data: {
        period,
        dateRange: { start, end },
        financials: { totalIncome, totalExpenses, netProfit, profitMargin },
        transactions: { total: txCount },
        recentTransactions: lastTx,
        business: { name: business.name, type: business.type, healthScore: business.metrics?.healthScore || 80 },
        disclaimer: 'All figures are illustrative estimates for business decision intelligence.',
      },
    });
  } catch (err) { next(err); }
};

// @desc  Get monthly trend chart data
// @route GET /api/v1/analytics/trends/:businessId
exports.getMonthlyTrends = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    const months = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    const pipeline = [
      { $match: { business: businessId, status: 'completed', date: { $gte: startDate } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ];
    const raw = await Transaction.aggregate(pipeline);
    const monthlyMap = {};
    raw.forEach(r => {
      const key = r._id.year + '-' + String(r._id.month).padStart(2, '0');
      if (!monthlyMap[key]) monthlyMap[key] = { month: key, income: 0, expenses: 0, profit: 0 };
      if (r._id.type === 'income')  monthlyMap[key].income   = r.total;
      if (r._id.type === 'expense') monthlyMap[key].expenses = r.total;
    });
    const trends = Object.values(monthlyMap).map(m => ({ ...m, profit: m.income - m.expenses }));
    res.json({ success: true, data: { trends, disclaimer: 'Estimated figures for illustrative purposes only.' } });
  } catch (err) { next(err); }
};

// @desc  Get expense category breakdown (pie chart)
// @route GET /api/v1/analytics/expenses/:businessId
exports.getExpenseBreakdown = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    const { period = 'month' } = req.query;
    const { start, end } = getDateRange(period);
    const pipeline = [
      { $match: { business: businessId, type: 'expense', status: 'completed', date: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ];
    const results = await Transaction.aggregate(pipeline);
    const totalExpenses = results.reduce((acc, r) => acc + r.total, 0);
    const breakdown = results.map(r => ({ category: r._id, amount: r.total, count: r.count, percentage: totalExpenses > 0 ? parseFloat(((r.total / totalExpenses) * 100).toFixed(1)) : 0 }));
    res.json({ success: true, data: { period, totalExpenses, breakdown } });
  } catch (err) { next(err); }
};

// @desc  Calculate business health score
// @route GET /api/v1/analytics/health-score/:businessId
exports.getHealthScore = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    const now = new Date();
    const last3Start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const [incomeAgg, expenseAgg, txCount] = await Promise.all([
      Transaction.aggregate([
        { $match: { business: businessId, type: 'income', status: 'completed', date: { $gte: last3Start } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Transaction.aggregate([
        { $match: { business: businessId, type: 'expense', status: 'completed', date: { $gte: last3Start } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.countDocuments({ business: businessId, status: 'completed', date: { $gte: last3Start } }),
    ]);
    const income   = incomeAgg[0]?.total  || 0;
    const expenses = expenseAgg[0]?.total || 0;
    const profit   = income - expenses;
    const margin   = income > 0 ? (profit / income) * 100 : 0;
    // Scoring components (0-100)
    let score = 50; // Base
    if (margin > 30) score += 20;
    else if (margin > 15) score += 10;
    else if (margin < 0) score -= 20;
    if (income > 0) score += 15;
    if (txCount >= 10) score += 10;
    if (txCount >= 50) score += 5;
    score = Math.min(100, Math.max(0, score));
    let rating = 'Poor';
    if (score >= 80) rating = 'Excellent';
    else if (score >= 65) rating = 'Good';
    else if (score >= 50) rating = 'Average';
    else if (score >= 35) rating = 'Needs Attention';
    await Business.findByIdAndUpdate(businessId, { 'metrics.healthScore': score, 'metrics.lastCalculated': new Date() });
    res.json({
      success: true,
      data: {
        healthScore: score,
        rating,
        components: { profitMargin: parseFloat(margin.toFixed(2)), activityLevel: txCount, revenueBase: income > 0 },
        recommendations: getHealthRecommendations(score, margin, income, expenses),
        disclaimer: 'Health score is an estimated indicator only. Not financial advice.',
      },
    });
  } catch (err) { next(err); }
};

const getHealthRecommendations = (score, margin, income, expenses) => {
  const recs = [];
  if (margin < 0)  recs.push({ type: 'critical', message: 'Your expenses exceed your income. Review and reduce costs immediately.' });
  if (margin < 15) recs.push({ type: 'warning',  message: 'Profit margin is below 15%. Consider optimizing operational costs.' });
  if (income === 0) recs.push({ type: 'info',     message: 'No income recorded yet. Start adding your revenue transactions.' });
  if (score >= 80) recs.push({ type: 'positive',  message: 'Great financial health! Keep maintaining your current strategies.' });
  return recs;
};

// @desc  Detect anomalies in transactions
// @route GET /api/v1/analytics/anomalies/:businessId
exports.detectAnomalies = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    const last90 = new Date(); last90.setDate(last90.getDate() - 90);
    const transactions = await Transaction.find({ business: businessId, status: 'completed', date: { $gte: last90 } }).sort({ date: -1 });
    const categoryStats = {};
    transactions.forEach(tx => {
      const key = tx.type + '_' + tx.category;
      if (!categoryStats[key]) categoryStats[key] = { amounts: [], category: tx.category, type: tx.type };
      categoryStats[key].amounts.push(tx.amount);
    });
    const anomalies = [];
    Object.values(categoryStats).forEach(stat => {
      if (stat.amounts.length < 3) return;
      const mean = stat.amounts.reduce((a, b) => a + b, 0) / stat.amounts.length;
      const variance = stat.amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / stat.amounts.length;
      const stdDev = Math.sqrt(variance);
      const threshold = mean + (2 * stdDev);
      stat.amounts.forEach((amount, i) => {
        if (amount > threshold && stdDev > 0) {
          const tx = transactions.find(t => t.category === stat.category && t.type === stat.type && t.amount === amount);
          if (tx) anomalies.push({ transaction: tx, zscore: parseFloat(((amount - mean) / stdDev).toFixed(2)), mean: parseFloat(mean.toFixed(2)), stdDev: parseFloat(stdDev.toFixed(2)), message: 'Amount is significantly higher than your average for ' + tx.category });
        }
      });
    });
    res.json({ success: true, data: { anomaliesFound: anomalies.length, anomalies, disclaimer: 'Anomaly detection is statistical and estimated. Manual review is recommended.' } });
  } catch (err) { next(err); }
};

// @desc  Cash flow forecast
// @route GET /api/v1/analytics/forecast/:businessId
exports.getCashFlowForecast = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    const monthsAhead = parseInt(req.query.months) || 3;
    const last6Start = new Date(); last6Start.setMonth(last6Start.getMonth() - 6);
    const pipeline = [
      { $match: { business: businessId, status: 'completed', date: { $gte: last6Start } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
    ];
    const raw = await Transaction.aggregate(pipeline);
    const monthlyIncome   = raw.filter(r => r._id.type === 'income').map(r => r.total);
    const monthlyExpenses = raw.filter(r => r._id.type === 'expense').map(r => r.total);
    const avgIncome   = monthlyIncome.length   > 0 ? monthlyIncome.reduce((a,b) => a+b, 0) / monthlyIncome.length : 0;
    const avgExpenses = monthlyExpenses.length > 0 ? monthlyExpenses.reduce((a,b) => a+b, 0) / monthlyExpenses.length : 0;
    const forecast = [];
    for (let i = 1; i <= monthsAhead; i++) {
      const d = new Date(); d.setMonth(d.getMonth() + i);
      forecast.push({ month: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0'), predictedIncome: parseFloat(avgIncome.toFixed(2)), predictedExpenses: parseFloat(avgExpenses.toFixed(2)), predictedNetCash: parseFloat((avgIncome - avgExpenses).toFixed(2)), confidence: 65, method: 'Moving Average (6 months)' });
    }
    res.json({ success: true, data: { forecast, basedOnMonths: monthlyIncome.length, disclaimer: 'Forecasts are Estimated/Illustrative projections based on historical averages. Actual results may vary significantly. Not financial advice.' } });
  } catch (err) { next(err); }
};

// @desc  Get Profit and Loss (P&L) Statement
// @route GET /api/v1/analytics/pl-statement/:businessId
exports.getPLStatement = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    const { period = 'month', startDate, endDate } = req.query;
    const { start, end } = getDateRange(period, startDate, endDate);

    const matchBase = { business: businessId, status: 'completed', date: { $gte: start, $lte: end } };

    const [incomeByCategory, expenseByCategory] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...matchBase, type: 'income' } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Transaction.aggregate([
        { $match: { ...matchBase, type: 'expense' } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    const totalIncome = incomeByCategory.reduce((acc, curr) => acc + curr.total, 0);
    const totalExpenses = expenseByCategory.reduce((acc, curr) => acc + curr.total, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? parseFloat(((netProfit / totalIncome) * 100).toFixed(2)) : 0;

    const formattedIncome = incomeByCategory.map((c) => ({
      category: c._id || 'Uncategorized Income',
      amount: c.total,
      count: c.count,
      percentage: totalIncome > 0 ? parseFloat(((c.total / totalIncome) * 100).toFixed(1)) : 0,
    }));

    const formattedExpenses = expenseByCategory.map((c) => ({
      category: c._id || 'General Operating',
      amount: c.total,
      count: c.count,
      percentage: totalExpenses > 0 ? parseFloat(((c.total / totalExpenses) * 100).toFixed(1)) : 0,
    }));

    // Estimated tax reserve suggestion (15% of net profit if profitable)
    const estimatedTax = netProfit > 0 ? parseFloat((netProfit * 0.15).toFixed(2)) : 0;
    const netIncomeAfterTax = netProfit - estimatedTax;

    res.json({
      success: true,
      data: {
        statementTitle: 'Profit & Loss Statement (P&L)',
        business: {
          id: business._id,
          name: business.name,
          type: business.type,
          industry: business.industry,
          currency: business.currency || 'USD',
          taxId: business.taxId || 'N/A',
        },
        period: {
          name: period,
          startDate: start,
          endDate: end,
        },
        revenue: {
          items: formattedIncome,
          totalGrossRevenue: totalIncome,
        },
        expenses: {
          items: formattedExpenses,
          totalOperatingExpenses: totalExpenses,
        },
        summary: {
          grossRevenue: totalIncome,
          totalExpenses,
          netOperatingIncome: netProfit,
          profitMargin,
          estimatedTax,
          netIncomeAfterTax,
        },
        generatedAt: new Date().toISOString(),
        disclaimer: 'This Profit & Loss statement is generated from recorded transactions for management decision intelligence. Consult a certified CPA for official tax filings.',
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get Category Budgets & Cash Runway Analytics
// @route GET /api/v1/analytics/budgets-and-runway/:businessId
exports.getBudgetsAndRunway = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [incomeAgg, expenseAgg, catExpenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { business: business._id, type: 'income', status: 'completed', date: { $gte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: thisMonthStart } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const cashReserves = business.financialSettings?.cashReserves ?? 25000;
    const netCashFlow = totalIncome - totalExpenses;
    const monthlyBurnRate = netCashFlow < 0 ? Math.abs(netCashFlow) : Math.round(totalExpenses * 0.25);

    let runwayMonths = 'Profitable';
    let runwayStatus = 'healthy';

    if (netCashFlow < 0 && monthlyBurnRate > 0) {
      const rm = parseFloat((cashReserves / monthlyBurnRate).toFixed(1));
      runwayMonths = `${rm} months`;
      runwayStatus = rm < 3 ? 'critical' : rm < 6 ? 'warning' : 'healthy';
    } else {
      const rm = parseFloat((cashReserves / (totalExpenses || 1)).toFixed(1));
      runwayMonths = `${rm}+ months (Cash Positive)`;
      runwayStatus = 'healthy';
    }

    const configuredBudgets = business.financialSettings?.categoryBudgets || [];
    const defaultCategories = ['Payroll & Contractors', 'Rent & Facilities', 'Software & Tools', 'Marketing & Ads', 'General Operating'];

    const budgetMap = {};
    configuredBudgets.forEach((b) => {
      budgetMap[b.category] = b.budget;
    });

    const categoriesList = Array.from(new Set([
      ...defaultCategories,
      ...configuredBudgets.map((b) => b.category),
      ...catExpenses.map((c) => c._id),
    ]));

    const budgetBreakdown = categoriesList.map((cat) => {
      const spent = catExpenses.find((c) => c._id === cat)?.total || 0;
      const budgetCap = budgetMap[cat] ?? 2500;
      const percent = budgetCap > 0 ? parseFloat(((spent / budgetCap) * 100).toFixed(1)) : (spent > 0 ? 100 : 0);
      const remaining = Math.max(0, budgetCap - spent);
      const isOver = spent > budgetCap && budgetCap > 0;

      return {
        category: cat,
        spent,
        budget: budgetCap,
        remaining,
        percent,
        isOver,
        status: isOver ? 'over' : percent >= 80 ? 'warning' : 'ok',
      };
    });

    res.json({
      success: true,
      data: {
        runway: {
          months: runwayMonths,
          status: runwayStatus,
          cashReserves,
          netCashFlow,
          monthlyBurnRate,
          totalIncome,
          totalExpenses,
        },
        budgets: budgetBreakdown,
        overallBudget: {
          totalBudget: budgetBreakdown.reduce((a, b) => a + b.budget, 0),
          totalSpent: totalExpenses,
          percentUsed: budgetBreakdown.reduce((a, b) => a + b.budget, 0) > 0
            ? parseFloat(((totalExpenses / budgetBreakdown.reduce((a, b) => a + b.budget, 0)) * 100).toFixed(1))
            : 0,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Update business budgets & cash reserve settings
// @route PUT /api/v1/analytics/budgets/:businessId
exports.updateBudgets = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;
    const { cashReserves, categoryBudgets } = req.body;

    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    if (!business.financialSettings) {
      business.financialSettings = {};
    }

    if (cashReserves !== undefined) {
      business.financialSettings.cashReserves = Number(cashReserves);
    }

    if (Array.isArray(categoryBudgets)) {
      business.financialSettings.categoryBudgets = categoryBudgets.map((b) => ({
        category: b.category,
        budget: Number(b.budget) || 0,
      }));
    }

    await business.save();

    res.json({
      success: true,
      message: 'Budget and cash reserve settings updated successfully.',
      data: { financialSettings: business.financialSettings },
    });
  } catch (err) {
    next(err);
  }
};
