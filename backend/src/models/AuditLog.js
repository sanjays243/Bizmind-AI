const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    default: '',
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE_BUSINESS',
      'UPDATE_BUSINESS',
      'DELETE_BUSINESS',
      'CHANGE_BUSINESS_STATUS',
      'TOGGLE_FEATURED_BUSINESS',
      'UPDATE_USER_ROLE',
      'CHANGE_USER_STATUS',
      'CREATE_CATEGORY',
      'DELETE_CATEGORY',
      'UPDATE_SETTINGS',
      'ADMIN_LOGIN',
    ],
  },
  resourceType: {
    type: String,
    required: true,
    enum: ['Business', 'User', 'Category', 'Settings', 'Auth'],
  },
  resourceId: {
    type: String,
    default: '',
  },
  resourceName: {
    type: String,
    default: '',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ admin: 1 });
auditLogSchema.index({ resourceType: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
