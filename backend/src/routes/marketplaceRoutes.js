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
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/admin/all', verifyAdmin, getAllProductsAdmin);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Admin routes
router.post('/', verifyAdmin, upload.single('image'), createProduct);
router.put('/:id', verifyAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);

module.exports = router;
