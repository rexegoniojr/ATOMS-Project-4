import mongoose from 'mongoose';

const forCDTSchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        require: true,
    },
    DeclarantName: {
        type: String,
        require: true,
    },
    DateAssigned: {
        type: String,
    },
    TimeAssigned: {
        type: String,
    },
    DateOfCDT: {
        type: String,
    },
    TimeOfCDT: {
        type: String,
    },
    Remarks: {
        type: String,
    },
    ReviseRemarks: {
        type: String,
    },
    CDTStatus: {
        type: String,
    },
    transferToCS: { type: Number, default: 0 },
    assignedBy: { type: String, },
    assigneeKey: { type: String, },
    sortMonth: { type: String, require: true, },
    sortDay: { type: String, require: true, },
    sortYear: { type: String, require: true, },
    sortTime: { type: String, require: true, },
    declarantKey: { type: String, unique: true, },
    CDTKey: { type: String, unique: true, },
    userKey: { type: String },
    refNum: { type: String },
},
    {
        timestamps: true
    })

export const CDTList = mongoose.model("CDTList", forCDTSchema);

const declarantCDTTurnOverSchema = new mongoose.Schema({
    ActionOwner:{
        type: String,
        require: true,
    },
    dateOfTurnOver: {
        type: String,
        require: true,
    },
    timeOfTurnOver: {
        type: String,
    },
    dateSentToClient: { type: String, default: '' },
    timeSentToClient: { type: String, default: '' },
    clientApprovalDate: { type: String, default: '' },
    clientApprovalTime: { type: String, default: '' },
    sortMonth: { type: String, require: true, },
    sortDay: { type: String, require: true, },
    sortYear: { type: String, require: true, },
    sortTime: { type: String, require: true, },
    CDTKey: { type: String, unique: true, },
    userKey: { type: String },
    refNum: { type: String },
},
    {
        timestamps: true
    })

export const DeclarantCDTTurnOverList = mongoose.model("DeclarantCDTTurnOverList",
    declarantCDTTurnOverSchema);