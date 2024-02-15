import express from 'express'
const router = express.Router()
import {
    getAvailableDOROList, getDOROList, getDORODetails,
    updateDORO
} from '../controllers/DOROController.js'

router.get('/get/available', getAvailableDOROList)
router.get('/get/list/:selected/:userKey', getDOROList)
router.get('/get/details/:refNum', getDORODetails)
router.post('/update/details', updateDORO)

export { router as DORORouter }