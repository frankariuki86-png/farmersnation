const express = require('express');
const {
    registerTraining,
    getAllRegistrationsAdmin,
    updateRegistrationStatus,
    deleteRegistration
} = require('../controllers/trainingController');
const { verifyAdmin } = require('../middleware/auth');
const { validateTrainingRegistration, validateId, validateStatusUpdate } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateTrainingRegistration, registerTraining);
router.get('/admin/all', verifyAdmin, getAllRegistrationsAdmin);
router.put('/admin/:id/status', verifyAdmin, validateId, validateStatusUpdate, updateRegistrationStatus);
router.delete('/admin/:id', verifyAdmin, validateId, deleteRegistration);

module.exports = router;
