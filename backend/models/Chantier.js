const mongoose = require('mongoose');

const ChantierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a site name'],
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required']
    },
    chefResponsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Chef responsable is required']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please provide an address']
        },
        city: {
            type: String,
            required: [true, 'Please provide a city']
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    client: {
        name: {
            type: String,
            required: [true, 'Please provide a client name']
        },
        contact: {
            phone: String,
            email: String
        }
    },
    status: {
        type: String,
        enum: ['En cours', 'Planifié', 'Terminé', 'En pause'],
        default: 'Planifié'
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date']
    },
    estimatedEndDate: {
        type: Date,
        required: [true, 'Please provide an estimated end date']
    },
    actualEndDate: {
        type: Date
    },
    budget: {
        estimated: {
            type: Number,
            required: [true, 'Please provide an estimated budget']
        },
        actual: {
            type: Number,
            default: 0
        }
    },
    description: {
        type: String,
        trim: true
    },
    assignedTeam: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: String
    }],
    equipment: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Materiel'
        },
        assignedDate: Date,
        returnDate: Date
    }],
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    documents: [{
        name: String,
        fileUrl: String,
        uploadDate: {
            type: Date,
            default: Date.now
        },
        type: String // 'permit', 'contract', 'plan', etc.
    }],
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
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Add indexes for common queries
ChantierSchema.index({ status: 1 });
ChantierSchema.index({ 'location.city': 1 });
ChantierSchema.index({ startDate: 1 });
ChantierSchema.index({ 'client.name': 1 });

module.exports = mongoose.model('Chantier', ChantierSchema); 