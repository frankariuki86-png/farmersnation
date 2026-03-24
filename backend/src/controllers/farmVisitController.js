const FarmVisitModel = require('../models/FarmVisit');

const createBooking = async (req, res) => {
    try {
        const booking = await FarmVisitModel.createBooking(req.body);
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBookingsAdmin = async (req, res) => {
    try {
        const rows = await FarmVisitModel.getAllBookings();
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await FarmVisitModel.updateBookingStatus(id, status);

        if (!updated) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await FarmVisitModel.deleteBooking(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBooking,
    getAllBookingsAdmin,
    updateBookingStatus,
    deleteBooking
};
