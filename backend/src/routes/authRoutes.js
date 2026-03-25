const express = require('express');
const {
	registerUser,
	loginUser,
	getUserProfile,
	updateProfile,
	listAdminUsers,
	createAdmin,
	updateAdmin,
	removeAdmin
} = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
	validateRegister,
	validateLogin,
	validateProfileUpdate,
	validateAdminUser,
	validateId
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, validateProfileUpdate, updateProfile);

// Admin user management routes
router.get('/admin-users', verifyAdmin, listAdminUsers);
router.post('/admin-users', verifyAdmin, validateAdminUser, createAdmin);
router.put('/admin-users/:id', verifyAdmin, validateId, validateAdminUser, updateAdmin);
router.delete('/admin-users/:id', verifyAdmin, validateId, removeAdmin);

module.exports = router;
