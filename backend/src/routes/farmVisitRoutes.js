const express = require('express');
const {
    createBooking,
    getAllBookingsAdmin,
    updateBookingStatus,
    deleteBooking
} = require('../controllers/farmVisitController');
const { verifyAdmin } = require('../middleware/auth');
const { validateFarmVisitBooking, validateId, validateStatusUpdate } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateFarmVisitBooking, createBooking);
router.get('/admin/all', verifyAdmin, getAllBookingsAdmin);
router.put('/admin/:id/status', verifyAdmin, validateId, validateStatusUpdate, updateBookingStatus);
router.delete('/admin/:id', verifyAdmin, validateId, deleteBooking);

module.exports = router;
