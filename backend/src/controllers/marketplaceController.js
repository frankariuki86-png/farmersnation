const MarketplaceModel = require('../models/Marketplace');

const toBoolean = (value, fallback = true) => {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
};

// Create product (Admin only)
const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, unit, stock } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const product = await MarketplaceModel.createProduct(
            name,
            description,
            category,
            price,
            unit,
            imageUrl,
            req.user.id,
            'FARMERS NATION',
            process.env.PHONE_NUMBER || '0725822740',
            'Busia, Kenya',
            stock
        );

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error('Product creation error:', error.message, error.stack);
        res.status(500).json({ error: error.message || 'Failed to create product', details: error.code });
    }
};

// Get all available products
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const products = await MarketplaceModel.getAvailableProducts(limit, offset);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products (Admin only)
const getAllProductsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const products = await MarketplaceModel.getAllProducts(limit, offset);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const products = await MarketplaceModel.getProductsByCategory(category, limit, offset);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await MarketplaceModel.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, unit, stock, isAvailable } = req.body;

        const existingProduct = await MarketplaceModel.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : existingProduct.image_url;

        const product = await MarketplaceModel.updateProduct(
            id,
            name || existingProduct.name,
            description || existingProduct.description,
            category || existingProduct.category,
            price || existingProduct.price,
            unit || existingProduct.unit,
            imageUrl,
            stock !== undefined ? stock : existingProduct.stock,
            isAvailable !== undefined ? toBoolean(isAvailable, existingProduct.is_available) : existingProduct.is_available
        );

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Product update error:', error.message, error.stack);
        res.status(500).json({ error: error.message || 'Failed to update product', details: error.code });
    }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await MarketplaceModel.deleteProduct(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getAllProductsAdmin,
    getProductsByCategory,
    getProduct,
    updateProduct,
    deleteProduct
};
