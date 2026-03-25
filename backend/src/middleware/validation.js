const { body, validationResult, param } = require('express-validator');

// Centralized validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validation schemas
const validateRegister = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and numbers'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters'),
    body('phone')
        .trim()
        .matches(/^(\+254|0)[17]\d{8}$/)
        .withMessage('Please provide a valid Kenyan phone number'),
    handleValidationErrors
];

const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Guide validation schemas
const validateGuide = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 20 })
        .withMessage('Description must be at least 20 characters'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    handleValidationErrors
];

// Blog validation schemas
const validateBlog = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('excerpt')
        .trim()
        .notEmpty()
        .withMessage('Excerpt is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Excerpt must be between 10 and 500 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 50 })
        .withMessage('Content must be at least 50 characters'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    handleValidationErrors
];

// Marketplace validation schemas
const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be between 3 and 100 characters'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    body('unit')
        .trim()
        .notEmpty()
        .withMessage('Unit is required'),
    body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be greater than 0'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    handleValidationErrors
];

// Training registration validation
const validateTrainingRegistration = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Full name must be between 3 and 255 characters'),
    body('phone')
        .trim()
        .matches(/^([+]?[0-9]{10,15})$/)
        .withMessage('Please provide a valid phone number'),
    body('trainingTopic')
        .trim()
        .notEmpty()
        .withMessage('Training topic is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Training topic must be between 3 and 255 characters'),
    body('email')
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email address'),
    handleValidationErrors
];

// Farm visit booking validation
const validateFarmVisitBooking = [
    body('requesterName')
        .trim()
        .notEmpty()
        .withMessage('Requester name is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Requester name must be between 3 and 255 characters'),
    body('phone')
        .trim()
        .matches(/^([+]?[0-9]{10,15})$/)
        .withMessage('Please provide a valid phone number'),
    body('visitType')
        .trim()
        .isIn(['visit_my_farm', 'visit_your_farm'])
        .withMessage('Visit type must be visit_my_farm or visit_your_farm'),
    body('farmLocation')
        .trim()
        .notEmpty()
        .withMessage('Farm location is required')
        .isLength({ min: 3, max: 255 })
        .withMessage('Farm location must be between 3 and 255 characters'),
    body('email')
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email address'),
    handleValidationErrors
];

// Business plan validation
const validateBusinessPlan = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 5, max: 255 })
        .withMessage('Title must be between 5 and 255 characters'),
    body('summary')
        .trim()
        .notEmpty()
        .withMessage('Summary is required')
        .isLength({ min: 10 })
        .withMessage('Summary must be at least 10 characters'),
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 30 })
        .withMessage('Content must be at least 30 characters when provided'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    handleValidationErrors
];

// Generic status update validation
const validateStatusUpdate = [
    body('status')
        .trim()
        .isIn(['pending', 'approved', 'rejected', 'completed'])
        .withMessage('Status must be pending, approved, rejected, or completed'),
    handleValidationErrors
];

// Admin user validation
const validateAdminUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .optional({ checkFalsy: true })
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and numbers'),
    handleValidationErrors
];

// User profile update validation
const validateProfileUpdate = [
    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('firstName')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),
    body('lastName')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters'),
    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^([+]?[0-9]{10,15})$/)
        .withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

// ID validation for params
const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid ID format'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateGuide,
    validateBlog,
    validateProduct,
    validateTrainingRegistration,
    validateFarmVisitBooking,
    validateBusinessPlan,
    validateStatusUpdate,
    validateAdminUser,
    validateProfileUpdate,
    validateId,
    handleValidationErrors
};
