const express = require('express');
const {
    createProduct,
    getProducts,
    getAllProductsAdmin,
    getProductsByCategory,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/marketplaceController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { validateProduct, validateId } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/admin/all', verifyAdmin, getAllProductsAdmin);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', validateId, getProduct);

// Admin routes
router.post('/', verifyAdmin, upload.single('image'), validateProduct, createProduct);
router.put('/:id', verifyAdmin, upload.single('image'), validateId, validateProduct, updateProduct);
router.delete('/:id', verifyAdmin, validateId, deleteProduct);

module.exports = router;
