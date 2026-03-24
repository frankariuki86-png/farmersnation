const express = require('express');
const {
    createPlan,
    getPublishedPlans,
    getAllPlansAdmin,
    updatePlan,
    deletePlan
} = require('../controllers/businessPlanController');
const { verifyAdmin } = require('../middleware/auth');
const { validateBusinessPlan, validateId } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getPublishedPlans);
router.get('/admin/all', verifyAdmin, getAllPlansAdmin);
router.post('/', verifyAdmin, upload.single('document'), validateBusinessPlan, createPlan);
router.put('/:id', verifyAdmin, upload.single('document'), validateId, validateBusinessPlan, updatePlan);
router.delete('/:id', verifyAdmin, validateId, deletePlan);

module.exports = router;
