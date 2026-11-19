const express = require('express');
const router = express.Router();
const advisorController = require('../controllers/advisor.controller');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/ask', optionalAuth, advisorController.askAdvisor);
router.post('/scan-receipt', protect, advisorController.scanReceipt);
router.get('/insights/:businessId', protect, advisorController.getInsights);
router.get('/recommendations/:businessId', protect, advisorController.getRecommendations);

module.exports = router;
