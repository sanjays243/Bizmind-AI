const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/overview/:businessId', analyticsController.getOverview);
router.get('/trends/:businessId', analyticsController.getMonthlyTrends);
router.get('/expenses/:businessId', analyticsController.getExpenseBreakdown);
router.get('/health-score/:businessId', analyticsController.getHealthScore);
router.get('/anomalies/:businessId', analyticsController.detectAnomalies);
router.get('/forecast/:businessId', analyticsController.getCashFlowForecast);
router.get('/pl-statement/:businessId', analyticsController.getPLStatement);
router.get('/budgets-and-runway/:businessId', analyticsController.getBudgetsAndRunway);
router.put('/budgets/:businessId', analyticsController.updateBudgets);

module.exports = router;
