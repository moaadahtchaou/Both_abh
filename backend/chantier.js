const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./protected');
const Chantier = require('./models/Chantier');
const Materiel = require('./models/Materiel');

// Helper function to check if user can modify chantier
const canModifyChantier = (user, chantier) => {
    return user.role === 'Admin' || chantier.chefResponsable.toString() === user.id;
};

// Create a new chantier (Admin only)
router.post('/chantiers', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ 
                message: 'Accès refusé. Seuls les administrateurs peuvent créer des chantiers.' 
            });
        }

        // Add creator information to the request body
        const chantierData = {
            ...req.body,
            createdBy: req.user.id
        };

        const chantier = await Chantier.create(chantierData);
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
        let chantiers;
        if (req.user.role === 'Admin') {
            // Admins can see all chantiers
            chantiers = await Chantier.find()
                .populate('createdBy', 'name email')
                .populate('chefResponsable', 'name email')
                .populate({
                    path: 'equipment.item',
                    select: 'name type status identifier'
                });
        } else {
            // Regular users can only see chantiers where they are the chef
            chantiers = await Chantier.find({ chefResponsable: req.user.id })
                .populate('createdBy', 'name email')
                .populate('chefResponsable', 'name email')
                .populate({
                    path: 'equipment.item',
                    select: 'name type status identifier'
                });
        }
        res.json(chantiers);
    } catch (error) {
        console.error('Error fetching chantiers:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des chantiers',
            error: error.message 
        });
    }
});

// Add new endpoint to assign materiel to chantier
router.post('/chantiers/:id/equipment', authMiddleware, async (req, res) => {
    try {
        const { materielId } = req.body;
        if (!materielId) {
            return res.status(400).json({ message: 'ID du matériel requis' });
        }

        const chantier = await Chantier.findById(req.params.id);
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }

        // Check if user has permission
        if (!canModifyChantier(req.user, chantier)) {
            return res.status(403).json({ 
                message: 'Accès refusé. Seuls l\'administrateur et le chef responsable peuvent modifier ce chantier.' 
            });
        }

        // Add equipment to chantier
        chantier.equipment.push({
            item: materielId,
            assignedDate: new Date(),
            returnDate: null
        });

        // Update materiel status and location
        await Materiel.findByIdAndUpdate(materielId, {
            status: 'En utilisation',
            'location.currentSite': chantier._id
        });

        const updatedChantier = await chantier.save();
        
        // Populate and return the updated chantier
        const populatedChantier = await Chantier.findById(updatedChantier._id)
            .populate('createdBy', 'name email')
            .populate('chefResponsable', 'name email')
            .populate({
                path: 'equipment.item',
                select: 'name type status identifier'
            });

        res.json(populatedChantier);
    } catch (error) {
        console.error('Error assigning equipment:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'assignation du matériel',
            error: error.message 
        });
    }
});

// Add endpoint to remove materiel from chantier
router.delete('/chantiers/:chantierId/equipment/:equipmentId', authMiddleware, async (req, res) => {
    try {
        const chantier = await Chantier.findById(req.params.chantierId);
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }

        // Check if user has permission
        if (!canModifyChantier(req.user, chantier)) {
            return res.status(403).json({ 
                message: 'Accès refusé. Seuls l\'administrateur et le chef responsable peuvent modifier ce chantier.' 
            });
        }

        // Find the equipment and mark return date
        const equipment = chantier.equipment.id(req.params.equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Équipement non trouvé dans ce chantier' });
        }

        equipment.returnDate = new Date();
        
        // Update materiel status and location
        await Materiel.findByIdAndUpdate(equipment.item, {
            status: 'Disponible',
            'location.currentSite': null
        });

        await chantier.save();

        // Populate and return the updated chantier
        const populatedChantier = await Chantier.findById(chantier._id)
            .populate('createdBy', 'name email')
            .populate('chefResponsable', 'name email')
            .populate({
                path: 'equipment.item',
                select: 'name type status identifier'
            });

        res.json(populatedChantier);
    } catch (error) {
        console.error('Error removing equipment:', error);
        res.status(500).json({ 
            message: 'Erreur lors du retrait du matériel',
            error: error.message 
        });
    }
});

// Get a single chantier by ID
router.get('/chantiers/:id', authMiddleware, async (req, res) => {
    try {
        const chantier = await Chantier.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('chefResponsable', 'name email')
            .populate({
                path: 'equipment.item',
                select: 'name type status identifier'
            });
        
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }

        // Check if user has permission to view this chantier
        if (req.user.role !== 'Admin' && chantier.chefResponsable._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès refusé' });
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
        const chantier = await Chantier.findById(req.params.id);
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }

        // Check if user has permission to update this chantier
        if (!canModifyChantier(req.user, chantier)) {
            return res.status(403).json({ 
                message: 'Accès refusé. Seuls l\'administrateur et le chef responsable peuvent modifier ce chantier.' 
            });
        }

        const updatedChantier = await Chantier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email')
         .populate('chefResponsable', 'name email');

        res.json(updatedChantier);
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
        const chantier = await Chantier.findById(req.params.id);
        if (!chantier) {
            return res.status(404).json({ message: 'Chantier non trouvé' });
        }

        // Check if user has permission to delete this chantier
        if (!canModifyChantier(req.user, chantier)) {
            return res.status(403).json({ 
                message: 'Accès refusé. Seuls l\'administrateur et le chef responsable peuvent supprimer ce chantier.' 
            });
        }

        await Chantier.findByIdAndDelete(req.params.id);
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