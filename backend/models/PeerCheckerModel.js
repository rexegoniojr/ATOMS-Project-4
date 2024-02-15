import mongoose from 'mongoose';

const AssignPeerCheckerSchema = new mongoose.Schema({
    PeerCheckerActionOwner: {
        type: String,
    },
    dateAssigned: {
        type: String,
    },
    timeAssigned: {
        type: String,
    },
    dateComplete: {
        type: String,
        default: ''
    },
    timeComplete: {
        type: String,
        default: ''
    },
    pcStatus: {
        type: String,
        default: 'Assigned'
    },
    Remarks: {
        type: String,
        default: ''
    },
    assignedBy: {
        type: String,
    },
    assigneeKey: {
        type: String,
    },
    userPCKey: {
        type: String,
    },
    sortMonth: { type: String, require: true, },
    sortDay: { type: String, require: true, },
    sortYear: { type: String, require: true, },
    sortTime: { type: String, require: true, },
    peerCheckerKey: { type: String, unique: true, },
    refNum: { type: String },
},
    {
        timestamps: true
    })

export const AssignedPeerCheckerList = mongoose.model("AssignedPeerCheckerList", AssignPeerCheckerSchema);