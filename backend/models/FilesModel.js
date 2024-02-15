import mongoose from 'mongoose';

const filesSchema = new mongoose.Schema({
    fileName: {
        type: String,
        require: true,
    },
    fileSize: {
        type: String,
    },
    file_path: {
        type: String,
    },
    file_mimetype: {
        type: String,
    },
    visible: {
        type: Number,
        default: 1
    },
    dateUpload: {
        type: String,
    },
    timeUpload: {
        type: String,
    },
    fileID: { type: String, unique: true },
    fileKey: { type: String },
    refNum: { type: String },
    uploadBy: { type: String },
    userKey: { type: String },
},
    {
        timestamps: true
    })

export const FilesList = mongoose.model("FilesList", filesSchema);