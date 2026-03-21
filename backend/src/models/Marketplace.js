const pool = require('../config/database');

// Create marketplace product
const createProduct = async (name, description, category, price, unit, imageUrl, sellerId, sellerName, sellerPhone, location, stock) => {
    try {
        const result = await pool.query(
            'INSERT INTO marketplace_products (name, description, category, price, unit, image_url, seller_id, seller_name, seller_phone, location, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [name, description, category, price, unit, imageUrl, sellerId, sellerName, sellerPhone, location, stock]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get all available products
const getAvailableProducts = async (limit = 20, offset = 0) => {
    try {
        const result = await pool.query(
            'SELECT * FROM marketplace_products WHERE is_available = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Get all products for admin
const getAllProducts = async (limit = 50, offset = 0) => {
    try {
        const result = await pool.query(
            'SELECT * FROM marketplace_products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Get products by category
const getProductsByCategory = async (category, limit = 20, offset = 0) => {
    try {
        const result = await pool.query(
            'SELECT * FROM marketplace_products WHERE category = $1 AND is_available = true ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [category, limit, offset]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Get product by ID
const getProductById = async (productId) => {
    try {
        const result = await pool.query('SELECT * FROM marketplace_products WHERE id = $1', [productId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Update product
const updateProduct = async (productId, name, description, category, price, unit, imageUrl, stock, isAvailable) => {
    try {
        const result = await pool.query(
            'UPDATE marketplace_products SET name = $1, description = $2, category = $3, price = $4, unit = $5, image_url = $6, stock = $7, is_available = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
            [name, description, category, price, unit, imageUrl, stock, isAvailable, productId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Delete product
const deleteProduct = async (productId) => {
    try {
        await pool.query('DELETE FROM marketplace_products WHERE id = $1', [productId]);
        return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createProduct,
    getAvailableProducts,
    getAllProducts,
    getProductsByCategory,
    getProductById,
    updateProduct,
    deleteProduct
};
