const express = require('express');
const {
    initiateMpesaPayment,
    handleMpesaCallback,
    getPaymentHistory,
    checkGuideAccess
} = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/initiate', verifyToken, initiateMpesaPayment);
router.post('/callback', handleMpesaCallback);
router.get('/history', verifyToken, getPaymentHistory);
router.get('/access/:guideId', verifyToken, checkGuideAccess);

module.exports = router;
