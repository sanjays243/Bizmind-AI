const Joi = require('joi');

exports.registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName:  Joi.string().trim().min(2).max(50).required(),
  email:     Joi.string().email().lowercase().trim().required(),
  password:  Joi.string().min(8).max(128).required(),
  phone:     Joi.string().trim().optional().allow(''),
});

exports.loginSchema = Joi.object({
  email:    Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

exports.updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword:     Joi.string().min(8).max(128).required(),
  confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({ 'any.only': 'Passwords do not match' }),
});
