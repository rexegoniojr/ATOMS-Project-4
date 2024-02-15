import express from 'express'
const router = express.Router()
import { uploadFile, getAllFiles, downloadFile } from '../controllers/FileController.js'
import { upload } from '../middlewares/FileAuth.js'

router.post('/upload', upload.array('files'), uploadFile)
router.get('/download/:fileID', downloadFile)
router.get('/get/files/:fileKey', getAllFiles)

export { router as FileRouter }