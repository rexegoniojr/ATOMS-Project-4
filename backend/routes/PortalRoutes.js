import express from 'express'
const router = express.Router()
import {
    getAvailablePortal, getPortalList,
    getPortalDetails, updatePortal
} from '../controllers/PortalController.js'

router.get('/get/available', getAvailablePortal)
router.get('/get/list/:selected/:userKey', getPortalList)
router.get('/get/details/:refNum', getPortalDetails)
router.post('/update/details', updatePortal)

export { router as PortalRouter }