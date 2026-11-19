const Joi = require('joi');

exports.createBusinessSchema = Joi.object({
  name:        Joi.string().trim().min(2).max(100).required(),
  type:        Joi.string().valid('retail','restaurant','cafe','service','freelance','ecommerce','manufacturing','consulting','healthcare','education','technology','real_estate','logistics','agriculture','fitness','beauty','automotive','other').required(),
  industry:    Joi.string().trim().optional().allow(''),
  description: Joi.string().trim().max(500).optional().allow(''),
  location: Joi.object({
    city:    Joi.string().optional().allow(''),
    state:   Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
  }).optional(),
  employees:   Joi.number().integer().min(1).optional(),
  startDate:   Joi.date().optional(),
  financialSettings: Joi.object({
    currency:             Joi.string().length(3).optional(),
    taxRate:              Joi.number().min(0).max(100).optional(),
    monthlyExpenseBudget: Joi.number().min(0).optional(),
    revenueTarget:        Joi.number().min(0).optional(),
  }).optional(),
});

exports.updateBusinessSchema = exports.createBusinessSchema.fork(
  ['name', 'type'],
  schema => schema.optional()
);
