const User = require('../models/User');

// @desc  Update user profile
// @route PUT /api/v1/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatar', 'businessProfile', 'preferences'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated successfully.', data: { user } });
  } catch (err) {
    next(err);
  }
};

// @desc  Update password
// @route PUT /api/v1/users/update-password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete account (soft delete)
// @route DELETE /api/v1/users/me
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ success: true, message: 'Account deactivated successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc  Admin: get all users (fallback)
// @route GET /api/v1/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;
    const total = await User.countDocuments({ isActive: true });
    const users = await User.find({ isActive: true }).skip(skip).limit(limit).sort({ createdAt: -1 });
    res.json({ success: true, data: { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (err) {
    next(err);
  }
};
