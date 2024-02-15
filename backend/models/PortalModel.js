import mongoose from 'mongoose';

const PortalSchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        require: true,
    },
    portalDate: {
        type: String,
        require: true,
    },
    portalTime: {
        type: String,
    },
    portalStatus: {
        type: String,
    },
    ticketNo: {
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

export const PortalList = mongoose.model("PortalList", PortalSchema);