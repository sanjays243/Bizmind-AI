const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');
const AuditLog = require('../models/AuditLog');
const Category = require('../models/Category');
const slugify = require('slugify');

// Helper to log administrative audit trail
const logAuditEvent = async (req, action, resourceType, resourceId, resourceName, details) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await AuditLog.create({
        admin: req.user._id,
        adminEmail: req.user.email,
        adminName: req.user.fullName || `${req.user.firstName} ${req.user.lastName}`,
        action,
        resourceType,
        resourceId: resourceId ? resourceId.toString() : '',
        resourceName: resourceName || '',
        details: details || {},
        ipAddress: req.ip || req.connection?.remoteAddress || '',
        userAgent: req.headers['user-agent'] || '',
      });
    }
  } catch (err) {
    console.error('[AuditLog Error]', err.message);
  }
};

const generateSlug = async (name) => {
  let base = slugify(name, { lower: true, strict: true, trim: true });
  if (!base) base = 'business-idea';
  let slug = base;
  let counter = 1;
  if (mongoose.connection.readyState === 1) {
    while (await Business.findOne({ slug })) {
      slug = `${base}-${counter}`;
      counter++;
    }
  }
  return slug;
};

// ==========================================
// 1. DASHBOARD & ANALYTICS
// ==========================================

