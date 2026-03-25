const BlogModel = require('../models/Blog');

const toBoolean = (value, fallback = false) => {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
};

// Create blog (Admin only)
const createBlog = async (req, res) => {
    try {
        const { title, excerpt, content, category, isPublished } = req.body;
        const publish = toBoolean(isPublished, false);
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const blog = await BlogModel.createBlog(
            title,
            excerpt,
            content,
            imageUrl,
            req.user.id,
            category,
            publish
        );

        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all published blogs
const getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const blogs = await BlogModel.getPublishedBlogs(limit, offset);
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all blogs (Admin only)
const getAllBlogsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;
        const blogs = await BlogModel.getAllBlogs(limit, offset);
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get blog by slug
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await BlogModel.getBlogBySlug(slug);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update blog (Admin only)
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, category, isPublished } = req.body;

        const existingBlog = await BlogModel.getBlogById(id);
        if (!existingBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : existingBlog.image_url;

        const blog = await BlogModel.updateBlog(
            id,
            title || existingBlog.title,
            excerpt || existingBlog.excerpt,
            content || existingBlog.content,
            imageUrl,
            category || existingBlog.category,
            isPublished !== undefined ? toBoolean(isPublished, existingBlog.is_published) : existingBlog.is_published
        );

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete blog (Admin only)
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await BlogModel.deleteBlog(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getAllBlogsAdmin,
    getBlogBySlug,
    updateBlog,
    deleteBlog
};
