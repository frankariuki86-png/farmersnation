const pool = require('../config/database');

const createBooking = async (data) => {
    const { requesterName, phone, email, visitType, farmLocation, preferredDate, purpose } = data;
    const result = await pool.query(
        `INSERT INTO farm_visit_bookings
         (requester_name, phone, email, visit_type, farm_location, preferred_date, purpose)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [requesterName, phone, email || null, visitType, farmLocation, preferredDate || null, purpose || null]
    );
    return result.rows[0];
};

const getAllBookings = async () => {
    const result = await pool.query('SELECT * FROM farm_visit_bookings ORDER BY created_at DESC');
    return result.rows;
};

const updateBookingStatus = async (id, status) => {
    const result = await pool.query(
        'UPDATE farm_visit_bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

const deleteBooking = async (id) => {
    await pool.query('DELETE FROM farm_visit_bookings WHERE id = $1', [id]);
    return { success: true, message: 'Farm visit booking deleted' };
};

module.exports = {
    createBooking,
    getAllBookings,
    updateBookingStatus,
    deleteBooking
};
