import mongoose from 'mongoose';

const FundRequestSchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        default: ''
    },
    frNote: {
        type: String,
        require: true,
    },
    requestDate: {
        type: String,
        require: true,
    },
    requestTime: {
        type: String,
    },
    receivedDate: {
        type: String,
        default: ''
    },
    receivedTime: {
        type: String,
        default: ''
    },
    Remarks: {
        type: String,
        default: ''
    },
    frStatus: {
        type: String,
        default: 'Available'
    },
    sortMonth: { type: String, require: true, },
    sortDay: { type: String, require: true, },
    sortYear: { type: String, require: true, },
    sortTime: { type: String, require: true, },
    frKey: { type: String, unique: true, },
    userKey: { type: String, default: '' },
    refNum: { type: String },
},
    {
        timestamps: true
    })

export const FundRequestList = mongoose.model("FundRequestList", FundRequestSchema);