import express from 'express'
const router = express.Router()
import {
    getPeerCheckerDetails, assignPeerChecker, transferPeerChecker, getPeerCheckerAssignedList,
    updatePeerChecker
} from '../controllers/PeerCheckerController.js'

router.get('/get/assigned/list/:userKey', getPeerCheckerAssignedList)
router.get('/get/details/:refNum', getPeerCheckerDetails)
router.post('/assign/user', assignPeerChecker)
router.post('/update/assigned/user', transferPeerChecker)
router.post('/update/details', updatePeerChecker)

export { router as PeerCheckerRouter }