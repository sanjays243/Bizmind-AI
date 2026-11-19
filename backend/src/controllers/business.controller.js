const Business = require('../models/Business');
const Transaction = require('../models/Transaction');
const slugify = require('slugify');

const generateSlug = async (name) => {
  let base = slugify(name, { lower: true, strict: true, trim: true });
  if (!base) base = 'business';
  let slug = base;
  let counter = 1;
  while (await Business.findOne({ slug })) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
};

// ==========================================
// 1. PUBLIC BUSINESS CATALOG APIS
// ==========================================

// @desc  Get published business ideas for public Explore page
// @route GET /api/businesses or /api/v1/businesses/catalog
exports.getPublicBusinesses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; // fetch all or paginate
    const skip = (page - 1) * limit;

    // Strictly published and active only (exclude drafts & archived)
    const query = {
      status: 'published',
      isActive: true,
    };

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Search query
    if (req.query.search) {
      const q = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: q },
        { shortDescription: q },
        { category: q },
        { targetCustomers: q },
        { requiredSkills: q },
      ];
    }

    // Difficulty filter
    if (req.query.difficulty && req.query.difficulty !== 'all') {
      query.difficulty = req.query.difficulty;
    }

    // Risk level filter
    if (req.query.riskLevel && req.query.riskLevel !== 'all') {
      query.riskLevel = req.query.riskLevel;
    }

    // Investment range filter
    if (req.query.investment) {
      if (req.query.investment === 'under25k') query.investmentMin = { $lt: 25000 };
      if (req.query.investment === '25to50k') {
        query.investmentMin = { $lte: 50000 };
        query.investmentMax = { $gte: 25000 };
      }
      if (req.query.investment === '50to100k') {
        query.investmentMin = { $lte: 100000 };
        query.investmentMax = { $gte: 50000 };
      }
      if (req.query.investment === 'over100k') query.investmentMax = { $gte: 100000 };
    }

    // Sorting
    let sort = { isFeatured: -1, createdAt: -1 };
    if (req.query.sortBy === 'invAsc') sort = { investmentMin: 1 };
    if (req.query.sortBy === 'invDesc') sort = { investmentMax: -1 };
    if (req.query.sortBy === 'profitDesc') sort = { estimatedOperatingProfit: -1, 'profitEstimate.potentialOperatingProfit': -1 };
    if (req.query.sortBy === 'aiScore') sort = { 'aiRecommendation.score': -1, marketOpportunityScore: -1 };

    const [businesses, total] = await Promise.all([
      Business.find(query).sort(sort).skip(skip).limit(limit),
      Business.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        count: businesses.length,
        total,
        businesses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single published business by slug
// @route GET /api/businesses/:slug
exports.getPublicBusinessBySlug = async (req, res, next) => {
  try {
    const business = await Business.findOne({
      slug: req.params.slug,
      status: 'published',
      isActive: true,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: `Business idea with slug "${req.params.slug}" not found or not published.`,
      });
    }

    res.json({
      success: true,
      data: { business },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get public business categories with published counts
// @route GET /api/businesses/categories
exports.getPublicCategories = async (req, res, next) => {
  try {
    const agg = await Business.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categories = agg.map(c => ({
      name: c._id,
      count: c.count,
    }));

    res.json({
      success: true,
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 2. USER-OWNED BUSINESSES (Dashboard)
// ==========================================

// @desc  Create a business owned by authenticated user
// @route POST /api/v1/businesses
exports.createBusiness = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    req.body.slug = await generateSlug(req.body.name || 'My Business');
    const count = await Business.countDocuments({ user: req.user._id, isActive: true });
    if (count === 0) req.body.isDefault = true;

    const business = await Business.create(req.body);
    res.status(201).json({ success: true, message: 'Business created successfully.', data: { business } });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all businesses owned by authenticated user
// @route GET /api/v1/businesses
exports.getMyBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ user: req.user._id, isActive: true }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, data: { count: businesses.length, businesses } });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single business owned by user
// @route GET /api/v1/businesses/:id
exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    res.json({ success: true, data: { business } });
  } catch (err) {
    next(err);
  }
};

// @desc  Update user owned business
// @route PUT /api/v1/businesses/:id
exports.updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    if (req.body.name && req.body.name !== business.name) {
      req.body.slug = await generateSlug(req.body.name);
    }
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Business updated successfully.', data: { business: updated } });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete user owned business
// @route DELETE /api/v1/businesses/:id
exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    business.isActive = false;
    await business.save();
    res.json({ success: true, message: 'Business deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc  Set default business for user
// @route PATCH /api/v1/businesses/:id/set-default
exports.setDefaultBusiness = async (req, res, next) => {
  try {
    await Business.updateMany({ user: req.user._id }, { isDefault: false });
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });
    res.json({ success: true, message: 'Default business updated.', data: { business } });
  } catch (err) {
    next(err);
  }
};

// @desc  Get business summary for user dashboard
// @route GET /api/v1/businesses/:id/summary
exports.getBusinessSummary = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [incomeAgg, expenseAgg] = await Promise.all([
      Transaction.aggregate([
        { $match: { business: business._id, type: 'income', status: 'completed', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { business: business._id, type: 'expense', status: 'completed', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const monthlyIncome = incomeAgg[0]?.total || 0;
    const monthlyExpenses = expenseAgg[0]?.total || 0;
    const monthlyProfit = monthlyIncome - monthlyExpenses;

    res.json({
      success: true,
      data: {
        business,
        currentMonth: {
          income: monthlyIncome,
          expenses: monthlyExpenses,
          profit: monthlyProfit,
          profitMargin: monthlyIncome > 0 ? parseFloat(((monthlyProfit / monthlyIncome) * 100).toFixed(2)) : 0,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get business team members / collaborators
// @route GET /api/v1/businesses/:id/team
exports.getTeamMembers = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    res.json({
      success: true,
      data: {
        owner: {
          id: req.user._id,
          name: req.user.fullName || `${req.user.firstName} ${req.user.lastName}`,
          email: req.user.email,
          role: 'Owner (Full Access)',
        },
        collaborators: business.collaborators || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Invite team member / accountant to business
// @route POST /api/v1/businesses/:id/team
exports.inviteTeamMember = async (req, res, next) => {
  try {
    const { email, name, role = 'accountant' } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Collaborator email is required.' });

    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    if (!business.collaborators) business.collaborators = [];

    if (business.collaborators.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'This member is already invited to this business.' });
    }

    business.collaborators.push({
      email: email.toLowerCase().trim(),
      name: name?.trim() || email.split('@')[0],
      role,
      status: 'invited',
      invitedAt: new Date(),
    });

    await business.save();

    res.status(201).json({
      success: true,
      message: `Invitation sent to ${email} as ${role}.`,
      data: { collaborators: business.collaborators },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Remove team member / accountant from business
// @route DELETE /api/v1/businesses/:id/team/:memberId
exports.removeTeamMember = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ success: false, message: 'Business not found.' });

    business.collaborators = (business.collaborators || []).filter(
      (c) => c._id.toString() !== req.params.memberId
    );

    await business.save();

    res.json({
      success: true,
      message: 'Collaborator removed.',
      data: { collaborators: business.collaborators },
    });
  } catch (err) {
    next(err);
  }
};
