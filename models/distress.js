const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Distress = mongoose.model('Distress', new mongoose.Schema({
    rideid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    driverid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    riderid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    vehicleid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    initiator: {
        type: String,
        required: true
    },
    riderlocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    driverlocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    created: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
}, { timestamps: true }));

Distress.createIndexes();

module.exports = Distress;
