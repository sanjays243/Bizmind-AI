const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  business:    { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, required: true, enum: ['income', 'expense', 'transfer', 'refund'] },
  category:    { type: String, required: true },
  subCategory: { type: String, default: '' },
  amount:      { type: Number, required: true, min: 0 },
  currency:    { type: String, default: 'INR' },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  date:        { type: Date, required: true, default: Date.now },
  paymentMethod: { type: String, enum: ['cash','card','upi','bank_transfer','cheque','other'], default: 'cash' },
  status:      { type: String, enum: ['completed','pending','failed','cancelled'], default: 'completed' },
  tags:        [{ type: String }],
  attachments: [{ name: String, url: String, uploadedAt: { type: Date, default: Date.now } }],
  notes:       { type: String, default: '' },
  isRecurring: { type: Boolean, default: false },
  recurringDetails: {
    frequency: { type: String, enum: ['daily','weekly','monthly','quarterly','yearly'] },
    nextDate:  { type: Date },
    endDate:   { type: Date },
  },
  aiFlags: {
    isAnomaly:    { type: Boolean, default: false },
    anomalyScore: { type: Number, default: 0 },
    aiNote:       { type: String, default: '' },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

transactionSchema.virtual('monthYear').get(function () {
  const d = new Date(this.date);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
});

transactionSchema.index({ business: 1, date: -1 });
transactionSchema.index({ business: 1, type: 1 });
transactionSchema.index({ business: 1, category: 1 });
transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
