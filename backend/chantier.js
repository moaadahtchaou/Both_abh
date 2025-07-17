const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./protected');
const Chantier = require('./models/Chantier');

// Create a new chantier (Admin only)
router.post('/chantiers', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ 
                message: 'Accès refusé. Seuls les administrateurs peuvent créer des chantiers.' 
            });
        }

        const chantier = await Chantier.create(req.body);
        res.status(201).json(chantier);
    } catch (error) {
        console.error('Error creating chantier:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création du chantier',
            error: error.message 
        });
    }
});

// Get all chantiers
router.get('/chantiers', authMiddleware, async (req, res) => {
    try {
        const chantiers = await Chantier.find();
        res.json(chantiers);
    } catch (error) {
        console.error('Error fetching chantiers:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des chantiers',
            error: error.message 
        });
    }
});

// Get a single chantier by ID
router.get('/chantiers/:id', authMiddleware, async (req, res) => {
    try {
        const chantier = await Chantier.findById(req.params.id);
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }
        res.json(chantier);
    } catch (error) {
        console.error('Error fetching chantier:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du chantier',
            error: error.message 
        });
    }
});

// Update a chantier
router.put('/chantiers/:id', authMiddleware, async (req, res) => {
    try {
        const chantier = await Chantier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }
        res.json(chantier);
    } catch (error) {
        console.error('Error updating chantier:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du chantier',
            error: error.message 
        });
    }
});

// Delete a chantier
router.delete('/chantiers/:id', authMiddleware, async (req, res) => {
    try {
        const chantier = await Chantier.findByIdAndDelete(req.params.id);
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }
        res.json({ message: 'Chantier supprimé avec succès' });
    } catch (error) {
        console.error('Error deleting chantier:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la suppression du chantier',
            error: error.message 
        });
    }
});

module.exports = router; 