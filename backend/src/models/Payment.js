const axios = require('axios');
const pool = require('../config/database');

// Initiate M-Pesa payment
const initiateMpesaPayment = async (phoneNumber, amount, guideId, userId) => {
    try {
        // Get M-Pesa OAuth token
        const auth = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString('base64');

        const tokenResponse = await axios.get(
            `${process.env.MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`,
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Format phone number (remove + and leading 0 if present)
        const formattedPhone = phoneNumber.replace(/^0/, '254').replace(/\D/g, '');

        // Initiate STK Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(
            `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
        ).toString('base64');

        const stkResponse = await axios.post(
            `${process.env.MPESA_API_URL}/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: formattedPhone,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: formattedPhone,
                CallBackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/callback`,
                AccountReference: `GUIDE-${guideId}`,
                TransactionDesc: `Farming Guide #${guideId}`
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        // Save payment record
        const paymentResult = await pool.query(
            'INSERT INTO payments (user_id, guide_id, amount, currency, payment_method, phone_number, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, guideId, amount, 'KSH', 'mpesa', phoneNumber, 'pending']
        );

        return {
            success: true,
            paymentId: paymentResult.rows[0].id,
            checkoutRequestId: stkResponse.data.CheckoutRequestID,
            message: 'STK push sent successfully'
        };
    } catch (error) {
        console.error('M-Pesa Error:', error.response?.data || error.message);
        throw error;
    }
};

// Handle M-Pesa callback
const handleMpesaCallback = async (callbackData) => {
    try {
        const body = callbackData.Body.stkCallback;
        const resultCode = body.ResultCode;
        const checkoutRequestId = body.CheckoutRequestID;

        let status = 'failed';
        let transactionId = null;
        let receiptNumber = null;

        if (resultCode === 0) { // Success
            status = 'completed';
            const callbackMetadata = body.CallbackMetadata;
            transactionId = callbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
            receiptNumber = transactionId;
        }

        // Update payment record
        await pool.query(
            'UPDATE payments SET status = $1, mpesa_transaction_id = $2, mpesa_receipt_number = $3, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM payments WHERE mpesa_transaction_id = $4 LIMIT 1)',
            [status, transactionId, receiptNumber, checkoutRequestId]
        );

        return { success: true, status };
    } catch (error) {
        console.error('Callback Error:', error);
        throw error;
    }
};

// Get payment history
const getPaymentHistory = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    initiateMpesaPayment,
    handleMpesaCallback,
    getPaymentHistory
};
