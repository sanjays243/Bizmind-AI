const Invoice = require('../models/Invoice');
const Business = require('../models/Business');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Helper: Recalculate business metrics
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

// @desc  Get all invoices for a business
// @route GET /api/v1/invoices
exports.getInvoices = async (req, res, next) => {
  try {
    const { businessId, status } = req.query;
    if (!businessId) {
      return res.status(400).json({ success: false, message: 'businessId is required.' });
    }

    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    const query = { business: business._id };
    if (status) query.status = status;

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    // Mark past due invoices as overdue in-memory/in DB
    const now = new Date();
    const updatedInvoices = await Promise.all(
      invoices.map(async (inv) => {
        if (inv.status === 'sent' && new Date(inv.dueDate) < now) {
          inv.status = 'overdue';
          await inv.save();
        }
        return inv;
      })
    );

    res.json({
      success: true,
      data: {
        invoices: updatedInvoices,
        count: updatedInvoices.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get Accounts Receivable (A/R) stats & Aging
// @route GET /api/v1/invoices/stats/:businessId
exports.getInvoiceStats = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    const invoices = await Invoice.find({ business: business._id });
    const now = new Date();

    let totalBilled = 0;
    let totalOutstanding = 0;
    let totalPaid = 0;
    let totalOverdue = 0;

    let aging0to30 = 0;
    let aging31to60 = 0;
    let aging60plus = 0;

    invoices.forEach((inv) => {
      if (inv.status !== 'cancelled') {
        totalBilled += inv.total;
      }

      if (inv.status === 'paid') {
        totalPaid += inv.total;
      } else if (inv.status === 'sent' || inv.status === 'overdue') {
        totalOutstanding += inv.total;

        const diffDays = Math.floor((now - new Date(inv.issueDate)) / (1000 * 60 * 60 * 24));
        if (new Date(inv.dueDate) < now) {
          totalOverdue += inv.total;
        }

        if (diffDays <= 30) {
          aging0to30 += inv.total;
        } else if (diffDays <= 60) {
          aging31to60 += inv.total;
        } else {
          aging60plus += inv.total;
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalBilled,
        totalOutstanding,
        totalPaid,
        totalOverdue,
        invoiceCount: invoices.length,
        aging: {
          current: aging0to30,
          days30to60: aging31to60,
          days60plus: aging60plus,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single invoice
// @route GET /api/v1/invoices/:id
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('business');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    if (invoice.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this invoice.' });
    }
    res.json({ success: true, data: { invoice } });
  } catch (err) {
    next(err);
  }
};

// @desc  Create new invoice
// @route POST /api/v1/invoices
exports.createInvoice = async (req, res, next) => {
  try {
    const {
      businessId,
      clientName,
      clientEmail,
      clientAddress,
      clientPhone,
      issueDate,
      dueDate,
      items,
      taxRate = 0,
      discount = 0,
      notes,
      paymentTerms = 'Net 15',
    } = req.body;

    if (!businessId || !clientName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Business, client name, and at least 1 item are required.' });
    }

    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    // Auto-generate invoice number if not provided
    const count = await Invoice.countDocuments({ business: business._id });
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, '0')}`;

    // Calculate line items and totals
    const processedItems = items.map((item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.unitPrice) || 0);
      return {
        description: item.description || 'Service/Product',
        quantity: qty,
        unitPrice: price,
        amount: parseFloat((qty * price).toFixed(2)),
      };
    });

    const subtotal = processedItems.reduce((acc, it) => acc + it.amount, 0);
    const taxAmount = parseFloat(((subtotal * Number(taxRate)) / 100).toFixed(2));
    const total = parseFloat(Math.max(0, subtotal + taxAmount - Number(discount)).toFixed(2));

    const invoice = await Invoice.create({
      business: business._id,
      user: req.user._id,
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      clientPhone,
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      items: processedItems,
      subtotal,
      taxRate: Number(taxRate) || 0,
      taxAmount,
      discount: Number(discount) || 0,
      total,
      notes: notes || 'Thank you for your business!',
      paymentTerms,
      status: req.body.status || 'sent',
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully.',
      data: { invoice },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Update invoice
// @route PUT /api/v1/invoices/:id
exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    if (invoice.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (req.body.items && Array.isArray(req.body.items)) {
      req.body.items = req.body.items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        amount: parseFloat(((Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)).toFixed(2)),
      }));
      req.body.subtotal = req.body.items.reduce((acc, it) => acc + it.amount, 0);
      const taxRate = req.body.taxRate !== undefined ? req.body.taxRate : invoice.taxRate;
      const discount = req.body.discount !== undefined ? req.body.discount : invoice.discount;
      req.body.taxAmount = parseFloat(((req.body.subtotal * Number(taxRate)) / 100).toFixed(2));
      req.body.total = parseFloat(Math.max(0, req.body.subtotal + req.body.taxAmount - Number(discount)).toFixed(2));
    }

    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Invoice updated.', data: { invoice: updated } });
  } catch (err) {
    next(err);
  }
};

// @desc  Mark invoice as paid and automatically log transaction into ledger
// @route POST /api/v1/invoices/:id/pay
exports.markAsPaid = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    if (invoice.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (invoice.status === 'paid') {
      return res.json({ success: true, message: 'Invoice is already marked as paid.', data: { invoice } });
    }

    invoice.status = 'paid';
    invoice.paidAt = new Date();

    // Auto-create corresponding income transaction in the ledger
    const transaction = await Transaction.create({
      business: invoice.business,
      user: req.user._id,
      type: 'income',
      amount: invoice.total,
      category: 'Sales Revenue',
      description: `Payment received: ${invoice.invoiceNumber} (${invoice.clientName})`,
      date: new Date(),
      status: 'completed',
      paymentMethod: req.body.paymentMethod || invoice.paymentMethod || 'bank_transfer',
      notes: `Automatically recorded from Invoice #${invoice.invoiceNumber}`,
    });

    invoice.linkedTransaction = transaction._id;
    await invoice.save();
    await recalculateBusinessMetrics(invoice.business);

    res.json({
      success: true,
      message: 'Invoice marked as paid and logged to financial ledger!',
      data: { invoice, transaction },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete invoice
// @route DELETE /api/v1/invoices/:id
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    if (invoice.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Invoice deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc  Simulate Online Client Checkout & Instant Payment Gateway Webhook
// @route POST /api/v1/invoices/:id/checkout
exports.checkoutInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('business');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    if (invoice.status === 'paid') {
      return res.json({
        success: true,
        message: 'Invoice has already been settled.',
        data: { invoice, alreadyPaid: true },
      });
    }

    const { paymentMethod = 'credit_card', payerName, cardLast4 = '4242' } = req.body;
    const txnRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    invoice.status = 'paid';
    invoice.paidAt = new Date();
    invoice.paymentMethod = paymentMethod;

    // Record verified transaction in financial ledger
    const transaction = await Transaction.create({
      business: invoice.business._id || invoice.business,
      user: invoice.user,
      type: 'income',
      amount: invoice.total,
      category: 'Sales Revenue',
      description: `Online Payment: ${invoice.invoiceNumber} (${payerName || invoice.clientName})`,
      date: new Date(),
      status: 'completed',
      paymentMethod,
      notes: `Settled online via Payment Gateway Ref: ${txnRef}`,
    });

    invoice.linkedTransaction = transaction._id;
    await invoice.save();
    await recalculateBusinessMetrics(invoice.business._id || invoice.business);

    res.json({
      success: true,
      message: 'Payment processed successfully! Invoice settled and logged to books.',
      data: {
        invoice,
        receipt: {
          transactionRef: txnRef,
          amountPaid: invoice.total,
          paidAt: invoice.paidAt,
          payerName: payerName || invoice.clientName,
          paymentMethod: `${paymentMethod} (ending in ${cardLast4})`,
          status: 'succeeded',
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

