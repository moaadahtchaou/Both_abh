const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../protected');
const Report = require('../models/Report');
const Chantier = require('../models/Chantier');

// Helper function to check if user can access chantier
const canAccessChantier = async (userId, chantierId) => {
    const chantier = await Chantier.findById(chantierId);
    return chantier && (
        chantier.chefResponsable.toString() === userId ||
        chantier.assignedTeam.some(member => member.user.toString() === userId)
    );
};

// Create a new report
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { chantier: chantierId } = req.body;
        
        // Check if user has access to this chantier
        if (req.user.role !== 'Admin') {
            const hasAccess = await canAccessChantier(req.user.id, chantierId);
            if (!hasAccess) {
                return res.status(403).json({ message: "Vous n'avez pas accès à ce chantier" });
            }
        }

        const report = await Report.create({
            ...req.body,
            createdBy: req.user.id
        });

        const populatedReport = await Report.findById(report._id)
            .populate('createdBy', 'name email')
            .populate('chantier', 'name')
            .populate('content.materials.materiel', 'name identifier');

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création du rapport',
            error: error.message 
        });
    }
});

// Get all reports (filtered by user role and access)
router.get('/', authMiddleware, async (req, res) => {
    try {
        let query = {};
        
        // If not admin, only show reports from chantiers they have access to
        if (req.user.role !== 'Admin') {
            const accessibleChantiers = await Chantier.find({
                $or: [
                    { chefResponsable: req.user.id },
                    { 'assignedTeam.user': req.user.id }
                ]
            }).select('_id');
            
            query.chantier = { 
                $in: accessibleChantiers.map(c => c._id) 
            };
        }

        // Apply filters if provided
        if (req.query.chantier) query.chantier = req.query.chantier;
        if (req.query.type) query.type = req.query.type;
        if (req.query.startDate || req.query.endDate) {
            query.date = {};
            if (req.query.startDate) query.date.$gte = new Date(req.query.startDate);
            if (req.query.endDate) query.date.$lte = new Date(req.query.endDate);
        }

        const reports = await Report.find(query)
            .populate('createdBy', 'name email')
            .populate('chantier', 'name')
            .populate('content.materials.materiel', 'name identifier')
            .sort({ date: -1 });

        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des rapports',
            error: error.message 
        });
    }
});

// Get a specific report
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('chantier', 'name')
            .populate('content.materials.materiel', 'name identifier')
            .populate('comments.user', 'name');

        if (!report) {
            return res.status(404).json({ message: 'Rapport non trouvé' });
        }

        // Check access rights
        if (req.user.role !== 'Admin') {
            const hasAccess = await canAccessChantier(req.user.id, report.chantier._id);
            if (!hasAccess) {
                return res.status(403).json({ message: "Vous n'avez pas accès à ce rapport" });
            }
        }

        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du rapport',
            error: error.message 
        });
    }
});

// Update a report
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Rapport non trouvé' });
        }

        // Check if user has rights to update
        if (req.user.role !== 'Admin' && report.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'avez pas le droit de modifier ce rapport" });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        .populate('createdBy', 'name email')
        .populate('chantier', 'name')
        .populate('content.materials.materiel', 'name identifier')
        .populate('comments.user', 'name');

        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du rapport',
            error: error.message 
        });
    }
});

// Delete a report
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Rapport non trouvé' });
        }

        // Only admin or report creator can delete
        if (req.user.role !== 'Admin' && report.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer ce rapport" });
        }

        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rapport supprimé avec succès' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la suppression du rapport',
            error: error.message 
        });
    }
});

// Add a comment to a report
router.post('/:id/comments', authMiddleware, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Rapport non trouvé' });
        }

        // Check if user has access to this report's chantier
        if (req.user.role !== 'Admin') {
            const hasAccess = await canAccessChantier(req.user.id, report.chantier);
            if (!hasAccess) {
                return res.status(403).json({ message: "Vous n'avez pas accès à ce rapport" });
            }
        }

        const comment = {
            user: req.user.id,
            text: req.body.text,
            date: new Date()
        };

        report.comments.push(comment);
        await report.save();

        const updatedReport = await Report.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('chantier', 'name')
            .populate('comments.user', 'name');

        res.json(updatedReport);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'ajout du commentaire',
            error: error.message 
        });
    }
});

module.exports = router; 