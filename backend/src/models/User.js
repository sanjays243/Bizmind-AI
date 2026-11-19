const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'], trim: true, maxlength: 50 },
  lastName:  { type: String, required: [true, 'Last name is required'],  trim: true, maxlength: 50 },
  email:     { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  password:  { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
  avatar:    { type: String, default: '' },
  phone:     { type: String, trim: true, default: '' },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified:{ type: Boolean, default: false },
  isActive:  { type: Boolean, default: true },
  businessProfile: {
    businessName:    { type: String, default: '' },
    businessType:    { type: String, default: '' },
    industry:        { type: String, default: '' },
    yearsInBusiness: { type: Number, default: 0 },
    monthlyRevenue:  { type: Number, default: 0 },
    employees:       { type: Number, default: 1 },
    location:        { type: String, default: '' },
  },
  preferences: {
    currency:       { type: String, default: 'USD' },
    timezone:       { type: String, default: 'UTC' },
    notifications:  { type: Boolean, default: true },
    aiInsights:     { type: Boolean, default: true },
  },
  refreshToken:   { type: String, select: false },
  lastLogin:      { type: Date },
  loginCount:     { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: full name
userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// Generate JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });
};

module.exports = mongoose.model('User', userSchema);
