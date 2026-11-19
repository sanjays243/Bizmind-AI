const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  // User ownership (for individual user business tracking)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  },

  // Basic Information
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: 150,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Business category is required'],
    trim: true,
    index: true,
  },
  type: {
    type: String,
    default: 'retail',
  },
  industry: {
    type: String,
    default: '',
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  fullDescription: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  logo: {
    type: String,
    default: '',
  },
  targetCustomers: {
    type: String,
    default: '',
  },
  locationGuidance: {
    type: String,
    default: '',
  },
  location: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
  },
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
  },

  // Publishing & Lifecycle
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },

  // Financial & Investment Estimates (strictly labelled as estimates)
  investmentMin: {
    type: Number,
    default: 0,
    min: 0,
  },
  investmentMax: {
    type: Number,
    default: 0,
    min: 0,
  },
  startupCostBreakdown: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  monthlyExpenses: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  monthlyExpensesEstimate: {
    type: Number,
    default: 0,
  },
  revenueEstimate: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  estimatedMonthlyRevenue: {
    type: Number,
    default: 0,
  },
  profitEstimate: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  estimatedOperatingProfit: {
    type: Number,
    default: 0,
  },
  estimatedProfitMargin: {
    type: Number,
    default: 0,
  },
  breakEvenEstimate: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Strategic Business Analysis
  difficulty: {
    type: String,
    enum: ['Beginner', 'Moderate', 'Advanced'],
    default: 'Moderate',
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  profitPotential: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Very High'],
    default: 'High',
  },
  marketOpportunityScore: {
    type: Number,
    default: 85,
    min: 0,
    max: 100,
  },
  marketOpportunity: {
    type: String,
    default: '',
  },
  overview: {
    type: String,
    default: '',
  },
  whoIsThisFor: {
    type: String,
    default: '',
  },
  howToStart: {
    type: String,
    default: '',
  },
  whereToStart: {
    type: String,
    default: '',
  },

  // Bullet Lists
  advantages: [{ type: String }],
  disadvantages: [{ type: String }],
  majorRisks: [{ type: String }],
  risks: [{ type: String }],
  requiredSkills: [{ type: String }],
  requiredResources: [{ type: String }],
  marketingStrategy: [{ type: String }],
  competitorAnalysis: [{ type: String }],
  growthOpportunities: [{ type: String }],
  startupPlan: [{
    step: { type: Number },
    title: { type: String },
    description: { type: String },
    timeline: { type: String },
  }],
  aiRecommendation: {
    score: { type: Number, default: 85 },
    summary: { type: String, default: '' },
    actionPlan: { type: String, default: '' },
    verdict: { type: String, default: 'High Potential Opportunity' },
    timelineMonths: { type: Number, default: 6 },
    keySuccessFactors: [{ type: String }],
    recommendationReason: { type: String, default: '' },
  },

  // User financial settings & actual live metrics (for user dashboard businesses)
  financialSettings: {
    currency: { type: String, default: 'USD' },
    fiscalYearStart: { type: Number, default: 1 },
    taxRate: { type: Number, default: 15 },
    monthlyExpenseBudget: { type: Number, default: 0 },
    revenueTarget: { type: Number, default: 0 },
    cashReserves: { type: Number, default: 20000 },
    categoryBudgets: [{
      category: { type: String, required: true },
      budget: { type: Number, required: true, default: 0 },
    }],
  },
  metrics: {
    totalRevenue: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    netProfit: { type: Number, default: 0 },
    healthScore: { type: Number, default: 80, min: 0, max: 100 },
    lastCalculated: { type: Date },
  },
  employees: { type: Number, default: 1, min: 1 },
  startDate: { type: Date },
  tags: [{ type: String }],

  // Team & Accountant Collaborators
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, default: '' },
    role: { type: String, enum: ['accountant', 'staff', 'viewer'], default: 'accountant' },
    status: { type: String, enum: ['invited', 'active'], default: 'invited' },
    invitedAt: { type: Date, default: Date.now },
  }],

  // Audit and Ownership
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

businessSchema.virtual('profitMargin').get(function () {
  if (!this.metrics?.totalRevenue || this.metrics.totalRevenue === 0) return 0;
  return parseFloat(((this.metrics.netProfit / this.metrics.totalRevenue) * 100).toFixed(2));
});

businessSchema.index({ status: 1, isActive: 1 });
businessSchema.index({ category: 1, status: 1 });
businessSchema.index({ user: 1, isActive: 1 });
businessSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Business', businessSchema);
