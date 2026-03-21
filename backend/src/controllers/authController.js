const {
    register,
    login,
    getUserById,
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser
} = require('../models/User');

// Register controller
const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await register(email, password, firstName, lastName, phone);
        res.status(201).json({ success: true, data: user, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await login(email, password);
        res.status(200).json({ success: true, data: result, message: 'Login successful' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get admin users (Admin only)
const listAdminUsers = async (req, res) => {
    try {
        const users = await getAdminUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create admin user (Admin only)
const createAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await createAdminUser(email, password, firstName, lastName, phone);
        res.status(201).json({ success: true, data: user, message: 'Admin user created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update admin user (Admin only)
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, firstName, lastName, phone, password } = req.body;

        const user = await updateAdminUser(id, email, firstName, lastName, phone, password);
        if (!user) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        res.status(200).json({ success: true, data: user, message: 'Admin user updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete admin user (Admin only)
const removeAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(req.user.id) === Number(id)) {
            return res.status(400).json({ error: 'You cannot delete your own admin account' });
        }

        const result = await deleteAdminUser(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    listAdminUsers,
    createAdmin,
    updateAdmin,
    removeAdmin
};
