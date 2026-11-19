const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }
  try {
    const jwtSecret = process.env.JWT_SECRET || 'bizmind_super_secret_key_change_in_production_2024';
    const decoded = jwt.verify(token, jwtSecret);
    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists.' });
      }
      if (!req.user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
      }
    } else {
      req.user = {
        _id: decoded.id || '650000000000000000000001',
        role: decoded.role || 'admin',
        email: decoded.email || 'admin@bizmind.ai',
        firstName: decoded.firstName || 'BizMind',
        lastName: decoded.lastName || 'Administrator',
        fullName: 'BizMind Administrator',
        isActive: true,
      };
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired. Please sign in again.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. You do not have permission (${req.user?.role || 'guest'}) to access this resource.`,
      });
    }
    next();
  };
};

exports.optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next();
  try {
    const jwtSecret = process.env.JWT_SECRET || 'bizmind_super_secret_key_change_in_production_2024';
    const decoded = jwt.verify(token, jwtSecret);
    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    } else {
      req.user = {
        _id: decoded.id || '650000000000000000000001',
        role: decoded.role || 'user',
        email: decoded.email || 'user@bizmind.ai',
        firstName: decoded.firstName || 'User',
        lastName: decoded.lastName || '',
        fullName: 'User',
        isActive: true,
      };
    }
  } catch (err) {
    // Ignore invalid token in optional mode
  }
  next();
};

// Alias requested in specifications: authorizeRoles("admin")
exports.authorizeRoles = exports.authorize;
