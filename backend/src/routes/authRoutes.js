const express = require('express');
const {
	registerUser,
	loginUser,
	getUserProfile,
	listAdminUsers,
	createAdmin,
	updateAdmin,
	removeAdmin
} = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', verifyToken, getUserProfile);

// Admin user management routes
router.get('/admin-users', verifyAdmin, listAdminUsers);
router.post('/admin-users', verifyAdmin, createAdmin);
router.put('/admin-users/:id', verifyAdmin, updateAdmin);
router.delete('/admin-users/:id', verifyAdmin, removeAdmin);

module.exports = router;
