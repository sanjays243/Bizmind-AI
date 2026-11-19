const Transaction = require('../models/Transaction');
const Business = require('../models/Business');

// Helper: recalculate metrics
const recalculateBusinessMetrics = async (businessId) => {
  try {
    const [incomeAgg, expenseAgg] = await Promise.all([
      Transaction.aggregate([
        { $match: { business: businessId, type: 'income', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { business: businessId, type: 'expense', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);
    const totalRevenue  = incomeAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const netProfit     = totalRevenue - totalExpenses;
    await Business.findByIdAndUpdate(businessId, {
      'metrics.totalRevenue':   totalRevenue,
      'metrics.totalExpenses':  totalExpenses,
      'metrics.netProfit':      netProfit,
      'metrics.lastCalculated': new Date(),
    });
  } catch (err) {
    console.error('Error recalculating business metrics:', err);
  }
};

// @desc  Add transaction
// @route POST /api/v1/transactions
exports.createTransaction = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.body.businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    req.body.business = req.body.businessId;
    req.body.user = req.user._id;
    const transaction = await Transaction.create(req.body);
    await recalculateBusinessMetrics(business._id);
    res.status(201).json({ success: true, message: 'Transaction added successfully.', data: { transaction } });
  } catch (err) {
    next(err);
  }
};

// @desc  Import bulk transactions from CSV bank statement
// @route POST /api/v1/transactions/import
exports.importTransactions = async (req, res, next) => {
  try {
    const { businessId, transactions: rawTransactions } = req.body;
    if (!businessId) {
      return res.status(400).json({ success: false, message: 'businessId is required.' });
    }
    if (!Array.isArray(rawTransactions) || rawTransactions.length === 0) {
      return res.status(400).json({ success: false, message: 'No transactions provided to import.' });
    }

    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    const sanitizedDocs = rawTransactions.map((tx) => ({
      business: business._id,
      user: req.user._id,
      type: tx.type === 'income' ? 'income' : 'expense',
      amount: Math.abs(parseFloat(tx.amount) || 0),
      category: tx.category || (tx.type === 'income' ? 'Sales Revenue' : 'General Operating'),
      description: tx.description || 'Imported Transaction',
      date: tx.date ? new Date(tx.date) : new Date(),
      status: tx.status || 'completed',
      paymentMethod: tx.paymentMethod || 'bank_transfer',
      notes: tx.notes || 'Imported via CSV Bank Statement',
    })).filter((tx) => tx.amount > 0);

    if (sanitizedDocs.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid transactions found with positive amounts.' });
    }

    const inserted = await Transaction.insertMany(sanitizedDocs, { ordered: false });
    await recalculateBusinessMetrics(business._id);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} transactions.`,
      data: {
        importedCount: inserted.length,
        transactions: inserted,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get transactions with filters
// @route GET /api/v1/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const { businessId, type, category, startDate, endDate, status, page = 1, limit = 20, sort = '-date' } = req.query;
    const query = { user: req.user._id };
    if (businessId) query.business = businessId;
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate)   query.date.$lte = new Date(endDate);
    }
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query).sort(sort).skip(skip).limit(parseInt(limit));
    res.json({ success: true, data: { transactions, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } } });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single transaction
// @route GET /api/v1/transactions/:id
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    res.json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
};

// @desc  Update transaction
// @route PUT /api/v1/transactions/:id
exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await recalculateBusinessMetrics(transaction.business);
    res.json({ success: true, message: 'Transaction updated.', data: { transaction: updated } });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete transaction
// @route DELETE /api/v1/transactions/:id
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    await Transaction.findByIdAndDelete(req.params.id);
    await recalculateBusinessMetrics(transaction.business);
    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get category breakdown
// @route GET /api/v1/transactions/categories/:businessId
exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    const businessId = req.params.businessId;
    const now = new Date();
    let startDate;
    if (period === 'month') startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (period === 'quarter') startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    else if (period === 'year') startDate = new Date(now.getFullYear(), 0, 1);
    else startDate = new Date(now.getFullYear(), now.getMonth(), 1);

    const mongoose = require('mongoose');
    const bId = mongoose.Types.ObjectId.isValid(businessId) ? new mongoose.Types.ObjectId(businessId) : businessId;
    const uId = req.user._id;

    const pipeline = [
      { $match: { business: bId, user: uId, date: { $gte: startDate }, status: 'completed' } },
      { $group: { _id: { type: '$type', category: '$category' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ];
    const results = await Transaction.aggregate(pipeline);
    const income   = results.filter(r => r._id.type === 'income');
    const expenses = results.filter(r => r._id.type === 'expense');
    res.json({ success: true, data: { period, income, expenses } });
  } catch (err) {
    next(err);
  }
};