// @desc  Get admin overview dashboard summary metrics
// @route GET /api/admin/dashboard/summary
exports.getDashboardSummary = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          summary: {
            totalUsers: 142,
            totalBusinessIdeas: 18,
            totalBusinessCategories: 5,
            totalActiveBusinesses: 14,
            newUsersThisMonth: 28,
          },
          recentlyAddedBusinesses: [
            {
              _id: '650000000000000000000010',
              name: 'Eco-Friendly Ghost Kitchen Network',
              slug: 'eco-friendly-ghost-kitchen-network',
              category: 'Food & Beverage',
              status: 'published',
              investmentMin: 45000,
              investmentMax: 95000,
              difficulty: 'Moderate',
              riskLevel: 'Medium',
              createdAt: new Date().toISOString()
            },
            {
              _id: '650000000000000000000011',
              name: 'B2B Micro-SaaS Billing Engine',
              slug: 'b2b-micro-saas-billing-engine',
              category: 'Technology & Software',
              status: 'published',
              investmentMin: 15000,
              investmentMax: 40000,
              difficulty: 'Advanced',
              riskLevel: 'Low',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: '650000000000000000000012',
              name: 'Solar Panel Maintenance Fleet',
              slug: 'solar-panel-maintenance-fleet',
              category: 'Green Energy & CleanTech',
              status: 'draft',
              investmentMin: 35000,
              investmentMax: 80000,
              difficulty: 'Moderate',
              riskLevel: 'Low',
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ],
          recentActivity: [
            {
              _id: 'act1',
              adminEmail: 'admin@bizmind.ai',
              adminName: 'BizMind Administrator',
              action: 'create',
              resourceType: 'business',
              resourceName: 'Eco-Friendly Ghost Kitchen Network',
              createdAt: new Date().toISOString()
            },
            {
              _id: 'act2',
              adminEmail: 'admin@bizmind.ai',
              adminName: 'BizMind Administrator',
              action: 'publish',
              resourceType: 'business',
              resourceName: 'B2B Micro-SaaS Billing Engine',
              createdAt: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        }
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalBusinessIdeas,
      totalActiveBusinesses,
      newUsersThisMonth,
      categoriesCount,
      recentlyAddedBusinesses,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Business.countDocuments({ status: { $in: ['published', 'draft'] } }),
      Business.countDocuments({ status: 'published', isActive: true }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Business.distinct('category'),
      Business.find({ status: { $in: ['published', 'draft'] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name slug category status investmentMin investmentMax difficulty riskLevel createdAt image'),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select('adminEmail adminName action resourceType resourceName details createdAt'),
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalBusinessIdeas,
          totalBusinessCategories: categoriesCount.length,
          totalActiveBusinesses,
          newUsersThisMonth,
        },
        recentlyAddedBusinesses,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get user growth analytics over time
// @route GET /api/admin/analytics/user-growth
exports.getUserGrowthAnalytics = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const growth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Format for easy charting in Recharts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = growth.map(item => ({
      period: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      users: item.count,
    }));

    res.json({
      success: true,
      data: {
        growth: formatted.length > 0 ? formatted : [
          { period: 'May 2026', users: 12 },
          { period: 'Jun 2026', users: 24 },
          { period: 'Jul 2026', users: 38 },
          { period: 'Aug 2026', users: 55 },
          { period: 'Sep 2026', users: 82 },
          { period: 'Oct 2026', users: 110 },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get business distribution by category
// @route GET /api/admin/analytics/business-categories
exports.getBusinessCategoryAnalytics = async (req, res, next) => {
  try {
    const categories = await Business.aggregate([
      { $match: { status: { $ne: 'archived' } } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formatted = categories.map(c => ({
      category: c._id || 'Uncategorized',
      count: c.count,
      published: c.published,
    }));

    res.json({
      success: true,
      data: { categories: formatted },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get audit activity logs
// @route GET /api/admin/analytics/activity
exports.getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.action) query.action = req.query.action;
    if (req.query.resourceType) query.resourceType = req.query.resourceType;

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        logs,
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

// ==========================================
// 2. BUSINESS CATALOG MANAGEMENT
// ==========================================

// @desc  Get all business ideas (admin table with filtering, search, pagination)
// @route GET /api/admin/businesses
exports.getAdminBusinesses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by name or category
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { shortDescription: searchRegex },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Status filter
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    } else {
      // By default show published and drafts, unless explicitly asking for archived
      if (!req.query.includeArchived) {
        query.status = { $in: ['published', 'draft'] };
      }
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'name') sort = { name: 1 };
    if (req.query.sortBy === 'investment') sort = { investmentMin: 1 };
    if (req.query.sortBy === 'profit') sort = { estimatedOperatingProfit: -1 };

    const [businesses, total] = await Promise.all([
      Business.find(query).sort(sort).skip(skip).limit(limit),
      Business.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
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

// @desc  Get single business by ID for editing
// @route GET /api/admin/businesses/:id
exports.getAdminBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business idea not found.' });
    }
    res.json({ success: true, data: { business } });
  } catch (err) {
    next(err);
  }
};

// @desc  Create new business idea dynamically
// @route POST /api/admin/businesses
exports.createBusinessIdea = async (req, res, next) => {
  try {
    const {
      name,
      slug: customSlug,
      category,
      shortDescription,
      fullDescription,
      image,
      targetCustomers,
      locationGuidance,
      investmentMin,
      investmentMax,
      startupCostBreakdown,
      monthlyExpenses,
      revenueEstimate,
      profitEstimate,
      breakEvenEstimate,
      difficulty,
      riskLevel,
      profitPotential,
      marketOpportunityScore,
      advantages,
      disadvantages,
      majorRisks,
      requiredSkills,
      requiredResources,
      marketingStrategy,
      competitorAnalysis,
      growthOpportunities,
      startupPlan,
      aiRecommendation,
      status,
      isFeatured,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Business name and category are required.' });
    }

    const finalSlug = customSlug?.trim() ? await generateSlug(customSlug) : await generateSlug(name);

    // Compute estimates summary helpers
    const parsedInvMin = Number(investmentMin) || 0;
    const parsedInvMax = Number(investmentMax) || parsedInvMin;
    const monthlyRev = Number(revenueEstimate?.estimatedMonthlyRevenue) || 0;
    const monthlyExp = Number(monthlyExpenses?.total) || 0;
    const operatingProfit = Number(profitEstimate?.potentialOperatingProfit) || (monthlyRev - monthlyExp);
    const profitMargin = Number(profitEstimate?.potentialProfitMargin) || (monthlyRev > 0 ? ((operatingProfit / monthlyRev) * 100).toFixed(1) : 0);

    const business = await Business.create({
      name,
      slug: finalSlug,
      category,
      shortDescription: shortDescription || '',
      fullDescription: fullDescription || '',
      description: fullDescription || shortDescription || '',
      image: image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      targetCustomers: targetCustomers || '',
      locationGuidance: locationGuidance || '',
      investmentMin: parsedInvMin,
      investmentMax: parsedInvMax,
      startupCostBreakdown: startupCostBreakdown || {},
      monthlyExpenses: monthlyExpenses || {},
      monthlyExpensesEstimate: monthlyExp,
      revenueEstimate: revenueEstimate || {},
      estimatedMonthlyRevenue: monthlyRev,
      profitEstimate: profitEstimate || {},
      estimatedOperatingProfit: operatingProfit,
      estimatedProfitMargin: profitMargin,
      breakEvenEstimate: breakEvenEstimate || {},
      difficulty: difficulty || 'Moderate',
      riskLevel: riskLevel || 'Medium',
      profitPotential: profitPotential || 'High',
      marketOpportunityScore: Number(marketOpportunityScore) || 85,
      advantages: Array.isArray(advantages) ? advantages : [],
      disadvantages: Array.isArray(disadvantages) ? disadvantages : [],
      majorRisks: Array.isArray(majorRisks) ? majorRisks : [],
      risks: Array.isArray(majorRisks) ? majorRisks : [],
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      requiredResources: Array.isArray(requiredResources) ? requiredResources : [],
      marketingStrategy: Array.isArray(marketingStrategy) ? marketingStrategy : [],
      competitorAnalysis: Array.isArray(competitorAnalysis) ? competitorAnalysis : [],
      growthOpportunities: Array.isArray(growthOpportunities) ? growthOpportunities : [],
      startupPlan: Array.isArray(startupPlan) ? startupPlan : [],
      aiRecommendation: aiRecommendation || {
        score: Number(marketOpportunityScore) || 85,
        summary: `Strategic investment analysis recommends ${name} as a viable enterprise opportunity.`,
        actionPlan: 'Validate local market demographic demand, finalize supplier agreements, and launch targeted marketing.',
        verdict: 'Recommended Opportunity',
      },
      status: status === 'draft' ? 'draft' : 'published',
      isFeatured: Boolean(isFeatured),
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await logAuditEvent(req, 'CREATE_BUSINESS', 'Business', business._id, business.name, {
      category: business.category,
      status: business.status,
      slug: business.slug,
    });

    res.status(201).json({
      success: true,
      message: `Business idea "${business.name}" created successfully.`,
      data: { business },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Update existing business idea
// @route PUT /api/admin/businesses/:id
exports.updateBusinessIdea = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business idea not found.' });
    }

    if (req.body.name && req.body.name !== business.name && !req.body.slug) {
      req.body.slug = await generateSlug(req.body.name);
    }

    req.body.updatedBy = req.user._id;

    // Recalculate summary numeric estimates if provided
    if (req.body.revenueEstimate || req.body.monthlyExpenses || req.body.profitEstimate) {
      const rev = Number(req.body.revenueEstimate?.estimatedMonthlyRevenue ?? business.estimatedMonthlyRevenue);
      const exp = Number(req.body.monthlyExpenses?.total ?? business.monthlyExpensesEstimate);
      req.body.estimatedMonthlyRevenue = rev;
      req.body.monthlyExpensesEstimate = exp;
      req.body.estimatedOperatingProfit = Number(req.body.profitEstimate?.potentialOperatingProfit ?? (rev - exp));
      req.body.estimatedProfitMargin = Number(req.body.profitEstimate?.potentialProfitMargin ?? (rev > 0 ? ((req.body.estimatedOperatingProfit / rev) * 100).toFixed(1) : 0));
    }

    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await logAuditEvent(req, 'UPDATE_BUSINESS', 'Business', updated._id, updated.name, {
      updatedFields: Object.keys(req.body),
    });

    res.json({
      success: true,
      message: `Business idea "${updated.name}" updated successfully.`,
      data: { business: updated },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Toggle business status (published / draft / archived) or isFeatured
// @route PATCH /api/admin/businesses/:id/status
exports.updateBusinessStatus = async (req, res, next) => {
  try {
    const { status, isFeatured } = req.body;
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    const updates = { updatedBy: req.user._id };
    if (status && ['published', 'draft', 'archived'].includes(status)) {
      updates.status = status;
    }
    if (typeof isFeatured === 'boolean') {
      updates.isFeatured = isFeatured;
    }

    const updated = await Business.findByIdAndUpdate(req.params.id, updates, { new: true });

    await logAuditEvent(req, 'CHANGE_BUSINESS_STATUS', 'Business', updated._id, updated.name, {
      newStatus: updated.status,
      isFeatured: updated.isFeatured,
    });

    res.json({
      success: true,
      message: `Status updated to "${updated.status}" for "${updated.name}".`,
      data: { business: updated },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete or archive business idea
// @route DELETE /api/admin/businesses/:id
exports.deleteBusinessIdea = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    const businessName = business.name;
    const businessId = business._id;

    // Hard delete or archive: we soft delete to archived to preserve referential integrity, or delete if draft
    if (business.status === 'draft') {
      await Business.findByIdAndDelete(req.params.id);
    } else {
      business.status = 'archived';
      business.isActive = false;
      await business.save();
    }

    await logAuditEvent(req, 'DELETE_BUSINESS', 'Business', businessId, businessName, {
      finalStatus: business.status,
    });

    res.json({
      success: true,
      message: `Business "${businessName}" successfully removed from catalog.`,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 3. USER MANAGEMENT & SECURITY
// ==========================================

// @desc  Get registered users with filtering, sorting, pagination
// @route GET /api/admin/users
exports.getAdminUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { 'businessProfile.businessName': searchRegex },
      ];
    }

    if (req.query.role && req.query.role !== 'all') {
      query.role = req.query.role;
    }

    if (req.query.status && req.query.status !== 'all') {
      query.isActive = req.query.status === 'active';
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    // Attach count of owned businesses for each user
    const userIds = users.map(u => u._id);
    const businessCounts = await Business.aggregate([
      { $match: { user: { $in: userIds }, isActive: true } },
      { $group: { _id: '$user', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    businessCounts.forEach(bc => {
      countMap[bc._id.toString()] = bc.count;
    });

    const enhancedUsers = users.map(u => {
      const obj = u.toObject();
      obj.businessesOwned = countMap[u._id.toString()] || 0;
      return obj;
    });

    res.json({
      success: true,
      data: {
        users: enhancedUsers,
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

// @desc  Get single user details by ID
// @route GET /api/admin/users/:id
exports.getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const businesses = await Business.find({ user: user._id, isActive: true })
      .select('name slug category type metrics createdAt');

    const activity = await AuditLog.find({ admin: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        businesses,
        activity,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Activate or deactivate a user account
// @route PATCH /api/admin/users/:id/status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const targetUserId = req.params.id;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive boolean is required.' });
    }

    // Safety checks:
    // 1. Cannot deactivate yourself
    if (req.user._id.toString() === targetUserId && !isActive) {
      return res.status(400).json({
        success: false,
        message: 'Security Violation: You cannot deactivate your own administrative account.',
      });
    }

    // 2. Cannot deactivate the last active administrator
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (targetUser.role === 'admin' && !isActive) {
      const activeAdminsCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (activeAdminsCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Security Safeguard: Cannot deactivate the last remaining active administrator.',
        });
      }
    }

    targetUser.isActive = isActive;
    await targetUser.save();

    await logAuditEvent(req, 'CHANGE_USER_STATUS', 'User', targetUser._id, targetUser.email, {
      newStatus: isActive ? 'active' : 'deactivated',
      targetRole: targetUser.role,
    });

    res.json({
      success: true,
      message: `Account for ${targetUser.email} has been ${isActive ? 'activated' : 'deactivated'}.`,
      data: { user: targetUser },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Promote or demote user role
// @route PATCH /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be either "user" or "admin".' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Safety check: Cannot remove own admin privileges if you're the last admin
    if (req.user._id.toString() === targetUserId && role !== 'admin') {
      const activeAdminsCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (activeAdminsCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Security Safeguard: You cannot revoke your own administrator role as you are the sole administrator.',
        });
      }
    }

    const previousRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    await logAuditEvent(req, 'UPDATE_USER_ROLE', 'User', targetUser._id, targetUser.email, {
      previousRole,
      newRole: role,
    });

    res.json({
      success: true,
      message: `Role for ${targetUser.email} updated to "${role}".`,
      data: { user: targetUser },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 4. CATEGORIES MANAGEMENT
// ==========================================

// @desc  Get categories with counts
// @route GET /api/admin/categories
exports.getAdminCategories = async (req, res, next) => {
  try {
    const distinctCategories = await Business.distinct('category', { status: { $ne: 'archived' } });
    const businessCounts = await Business.aggregate([
      { $match: { status: { $ne: 'archived' } } },
      { $group: { _id: '$category', count: { $sum: 1 }, published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } } } },
    ]);

    const countMap = {};
    businessCounts.forEach(bc => {
      countMap[bc._id] = { total: bc.count, published: bc.published };
    });

    // Also fetch managed categories
    const customCategories = await Category.find({ isActive: true });
    const combinedSet = new Set([...distinctCategories, ...customCategories.map(c => c.name)]);

    const result = Array.from(combinedSet).filter(Boolean).map(catName => ({
      name: catName,
      slug: slugify(catName, { lower: true, strict: true }),
      count: countMap[catName]?.total || 0,
      publishedCount: countMap[catName]?.published || 0,
    })).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: { categories: result },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Add new category
// @route POST /api/admin/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    let category = await Category.findOne({ slug });
    if (category) {
      return res.status(409).json({ success: false, message: 'A category with this name already exists.' });
    }

    category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      createdBy: req.user._id,
    });

    await logAuditEvent(req, 'CREATE_CATEGORY', 'Category', category._id, category.name, {});

    res.status(201).json({
      success: true,
      message: `Category "${category.name}" created successfully.`,
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};
