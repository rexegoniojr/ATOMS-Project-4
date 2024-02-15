import mongoose from 'mongoose';

const ReEntrySchema = new mongoose.Schema({
    ActionOwner: {
        type: String,
        require: true,
    },
    filedDate: {
        type: String,
    },
    filedTime: {
        type: String,
    },
    securedDate: {
        type: String,
        require: true,
    },
    securedTime: {
        type: String,
    },
    reStatus: {
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

export const ReEntryList = mongoose.model("ReEntryList", ReEntrySchema);