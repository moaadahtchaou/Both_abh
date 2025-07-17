const mongoose = require('mongoose');

const MaterielSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide equipment name'],
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required']
    },
    type: {
        type: String,
        required: [true, 'Please provide equipment type'],
        enum: [
            'Véhicule',
            'Outil électrique',
            'Outil manuel',
            'Machine lourde',
            'Échafaudage',
            'Équipement de sécurité',
            'Autre'
        ]
    },
    identifier: {
        type: String,
        required: [true, 'Please provide a unique identifier'],
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Disponible', 'En utilisation', 'En maintenance', 'Hors service'],
        default: 'Disponible'
    },
    specifications: {
        brand: String,
        model: String,
        year: Number,
        serialNumber: String,
        capacity: String, // e.g., "2 tonnes" for a crane
        power: String, // e.g., "5000W" for electrical equipment
    },
    maintenance: {
        lastMaintenance: Date,
        nextMaintenanceDate: Date,
        maintenanceHistory: [{
            date: Date,
            description: String,
            cost: Number,
            performedBy: String,
            documents: [{
                name: String,
                fileUrl: String
            }]
        }]
    },
    acquisition: {
        purchaseDate: Date,
        purchasePrice: Number,
        supplier: {
            name: String,
            contact: String
        },
        warranty: {
            startDate: Date,
            endDate: Date,
            documents: [{
                name: String,
                fileUrl: String
            }]
        }
    },
    location: {
        currentSite: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chantier'
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        lastKnownLocation: {
            latitude: Number,
            longitude: Number,
            updatedAt: Date
        }
    },
    usage: {
        totalHours: {
            type: Number,
            default: 0
        },
        fuelConsumption: String, // e.g., "10L/hour"
        usageHistory: [{
            site: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Chantier'
            },
            startDate: Date,
            endDate: Date,
            hoursUsed: Number
        }]
    },
    insurance: {
        provider: String,
        policyNumber: String,
        startDate: Date,
        endDate: Date,
        documents: [{
            name: String,
            fileUrl: String
        }]
    },
    notes: [{
        text: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    images: [{
        url: String,
        description: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Add indexes for common queries
MaterielSchema.index({ status: 1 });
MaterielSchema.index({ type: 1 });
MaterielSchema.index({ identifier: 1 }, { unique: true });
MaterielSchema.index({ 'location.currentSite': 1 });

module.exports = mongoose.model('Materiel', MaterielSchema); 