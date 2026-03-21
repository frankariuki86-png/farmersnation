const pool = require('../config/database');

// Create farming guide
const createGuide = async (title, description, category, content, ebookUrl, thumbnailUrl, createdBy) => {
    try {
        const result = await pool.query(
            'INSERT INTO farming_guides (title, description, category, content, ebook_url, thumbnail_url, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description, category, content, ebookUrl, thumbnailUrl, createdBy]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get all published guides
const getPublishedGuides = async () => {
    try {
        const result = await pool.query('SELECT * FROM farming_guides WHERE is_published = true ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Get all guides for admin
const getAllGuides = async () => {
    try {
        const result = await pool.query('SELECT * FROM farming_guides ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Get guide by ID
const getGuideById = async (guideId) => {
    try {
        const result = await pool.query('SELECT * FROM farming_guides WHERE id = $1', [guideId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get guides by category
const getGuidesByCategory = async (category) => {
    try {
        const result = await pool.query('SELECT * FROM farming_guides WHERE category = $1 AND is_published = true ORDER BY created_at DESC', [category]);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Update guide
const updateGuide = async (guideId, title, description, category, content, ebookUrl, thumbnailUrl, isPublished) => {
    try {
        const result = await pool.query(
            'UPDATE farming_guides SET title = $1, description = $2, category = $3, content = $4, ebook_url = $5, thumbnail_url = $6, is_published = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
            [title, description, category, content, ebookUrl, thumbnailUrl, isPublished, guideId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Delete guide
const deleteGuide = async (guideId) => {
    try {
        await pool.query('DELETE FROM farming_guides WHERE id = $1', [guideId]);
        return { success: true, message: 'Guide deleted successfully' };
    } catch (error) {
        throw error;
    }
};

// Increment views
const incrementViews = async (guideId) => {
    try {
        await pool.query('UPDATE farming_guides SET views = views + 1 WHERE id = $1', [guideId]);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createGuide,
    getPublishedGuides,
    getAllGuides,
    getGuideById,
    getGuidesByCategory,
    updateGuide,
    deleteGuide,
    incrementViews
};
