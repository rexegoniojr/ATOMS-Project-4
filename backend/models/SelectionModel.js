import mongoose from 'mongoose';

const consigneeSchema = new mongoose.Schema({
    consigneeName: {
        type: String,
        required: [true, 'Consignee Name is required'],
    },
    userKey: {
        type: String,
    },
    dateInput: {
        type: String,
    },
    refNum: {
        type: String,
    },
    visible: {
        type: Number,
        default: 1
    }
})

export const ConsigneeList = mongoose.model("ConsigneeList", consigneeSchema);

const permitSchema = new mongoose.Schema({
    typeOfPermit: {
        type: String,
        required: [true, 'Type of Permit is required'],
    },
    userKey: {
        type: String,
    },
    dateInput: {
        type: String,
    },
    refNum: {
        type: String,
    },
    visible: {
        type: Number,
        default: 1
    }
})


export const TypeOfPermitList = mongoose.model("TypeOfPermitList", permitSchema);