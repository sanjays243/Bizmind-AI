const Business = require('../models/Business');

const checkBusinessAccess = async (req, res, next) => {
 const businessId = req.params.businessId || req.body.businessId || req.query.businessId;
 if (!businessId) {
 return res.status(400).json({ success: false, message: 'Business ID is required.' });
 }
 const business = await Business.findById(businessId);
 if (!business) {
 return res.status(404).json({ success: false, message: 'Business not found.' });
 }
 if (business.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
 return res.status(403).json({ success: false, message: 'You do not have access to this business.' });
 }
 req.business = business;
 next();
};
module.exports = checkBusinessAccess;
