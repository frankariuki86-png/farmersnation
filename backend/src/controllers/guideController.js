const FarmingGuideModel = require('../models/FarmingGuide');

// Create guide (Admin only)
const createGuide = async (req, res) => {
    try {
        const { title, description, category, content, isPublished } = req.body;
        const ebookUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const guide = await FarmingGuideModel.createGuide(
            title,
            description,
            category,
            content,
            ebookUrl,
            null,
            req.user.id
        );

        if (isPublished) {
            await FarmingGuideModel.updateGuide(guide.id, title, description, category, content, ebookUrl, null, true);
        }

        res.status(201).json({ success: true, data: guide });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all published guides
const getGuides = async (req, res) => {
    try {
        const guides = await FarmingGuideModel.getPublishedGuides();
        res.status(200).json({ success: true, data: guides });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all guides (Admin only)
const getAllGuidesAdmin = async (req, res) => {
    try {
        const guides = await FarmingGuideModel.getAllGuides();
        res.status(200).json({ success: true, data: guides });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get guides by category
const getGuidesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const guides = await FarmingGuideModel.getGuidesByCategory(category);
        res.status(200).json({ success: true, data: guides });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single guide
const getGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await FarmingGuideModel.getGuideById(id);

        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }

        await FarmingGuideModel.incrementViews(id);
        res.status(200).json({ success: true, data: guide });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update guide (Admin only)
const updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, content, isPublished } = req.body;
        
        const existingGuide = await FarmingGuideModel.getGuideById(id);
        if (!existingGuide) {
            return res.status(404).json({ error: 'Guide not found' });
        }

        const ebookUrl = req.file ? `/uploads/${req.file.filename}` : existingGuide.ebook_url;

        const guide = await FarmingGuideModel.updateGuide(
            id,
            title || existingGuide.title,
            description || existingGuide.description,
            category || existingGuide.category,
            content || existingGuide.content,
            ebookUrl,
            existingGuide.thumbnail_url,
            isPublished !== undefined ? isPublished : existingGuide.is_published
        );

        res.status(200).json({ success: true, data: guide });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete guide (Admin only)
const deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await FarmingGuideModel.deleteGuide(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createGuide,
    getGuides,
    getAllGuidesAdmin,
    getGuidesByCategory,
    getGuide,
    updateGuide,
    deleteGuide
};
