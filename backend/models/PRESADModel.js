import mongoose from 'mongoose';

const TurnOverPRESADSchema = new mongoose.Schema({
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
    declarantUserKey: { type: String },
    userKey: { type: String },
    refNum: { type: String },
},
    {
        timestamps: true
    })

export const TurnOverPreSad = mongoose.model("TurnOverPreSad", TurnOverPRESADSchema);

const PRESADSchema = new mongoose.Schema({
    ActionOwner:{
        type: String,
        require: true,
    },
    PRESADDate: {
        type: String,
        require: true,
    },
    PRESADTime: {
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

export const PRESADList = mongoose.model("PRESADList", PRESADSchema);