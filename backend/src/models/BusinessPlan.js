const pool = require('../config/database');

const createPlan = async (data) => {
    const { title, summary, content, category, documentUrl, isPublished, createdBy } = data;
    const result = await pool.query(
        `INSERT INTO business_plans
         (title, summary, content, category, document_url, is_published, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title, summary, content, category, documentUrl || null, !!isPublished, createdBy || null]
    );
    return result.rows[0];
};

const getPublishedPlans = async () => {
    const result = await pool.query(
        'SELECT * FROM business_plans WHERE is_published = true ORDER BY created_at DESC'
    );
    return result.rows;
};

const getAllPlans = async () => {
    const result = await pool.query('SELECT * FROM business_plans ORDER BY created_at DESC');
    return result.rows;
};

const getPlanById = async (id) => {
    const result = await pool.query('SELECT * FROM business_plans WHERE id = $1', [id]);
    return result.rows[0];
};

const updatePlan = async (id, data) => {
    const { title, summary, content, category, documentUrl, isPublished } = data;
    const result = await pool.query(
        `UPDATE business_plans
         SET title = $1, summary = $2, content = $3, category = $4, document_url = $5,
             is_published = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [title, summary, content, category, documentUrl || null, !!isPublished, id]
    );
    return result.rows[0];
};

const deletePlan = async (id) => {
    await pool.query('DELETE FROM business_plans WHERE id = $1', [id]);
    return { success: true, message: 'Business plan deleted' };
};

module.exports = {
    createPlan,
    getPublishedPlans,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan
};
