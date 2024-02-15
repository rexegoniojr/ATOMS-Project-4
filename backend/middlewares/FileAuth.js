import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let today = new Date()
        let date = ("0" + today.getDate()).slice(-2);
        let month = ("0" + (today.getMonth() + 1)).slice(-2);
        let year = today.getFullYear();
        let location = `./archive/${req.body.fileKey}/${year + '-' + month}`
        fs.mkdirSync(location, { recursive: true })
        cb(null, location)

    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

export const upload = multer({ storage })
export const getSizeFile = (bytes, decimals) => {
    if (decimals === 0) return '0 Bytes'
    const dm = decimals || 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
    const index = Math.floor(Math.log(bytes) / Math.log(1000))
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + '-' + sizes[index]
}
