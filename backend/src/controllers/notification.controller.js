const Notification = require('../models/Notification');
const Business = require('../models/Business');
const Invoice = require('../models/Invoice');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc  Get user notifications & generate real-time financial alerts
// @route GET /api/v1/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const business = await Business.findOne({ user: req.user._id });
    const now = new Date();

    // Generate dynamic alerts if business exists
    if (business) {
      // 1. Check for overdue invoices
      const overdueInvoices = await Invoice.find({
        business: business._id,
        status: { $in: ['sent', 'overdue'] },
        dueDate: { $lt: now },
      }).limit(3);

      for (const inv of overdueInvoices) {
        const existing = await Notification.findOne({
          user: req.user._id,
          type: 'invoice_overdue',
          'metadata.invoiceId': inv._id,
        });

        if (!existing) {
          await Notification.create({
            user: req.user._id,
            business: business._id,
            type: 'invoice_overdue',
            title: `Payment Overdue: ${inv.invoiceNumber}`,
            message: `Invoice #${inv.invoiceNumber} for ${inv.clientName} ($${inv.total.toLocaleString()}) was due on ${new Date(inv.dueDate).toLocaleDateString()}.`,
            link: '/dashboard/invoices',
            metadata: { invoiceId: inv._id, total: inv.total },
          });
        }
      }

      // 2. Check for category budget threshold warnings
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const catExpenses = await Transaction.aggregate([
        { $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: thisMonthStart } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]);

      const budgets = business.financialSettings?.categoryBudgets || [];
      for (const b of budgets) {
        const spent = catExpenses.find((c) => c._id === b.category)?.total || 0;
        if (b.budget > 0 && spent >= b.budget * 0.85) {
          const isOver = spent >= b.budget;
          const existing = await Notification.findOne({
            user: req.user._id,
            type: 'budget_warning',
            'metadata.category': b.category,
            createdAt: { $gte: thisMonthStart },
          });

          if (!existing) {
            await Notification.create({
              user: req.user._id,
              business: business._id,
              type: 'budget_warning',
              title: isOver ? `Budget Exceeded: ${b.category}` : `Budget Warning: ${b.category}`,
              message: isOver
                ? `You have spent $${spent.toLocaleString()} on ${b.category}, exceeding your $${b.budget.toLocaleString()} monthly cap.`
                : `You have spent $${spent.toLocaleString()} on ${b.category} (${((spent / b.budget) * 100).toFixed(0)}% of your $${b.budget.toLocaleString()} cap).`,
              link: '/dashboard',
              metadata: { category: b.category, spent, budget: b.budget },
            });
          }
        }
      }

      // 3. Weekly Digest Notification (if none this week)
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const digestExists = await Notification.findOne({
        user: req.user._id,
        type: 'weekly_digest',
        createdAt: { $gte: weekStart },
      });

      if (!digestExists) {
        await Notification.create({
          user: req.user._id,
          business: business._id,
          type: 'weekly_digest',
          title: 'Monday Morning Financial Digest Ready',
          message: `Your weekly executive summary for ${business.name} is compiled. Cash runway and net margins are updated.`,
          link: '/dashboard/advisor',
          metadata: { businessName: business.name },
        });
      }
    }

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Mark notification as read
// @route PUT /api/v1/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, data: { notification, unreadCount } });
  } catch (err) {
    next(err);
  }
};

// @desc  Mark all notifications as read
// @route PUT /api/v1/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.', data: { unreadCount: 0 } });
  } catch (err) {
    next(err);
  }
};

// @desc  Get Weekly Executive Financial Digest
// @route GET /api/v1/notifications/digest/:businessId
exports.getWeeklyDigest = async (req, res, next) => {
  try {
    const businessId = mongoose.Types.ObjectId.isValid(req.params.businessId)
      ? new mongoose.Types.ObjectId(req.params.businessId)
      : req.params.businessId;

    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [weeklyIncome, weeklyExpense, pendingInvoices, topExpense] = await Promise.all([
      Transaction.aggregate([
        { $match: { business: business._id, type: 'income', status: 'completed', date: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Transaction.aggregate([
        { $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Invoice.find({ business: business._id, status: { $in: ['sent', 'overdue'] } }),
      Transaction.aggregate([
        { $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: sevenDaysAgo } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
        { $limit: 1 },
      ]),
    ]);

    const revenue = weeklyIncome[0]?.total || 0;
    const expenses = weeklyExpense[0]?.total || 0;
    const netCash = revenue - expenses;
    const pendingTotal = pendingInvoices.reduce((a, b) => a + b.total, 0);

    const digest = {
      title: `Weekly Financial Executive Brief • ${business.name}`,
      period: 'Past 7 Days',
      generatedAt: new Date().toISOString(),
      metrics: {
        revenueCollected: revenue,
        expensesPaid: expenses,
        netCashFlow: netCash,
        pendingReceivables: pendingTotal,
        topCostCenter: topExpense[0] ? `${topExpense[0]._id} ($${topExpense[0].total.toLocaleString()})` : 'None recorded',
      },
      aiInsight: netCash >= 0
        ? `Great momentum! Your business generated +$${netCash.toLocaleString()} in net positive cash flow this past week.`
        : `Caution: Outflows exceeded revenue by $${Math.abs(netCash).toLocaleString()} this past week. Follow up on $${pendingTotal.toLocaleString()} in pending invoices.`,
      recommendedAction: pendingInvoices.length > 0
        ? `Send a payment reminder to ${pendingInvoices[0].clientName} for invoice #${pendingInvoices[0].invoiceNumber}.`
        : 'Maintain a 3-month operating expense cash reserve.',
    };

    res.json({ success: true, data: { digest } });
  } catch (err) {
    next(err);
  }
};

