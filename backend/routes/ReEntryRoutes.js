import express from 'express'
const router = express.Router()
import {
    getAvailableREList, getREList, getREDetails, updateRE
} from '../controllers/ReEntryController.js'

router.get('/get/available', getAvailableREList)
router.get('/get/list/:selected/:userKey', getREList)
router.get('/get/details/:refNum', getREDetails)
router.post('/update/details', updateRE)

export { router as RERouter }