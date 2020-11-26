const mongoose = require('mongoose');

const HospitalAvailabilitySchema = new mongoose.Schema({
    availableCount: {
        type: Number,
        required: true,
        trim: true
    },
    availableUpdateTime: {
        type: String,
        required: false,
        trim: true
    },
    unavailableCount: {
        type: Number,
        required: true,
        trim: true
    },
    unavailableUpdateTime: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        default: "General",
        trim: true
    }
}, {
    timestamps: true
});

const HospitalAvailability = mongoose.model("HospitalAvailability",HospitalAvailabilitySchema);

module.exports = { HospitalAvailability, HospitalAvailabilitySchema};