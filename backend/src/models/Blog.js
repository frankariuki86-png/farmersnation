const pool = require('../config/database');

// Create blog post
const createBlog = async (title, excerpt, content, imageUrl, authorId, category, isPublished) => {
    try {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const result = await pool.query(
            'INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author_id, category, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, slug, excerpt, content, imageUrl, authorId, category, isPublished]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get all published blogs
const getPublishedBlogs = async (limit = 10, offset = 0) => {
    try {
        const result = await pool.query(
            'SELECT * FROM blog_posts WHERE is_published = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Get all blogs for admin
const getAllBlogs = async (limit = 50, offset = 0) => {
    try {
        const result = await pool.query(
            'SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Get blog by slug
const getBlogBySlug = async (slug) => {
    try {
        const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
        if (result.rows.length > 0) {
            await pool.query('UPDATE blog_posts SET views = views + 1 WHERE slug = $1', [slug]);
        }
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get blog by ID
const getBlogById = async (blogId) => {
    try {
        const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [blogId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Update blog
const updateBlog = async (blogId, title, excerpt, content, imageUrl, category, isPublished) => {
    try {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const result = await pool.query(
            'UPDATE blog_posts SET title = $1, slug = $2, excerpt = $3, content = $4, image_url = $5, category = $6, is_published = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
            [title, slug, excerpt, content, imageUrl, category, isPublished, blogId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Delete blog
const deleteBlog = async (blogId) => {
    try {
        await pool.query('DELETE FROM blog_posts WHERE id = $1', [blogId]);
        return { success: true, message: 'Blog deleted successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBlog,
    getPublishedBlogs,
    getAllBlogs,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog
};
