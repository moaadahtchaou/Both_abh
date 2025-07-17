const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./protected');
const Materiel = require('./models/Materiel');

// Create new materiel (Admin only)
router.post('/materiel', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ 
                message: 'Accès refusé. Seuls les administrateurs peuvent créer du matériel.' 
            });
        }

        // Add creator information to the request body
        const materielData = {
            ...req.body,
            createdBy: req.user.id
        };

        const materiel = await Materiel.create(materielData);
        res.status(201).json(materiel);
    } catch (error) {
        console.error('Error creating materiel:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création du matériel',
            error: error.message 
        });
    }
});

// Get all materiel
router.get('/materiel', authMiddleware, async (req, res) => {
    try {
        const materiel = await Materiel.find()
            .populate('createdBy', 'name email')
            .populate('location.currentSite', 'name')
            .populate('location.assignedTo', 'name');
        res.json(materiel);
    } catch (error) {
        console.error('Error fetching materiel:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du matériel',
            error: error.message 
        });
    }
});

// Get single materiel by ID
router.get('/materiel/:id', authMiddleware, async (req, res) => {
    try {
        const materiel = await Materiel.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('location.currentSite', 'name')
            .populate('location.assignedTo', 'name');
        if (!materiel) {
            return res.status(404).json({ message: 'Matériel non trouvé' });
        }
        res.json(materiel);
    } catch (error) {
        console.error('Error fetching materiel:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du matériel',
            error: error.message 
        });
    }
});

// Update materiel
router.put('/materiel/:id', authMiddleware, async (req, res) => {
    try {
        const materiel = await Materiel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!materiel) {
            return res.status(404).json({ message: 'Matériel non trouvé' });
        }
        res.json(materiel);
    } catch (error) {
        console.error('Error updating materiel:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du matériel',
            error: error.message 
        });
    }
});

// Delete materiel
router.delete('/materiel/:id', authMiddleware, async (req, res) => {
    try {
        const materiel = await Materiel.findByIdAndDelete(req.params.id);
        if (!materiel) {
            return res.status(404).json({ message: 'Matériel non trouvé' });
        }
        res.json({ message: 'Matériel supprimé avec succès' });
    } catch (error) {
        console.error('Error deleting materiel:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la suppression du matériel',
            error: error.message 
        });
    }
});

module.exports = router; 