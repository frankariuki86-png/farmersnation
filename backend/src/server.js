const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const blogRoutes = require('./routes/blogRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentRoutes);

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
            payments: '/api/payments'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong', message: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 FARMERS NATION Backend Server running on port ${PORT}`);
    console.log(`📍 Location: Busia, Kenya`);
    console.log(`📱 Phone: ${process.env.PHONE_NUMBER || '0725822740'}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
