const Joi = require('joi');

exports.createTransactionSchema = Joi.object({
  businessId:    Joi.string().required(),
  type:          Joi.string().valid('income','expense','transfer','refund').required(),
  category:      Joi.string().trim().required(),
  subCategory:   Joi.string().trim().optional().allow(''),
  amount:        Joi.number().positive().required(),
  currency:      Joi.string().length(3).optional(),
  description:   Joi.string().trim().min(3).max(500).required(),
  date:          Joi.date().optional(),
  paymentMethod: Joi.string().valid('cash','card','upi','bank_transfer','cheque','other').optional(),
  status:        Joi.string().valid('completed','pending','failed','cancelled').optional(),
  tags:          Joi.array().items(Joi.string()).optional(),
  notes:         Joi.string().optional().allow(''),
  isRecurring:   Joi.boolean().optional(),
  recurringDetails: Joi.object({
    frequency: Joi.string().valid('daily','weekly','monthly','quarterly','yearly').optional(),
    nextDate:  Joi.date().optional(),
    endDate:   Joi.date().optional(),
  }).optional(),
});

exports.updateTransactionSchema = exports.createTransactionSchema.fork(
  ['businessId','type','category','amount','description'],
  schema => schema.optional()
);
