import mongoose from 'mongoose';

const GatepassSchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        require: true,
    },
    FAN: {
        type: String,
    },
    SSDT: {
        type: String,
    },
    requestedValidity: {
        type: String,
    },
    requestDate: {
        type: String,
        require: true,
    },
    requestTime: {
        type: String,
        require: true,
    },
    receivedtDate: {
        type: String,
        require: true,
    },
    receivedTime: {
        type: String,
        require: true,
    },
    releasedDate: {
        type: String,
        require: true,
    },
    sortMonth: { type: String, require: true, },
    sortDay: { type: String, require: true, },
    sortYear: { type: String, require: true, },
    sortTime: { type: String, require: true, },
    userKey: { type: String },
    refNum: { type: String },
},
    {
        timestamps: true
    })

export const GatepassList = mongoose.model("GatepassList", GatepassSchema);