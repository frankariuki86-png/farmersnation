const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pino = require('pino');
const pinoHttp = require('pino-http');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const blogRoutes = require('./routes/blogRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const farmVisitRoutes = require('./routes/farmVisitRoutes');
const businessPlanRoutes = require('./routes/businessPlanRoutes');

const app = express();

const logger = pino({
    level: process.env.LOG_LEVEL || 'info'
});

// Security middleware - Helmet sets various HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'http://localhost:3000', process.env.FRONTEND_URL || 'http://localhost:3000'],
            fontSrc: ["'self'", 'fonts.gstatic.com', 'data:']
        }
    }
}));

// Rate limiting - strict limits for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit login to 5 attempts per 15 minutes
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        const ip = req.ip || req.socket?.remoteAddress || '';
        const forwardedFor = (req.headers['x-forwarded-for'] || '').toString();

        // Avoid lockouts during local development/testing.
        return ip === '::1'
            || ip === '127.0.0.1'
            || ip === '::ffff:127.0.0.1'
            || forwardedFor.includes('127.0.0.1')
            || forwardedFor.includes('::1');
    }
});

app.use(pinoHttp({ logger }));

const normalizeOrigin = (value) => value ? value.trim().replace(/\/$/, '') : value;

const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;

    const normalized = normalizeOrigin(origin);
    if (configuredOrigins.includes(normalized)) {
        return true;
    }

    // Allow Vercel preview/production frontend URLs if enabled.
    if ((process.env.ALLOW_VERCEL_PREVIEWS || '').toLowerCase() === 'true') {
        try {
            if (/\.vercel\.app$/i.test(new URL(normalized).hostname)) {
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    return false;
};

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Request body limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.info({ path: uploadsDir }, 'Created uploads directory');
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

// API Routes - with rate limiting on auth
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/farm-visits', farmVisitRoutes);
app.use('/api/business-plans', businessPlanRoutes);

// Root endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'FARMERS NATION API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            guides: '/api/guides',
            blogs: '/api/blogs',
            marketplace: '/api/marketplace',
            payments: '/api/payments',
            trainings: '/api/trainings',
            farmVisits: '/api/farm-visits',
            businessPlans: '/api/business-plans'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error({ 
        err, 
        stack: err.stack,
        code: err.code,
        message: err.message,
        path: req.path,
        method: req.method
    }, 'Unhandled error');
    res.status(500).json({ error: 'Something went wrong', message: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'Backend server started');
});

module.exports = app;
