import mongoose from 'mongoose';

const DOROSchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        require: true,
    },
    appliedDate: {
        type: String,
        default: ''
    },
    appliedTime: {
        type: String,
        default: ''
    },
    securedDate: {
        type: String,
        default: ''
    },
    securedTime: {
        type: String,
        default: ''
    },
    drStatus: {
        type: String,
        default: 'Pending'
    },
    Remarks: {
        type: String,
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

export const DOROList = mongoose.model("DOROList", DOROSchema);