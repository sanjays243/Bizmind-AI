const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  business:   { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, required: true, enum: ['anomaly','trend','recommendation','alert','forecast','health_score','cashflow'] },
  severity:   { type: String, enum: ['info','warning','critical','positive'], default: 'info' },
  title:      { type: String, required: true },
  message:    { type: String, required: true },
  details:    { type: mongoose.Schema.Types.Mixed, default: {} },
  actions:    [{ label: String, type: String, value: mongoose.Schema.Types.Mixed }],
  isRead:     { type: Boolean, default: false },
  isDismissed:{ type: Boolean, default: false },
  expiresAt:  { type: Date },
  score:      { type: Number, default: 0 },
  period:     { startDate: Date, endDate: Date },
}, {
  timestamps: true,
});

aiInsightSchema.index({ business: 1, isRead: 1 });
aiInsightSchema.index({ business: 1, type: 1 });
aiInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AiInsight', aiInsightSchema);
