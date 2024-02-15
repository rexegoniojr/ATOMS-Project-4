import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { FilesList } from '../models/FilesModel.js'
import { getSizeFile } from '../middlewares/FileAuth.js' 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res) => {
    try {
        let today = new Date()
        let date = ("0" + today.getDate()).slice(-2);
        let month = ("0" + (today.getMonth() + 1)).slice(-2);
        let year = today.getFullYear();
        let hours = today.getHours();
        let minutes = today.getMinutes();
        const { fileKey, refNum } = req.body
        req.files.map(async (x) => {
            const file = {
                fileName: x.originalname,
                fileSize: getSizeFile(x.size, 2),
                file_path: x.path,
                file_mimetype: x.mimetype,
                dateUpload: month + '-' + date + '-' + year,
                timeUpload: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
                fileID: crypto.randomBytes(22).toString('hex'),
                fileKey: fileKey,
                refNum: refNum
            }
            const storage = new FilesList(file);
            await storage.save()
        })
        if (req.files.length === 1) {
            res.json({
                title: 'File upload successful',
                message: `${req.files[0].originalname} is now stored to the server.`,
                status: 'success'
            });
        }
        else {
            res.json({
                title: 'Multiple Files upload successful',
                message: `${req.files.length} files is now stored to the server.`,
                status: 'success'
            });
        }
    }
    catch (error) {
        res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error'
        });
    }
}

export const getAllFiles = async (req, res) => {
    const { fileKey } = req.params
    await FilesList.find({ fileKey: fileKey })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const downloadFile = async (req, res) => {
    try {
        const fileHolder = await FilesList.findOne({ fileID: req.params.fileID })
        res.set({ 'Content-Type': fileHolder.file_mimetype })
        res.sendFile(path.join(__dirname, '..', fileHolder.file_path));
    }
    catch (error) {
        res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error'
        });
    }
}