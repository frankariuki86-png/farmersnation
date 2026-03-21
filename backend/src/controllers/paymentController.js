const PaymentModel = require('../models/Payment');
const pool = require('../config/database');

// Initiate M-Pesa payment
const initiateMpesaPayment = async (req, res) => {
    try {
        const { phoneNumber, guideId } = req.body;
        const userId = req.user.id;

        if (!phoneNumber || !guideId) {
            return res.status(400).json({ error: 'Phone number and guide ID are required' });
        }

        const result = await PaymentModel.initiateMpesaPayment(phoneNumber, 100, guideId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle M-Pesa callback
const handleMpesaCallback = async (req, res) => {
    try {
        const result = await PaymentModel.handleMpesaCallback(req.body);
        
        // If payment is successful, add guide to purchased guides
        if (result.status === 'completed') {
            const paymentData = await pool.query(
                'SELECT * FROM payments WHERE status = $1 ORDER BY updated_at DESC LIMIT 1',
                ['completed']
            );

            if (paymentData.rows.length > 0) {
                const payment = paymentData.rows[0];
                await pool.query(
                    'INSERT INTO purchased_guides (user_id, guide_id, payment_id) VALUES ($1, $2, $3)',
                    [payment.user_id, payment.guide_id, payment.id]
                );
            }
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await PaymentModel.getPaymentHistory(userId);
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check if user has access to guide
const checkGuideAccess = async (req, res) => {
    try {
        const userId = req.user.id;
        const { guideId } = req.params;

        const result = await pool.query(
            'SELECT * FROM purchased_guides WHERE user_id = $1 AND guide_id = $2',
            [userId, guideId]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ hasAccess: true });
        } else {
            res.status(200).json({ hasAccess: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    initiateMpesaPayment,
    handleMpesaCallback,
    getPaymentHistory,
    checkGuideAccess
};
