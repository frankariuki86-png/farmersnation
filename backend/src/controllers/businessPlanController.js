const BusinessPlanModel = require('../models/BusinessPlan');

const toBoolean = (value, fallback = false) => {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
};

const createPlan = async (req, res) => {
    try {
        const { title, summary, content, category, isPublished } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Business plan eBook file is required' });
        }

        const safeContent = content && content.trim() ? content : summary;
        const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const plan = await BusinessPlanModel.createPlan({
            title,
            summary,
            content: safeContent,
            category,
            documentUrl,
            isPublished: toBoolean(isPublished, false),
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPublishedPlans = async (req, res) => {
    try {
        const rows = await BusinessPlanModel.getPublishedPlans();
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllPlansAdmin = async (req, res) => {
    try {
        const rows = await BusinessPlanModel.getAllPlans();
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, category, isPublished } = req.body;

        const existing = await BusinessPlanModel.getPlanById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Business plan not found' });
        }

        const documentUrl = req.file ? `/uploads/${req.file.filename}` : existing.document_url;
        const safeContent = content && content.trim() ? content : existing.content || existing.summary;

        const updated = await BusinessPlanModel.updatePlan(id, {
            title: title || existing.title,
            summary: summary || existing.summary,
            content: safeContent,
            category: category || existing.category,
            documentUrl,
            isPublished: isPublished !== undefined ? toBoolean(isPublished, existing.is_published) : existing.is_published
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await BusinessPlanModel.deletePlan(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPlan,
    getPublishedPlans,
    getAllPlansAdmin,
    updatePlan,
    deletePlan
};
