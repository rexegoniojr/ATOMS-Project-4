import mongoose from 'mongoose';

const assignPermitSchema = new mongoose.Schema({
    permitActionOwner:{
        type: String,
        require: true,
    },
    typeOfPermit: {
        type: String,
    },
    dateOfAppPermit: {
        type: String,
    },
    dateSecPermit: {
        type: String,
    },
    permitRemarks: {
        type: String,
    },
    permitStatus: {
        type: String,
    },
    submitDate: {
        type: String,
    },
    submitTime: {
        type: String,
    },
    assignedBy: {
        type: String,
    },
    assigneeKey: {
        type: String,
    },
    userPermitKey: {
        type: String,
    },
    sortMonth: { type: String, require: true, },
    sortDay: { type: String, require: true, },
    sortYear: { type: String, require: true, },
    sortTime: { type: String, require: true, },
    permitKey: { type: String, unique: true, },
    refNum: {
        type: String,
    },
    visible: {
        type: Number,
        default: 1
    }
},
    {
        timestamps: true,
    })

export const AssignedPermitList = mongoose.model("AssignedPermitList", assignPermitSchema);