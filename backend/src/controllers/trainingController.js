const TrainingModel = require('../models/Training');

const registerTraining = async (req, res) => {
    try {
        const registration = await TrainingModel.registerTraining(req.body);
        res.status(201).json({ success: true, data: registration });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllRegistrationsAdmin = async (req, res) => {
    try {
        const rows = await TrainingModel.getAllRegistrations();
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await TrainingModel.updateRegistrationStatus(id, status);

        if (!updated) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await TrainingModel.deleteRegistration(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerTraining,
    getAllRegistrationsAdmin,
    updateRegistrationStatus,
    deleteRegistration
};
