const mongoose = require('mongoose');

const cashFlowForecastSchema = new mongoose.Schema({
  business:   { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  forecastDate: { type: Date, required: true },
  month:        { type: String, required: true },
  predictedIncome:   { type: Number, default: 0 },
  predictedExpenses: { type: Number, default: 0 },
  predictedNetCash:  { type: Number, default: 0 },
  confidence:        { type: Number, default: 0, min: 0, max: 100 },
  actualIncome:      { type: Number },
  actualExpenses:    { type: Number },
  isActualized:      { type: Boolean, default: false },
  method:            { type: String, default: 'moving_average' },
  factors:           [{ name: String, impact: Number, description: String }],
}, {
  timestamps: true,
});

cashFlowForecastSchema.index({ business: 1, forecastDate: -1 });

module.exports = mongoose.model('CashFlowForecast', cashFlowForecastSchema);
