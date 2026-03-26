const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

// Register user
const register = async (email, password, firstName, lastName, phone) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedEmail = (email || '').trim().toLowerCase();
        const result = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name',
            [normalizedEmail, hashedPassword, firstName, lastName, phone, 'user']
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Login user
const login = async (email, password) => {
    try {
        const normalizedEmail = (email || '').trim().toLowerCase();
        const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
        
        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = result.rows[0];
        let isValidPassword = false;

        if (BCRYPT_HASH_REGEX.test(user.password)) {
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            // Backward compatibility for legacy records created with plaintext passwords.
            isValidPassword = password === user.password;

            if (isValidPassword) {
                const upgradedHash = await bcrypt.hash(password, 10);
                await pool.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [upgradedHash, user.id]);
            }
        }

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        if (user.is_active === false) {
            throw new Error('Account is inactive');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
            { expiresIn: '7d' }
        );

        return { user: { id: user.id, email: user.email, first_name: user.first_name, role: user.role }, token };
    } catch (error) {
        throw error;
    }
};

// Get user by ID
const getUserById = async (userId) => {
    try {
        const result = await pool.query('SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = $1', [userId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Update own user profile
const updateUserProfile = async (userId, email, firstName, lastName, phone) => {
    try {
        const existingResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (existingResult.rows.length === 0) {
            return null;
        }

        const existingUser = existingResult.rows[0];
        const result = await pool.query(
            'UPDATE users SET email = $1, first_name = $2, last_name = $3, phone = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, email, first_name, last_name, phone, role, created_at',
            [
                email ? email.trim().toLowerCase() : existingUser.email,
                firstName !== undefined ? firstName : existingUser.first_name,
                lastName !== undefined ? lastName : existingUser.last_name,
                phone !== undefined ? phone : existingUser.phone,
                userId
            ]
        );

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get all admin users
const getAdminUsers = async () => {
    try {
        const result = await pool.query(
            'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
            ['admin']
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Create admin user
const createAdminUser = async (email, password, firstName, lastName, phone) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedEmail = (email || '').trim().toLowerCase();
        const result = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, phone, role, created_at',
            [normalizedEmail, hashedPassword, firstName || null, lastName || null, phone || null, 'admin']
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Update admin user
const updateAdminUser = async (userId, email, firstName, lastName, phone, password) => {
    try {
        const existingResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (existingResult.rows.length === 0) {
            return null;
        }

        const existingUser = existingResult.rows[0];
        const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

        const result = await pool.query(
            'UPDATE users SET email = $1, first_name = $2, last_name = $3, phone = $4, password = $5, role = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id, email, first_name, last_name, phone, role, created_at',
            [
                email ? email.trim().toLowerCase() : existingUser.email,
                firstName !== undefined ? firstName : existingUser.first_name,
                lastName !== undefined ? lastName : existingUser.last_name,
                phone !== undefined ? phone : existingUser.phone,
                hashedPassword,
                'admin',
                userId
            ]
        );

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Delete admin user
const deleteAdminUser = async (userId) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [userId, 'admin']);
        return { success: true, message: 'Admin user deleted successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    register,
    login,
    getUserById,
    updateUserProfile,
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser
};
