const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {type: String,  required: true},
    lastName: {type: String,  required: true},
    mail: {type: String, unique: true,  required: true},
    password: {type: String, required: true},
    confirmPassword: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin', 'company_admin'], default: 'user'},
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: function() {
            return this.role === 'company_admin';
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
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
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = userSchema;
