const express = require('express');
const {
    createGuide,
    getGuides,
    getAllGuidesAdmin,
    getGuidesByCategory,
    getGuide,
    updateGuide,
    deleteGuide,
    downloadGuide
} = require('../controllers/guideController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { validateGuide, validateId } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getGuides);
router.get('/admin/all', verifyAdmin, getAllGuidesAdmin);
router.get('/category/:category', getGuidesByCategory);

// Download route (requires authentication and payment) - MUST be before /:id
router.get('/:id/download', verifyToken, validateId, downloadGuide);

router.get('/:id', validateId, getGuide);

// Admin routes
router.post('/', verifyAdmin, upload.single('ebook'), validateGuide, createGuide);
router.put('/:id', verifyAdmin, upload.single('ebook'), validateId, validateGuide, updateGuide);
router.delete('/:id', verifyAdmin, validateId, deleteGuide);

module.exports = router;
