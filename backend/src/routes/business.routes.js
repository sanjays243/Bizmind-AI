const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');
const { protect } = require('../middleware/auth');

// Public catalog routes
router.get('/catalog', businessController.getPublicBusinesses);
router.get('/catalog/:slug', businessController.getPublicBusinessBySlug);
router.get('/categories', businessController.getPublicCategories);

// Authenticated user business operations
router.get('/', protect, businessController.getMyBusinesses);
router.post('/', protect, businessController.createBusiness);
router.get('/:id', protect, businessController.getBusiness);
router.put('/:id', protect, businessController.updateBusiness);
router.delete('/:id', protect, businessController.deleteBusiness);
router.patch('/:id/set-default', protect, businessController.setDefaultBusiness);
router.get('/:id/summary', protect, businessController.getBusinessSummary);
router.get('/:id/team', protect, businessController.getTeamMembers);
router.post('/:id/team', protect, businessController.inviteTeamMember);
router.delete('/:id/team/:memberId', protect, businessController.removeTeamMember);

module.exports = router;
