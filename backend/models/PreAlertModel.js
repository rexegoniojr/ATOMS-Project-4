import mongoose from 'mongoose';

const shipSeqSchema = new mongoose.Schema({
    ssqData: {
        type: String
    },
    ssqNumber: {
        type: Number,
        unique: true,
    }
})

export const ShipmentSequence = mongoose.model("ShipmentSequence", shipSeqSchema);

const preAlertSchema = new mongoose.Schema({
    sos: {
        type: Number,
    },
    typeOfShipment: {
        type: String,
    },
    typeOfDeclaration: {
        type: String,
    },
    nameOfCS: {
        type: String,
    },
    consigneeName: {
        type: String,
    },
    typeOfAccount: {
        type: String,
    },
    hbl_awbl: {
        type: String,
    },
    arrivalDate: {
        type: String,
    },
    dateOfReceipt: {
        type: String,
    },
    timeOfReceipt: {
        type: String,
    },
    numOfLineItems: {
        type: String,
    },
    proNum: {
        type: String,
    },
    oldPro: {
        type: String,
    },
    remarks: {
        type: String,
    },
    typeOfPermit: {
        type: String,
    },
    userKey: {
        type: String,
    },
    sortMonth: { type: String, require: true, },
    sortDay: { type: String, require: true, },
    sortYear: { type: String, require: true, },
    sortTime: { type: String, require: true, },
    fileKey: { type: String, unique: true, },
    refNum: { type: String, unique: true, },
},
    {
        timestamps: true,
    });

export const PreAlertList = mongoose.model("PreAlertList", preAlertSchema);

const TurnOverToDeclarantSchema = new mongoose.Schema({
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

export const PreAlertTurnOverList = mongoose.model("PreAlertTurnOverList", TurnOverToDeclarantSchema);