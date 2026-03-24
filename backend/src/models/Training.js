const pool = require('../config/database');

const registerTraining = async (data) => {
    const { fullName, phone, email, trainingTopic, preferredDate, location, notes } = data;
    const result = await pool.query(
        `INSERT INTO training_registrations
         (full_name, phone, email, training_topic, preferred_date, location, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [fullName, phone, email || null, trainingTopic, preferredDate || null, location || null, notes || null]
    );
    return result.rows[0];
};

const getAllRegistrations = async () => {
    const result = await pool.query('SELECT * FROM training_registrations ORDER BY created_at DESC');
    return result.rows;
};

const updateRegistrationStatus = async (id, status) => {
    const result = await pool.query(
        'UPDATE training_registrations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

const deleteRegistration = async (id) => {
    await pool.query('DELETE FROM training_registrations WHERE id = $1', [id]);
    return { success: true, message: 'Training registration deleted' };
};

module.exports = {
    registerTraining,
    getAllRegistrations,
    updateRegistrationStatus,
    deleteRegistration
};
