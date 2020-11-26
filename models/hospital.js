const mongoose = require('mongoose');
const HospitalAvailabilitySchema = require('./hospital_availability').HospitalAvailabilitySchema;

const HospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: false,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    availability: [HospitalAvailabilitySchema]
});



const Hospital = mongoose.model("Hospitals",HospitalSchema);

module.exports = Hospital;