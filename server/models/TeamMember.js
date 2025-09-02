const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    role: {
        type: String,
        enum: ['Sales Person', 'Manager', 'Admin'],
        default: 'Sales Person'
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Inactive'],
        default: 'Pending'
    },
    invitationToken: {
        type: String,
        required: false,
        default: null
    },
    invitationExpires: {
        type: Date,
        required: false,
        default: null
    },
    acceptedAt: {
        type: Date
    },
    lastLogin: {
        type: Date,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
teamMemberSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for faster queries
teamMemberSchema.index({ email: 1, companyId: 1 });
teamMemberSchema.index({ invitationToken: 1 });

module.exports = mongoose.model("TeamMember", teamMemberSchema);
