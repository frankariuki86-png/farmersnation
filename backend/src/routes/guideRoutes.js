const express = require('express');
const {
    createGuide,
    getGuides,
    getAllGuidesAdmin,
    getGuidesByCategory,
    getGuide,
    updateGuide,
    deleteGuide
} = require('../controllers/guideController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getGuides);
router.get('/admin/all', verifyAdmin, getAllGuidesAdmin);
router.get('/category/:category', getGuidesByCategory);
router.get('/:id', getGuide);

// Admin routes
router.post('/', verifyAdmin, upload.single('ebook'), createGuide);
router.put('/:id', verifyAdmin, upload.single('ebook'), updateGuide);
router.delete('/:id', verifyAdmin, deleteGuide);

module.exports = router;
