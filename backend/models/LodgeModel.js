import mongoose from 'mongoose';

const LodgeDetailsSchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        require: true,
    },
    LodgeDate: {
        type: String,
        require: true,
    },
    LodgeTime: {
        type: String,
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

export const LodgeList = mongoose.model("LodgeList", LodgeDetailsSchema);

const SADSchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        require: true,
    },
    sentDate: {
        type: String,
        require: true,
    },
    sentTime: {
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

export const SADSentToClientList = mongoose.model("SADSentToClientList", SADSchema);