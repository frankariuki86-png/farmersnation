const express = require('express');
const {
    createBlog,
    getBlogs,
    getAllBlogsAdmin,
    getBlogBySlug,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { validateBlog, validateId } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/admin/all', verifyAdmin, getAllBlogsAdmin);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes
router.post('/', verifyAdmin, upload.single('image'), validateBlog, createBlog);
router.put('/:id', verifyAdmin, upload.single('image'), validateId, validateBlog, updateBlog);
router.delete('/:id', verifyAdmin, validateId, deleteBlog);

module.exports = router;
