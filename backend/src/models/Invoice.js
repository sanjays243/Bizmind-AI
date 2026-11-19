const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  quantity:    { type: Number, required: true, min: 1, default: 1 },
  unitPrice:   { type: Number, required: true, min: 0, default: 0 },
  amount:      { type: Number, required: true, min: 0, default: 0 },
});

const invoiceSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    trim: true,
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  clientEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  clientAddress: {
    type: String,
    trim: true,
    default: '',
  },
  clientPhone: {
    type: String,
    trim: true,
    default: '',
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  taxRate: {
    type: Number,
    default: 0, // e.g. 5%
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
    index: true,
  },
  notes: {
    type: String,
    default: 'Thank you for your business! Payment is due according to terms specified.',
  },
  paymentTerms: {
    type: String,
    default: 'Net 15',
  },
  paidAt: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    default: 'bank_transfer',
  },
  linkedTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
}, {
  timestamps: true,
});

invoiceSchema.index({ business: 1, invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ business: 1, status: 1 });
invoiceSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);

