const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            "Rapport Journalier",
            "Rapport d'Incident",
            "Rapport de Sécurité",
            "Rapport d'Avancement",
            "Rapport de Réception de Matériel"
        ]
    },
    chantier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chantier',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    content: {
        // Common fields for all report types
        description: {
            type: String,
            required: true
        },
        weather: {
            type: String,
            required: function() { return this.type === "Rapport Journalier"; }
        },
        temperature: {
            type: Number,
            required: function() { return this.type === "Rapport Journalier"; }
        },
        
        // Fields for Rapport Journalier
        workersPresent: {
            type: Number,
            required: function() { return this.type === "Rapport Journalier"; }
        },
        tasksCompleted: [{
            description: String,
            status: {
                type: String,
                enum: ['Completed', 'In Progress', 'Blocked']
            }
        }],
        
        // Fields for Rapport d'Incident
        incidentType: {
            type: String,
            required: function() { return this.type === "Rapport d'Incident"; }
        },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            required: function() { return this.type === "Rapport d'Incident"; }
        },
        involvedPersons: [{
            name: String,
            role: String
        }],
        
        // Fields for Rapport de Sécurité
        safetyIssues: [{
            issue: String,
            risk: String,
            recommendation: String
        }],
        
        // Fields for Rapport d'Avancement
        progressPercentage: {
            type: Number,
            min: 0,
            max: 100,
            required: function() { return this.type === "Rapport d'Avancement"; }
        },
        milestone: {
            description: String,
            targetDate: Date,
            status: String
        },
        
        // Fields for Rapport de Réception de Matériel
        materials: [{
            materiel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Materiel'
            },
            quantity: Number,
            condition: String,
            notes: String
        }]
    },
    attachments: [{
        name: String,
        fileUrl: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Reviewed', 'Approved'],
        default: 'Submitted'
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes for common queries
ReportSchema.index({ chantier: 1, date: -1 });
ReportSchema.index({ createdBy: 1, date: -1 });
ReportSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Report', ReportSchema); 