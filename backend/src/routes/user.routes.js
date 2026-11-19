const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

router.put('/profile', protect, userController.updateProfile);
router.put('/update-password', protect, userController.updatePassword);
router.delete('/me', protect, userController.deleteAccount);
router.get('/', protect, authorize('admin'), userController.getAllUsers);

module.exports = router;
