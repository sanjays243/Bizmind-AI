const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const businessRoutes = require('./routes/business.routes');
const transactionRoutes = require('./routes/transaction.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const advisorRoutes = require('./routes/advisor.routes');
const calculatorRoutes = require('./routes/calculator.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');
const businessController = require('./controllers/business.controller');

const app = express();

app.use(helmet());
app.use(mongoSanitize());

app.use(cors({
  origin: process.env.CLIENT_URL || true, // Allow frontend dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 500,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BizMind AI Backend API is running',
    frontendUrl: 'http://localhost:3000',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      auth: '/api/v1/auth',
      businesses: '/api/businesses',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BizMind AI API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// Direct Public Business Catalog Endpoints (as specified in requirement 8)
app.get('/api/businesses', businessController.getPublicBusinesses);
app.get('/api/businesses/categories', businessController.getPublicCategories);
app.get('/api/businesses/:slug', businessController.getPublicBusinessBySlug);
app.get('/api/categories', businessController.getPublicCategories);

// Authentication Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/auth', authLimiter, authRoutes);

// Protected Admin Routes (enforces role: "admin")
app.use('/api/v1/admin', adminRoutes);
app.use('/api/admin', adminRoutes);

// User & Business Management
app.use('/api/v1/users', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/v1/businesses', businessRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/advisor', advisorRoutes);
app.use('/api/v1/calculator', calculatorRoutes);
app.use('/api/v1/calculator', calculatorRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
