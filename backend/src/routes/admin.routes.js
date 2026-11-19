const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorizeRoles } = require('../middleware/auth');

// Enforce strict authentication and administrative authorization for ALL admin routes
router.use(protect);
router.use(authorizeRoles('admin'));

// 1. Overview Dashboard & Analytics
router.get('/dashboard/summary', adminController.getDashboardSummary);
router.get('/analytics/user-growth', adminController.getUserGrowthAnalytics);
router.get('/analytics/business-categories', adminController.getBusinessCategoryAnalytics);
router.get('/analytics/activity', adminController.getActivityLogs);

// 2. Business Catalog Management
router.get('/businesses', adminController.getAdminBusinesses);
router.post('/businesses', adminController.createBusinessIdea);
router.get('/businesses/:id', adminController.getAdminBusinessById);
router.put('/businesses/:id', adminController.updateBusinessIdea);
router.patch('/businesses/:id/status', adminController.updateBusinessStatus);
router.delete('/businesses/:id', adminController.deleteBusinessIdea);

// 3. User Management
router.get('/users', adminController.getAdminUsers);
router.get('/users/:id', adminController.getAdminUserById);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/users/:id/role', adminController.updateUserRole);

// 4. Categories Management
router.get('/categories', adminController.getAdminCategories);
router.post('/categories', adminController.createCategory);

module.exports = router;
