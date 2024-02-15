import express from 'express'
const router = express.Router()
import {
    assignCDT, updateCDT, getForCDTList, getAssinedCDT,
    submitTurnOverToCS, getAssignedCDTUser, getCDTAssignedList
} from '../controllers/CDTController.js'

router.get('/get/ForCDTList', getForCDTList)
router.post('/assign/user', assignCDT)
router.post('/update/assigned/cdt', updateCDT)
router.get('/get/assigned/user/:refNum', getAssinedCDT)
router.get('/get/user/assigned/:userKey', getAssignedCDTUser)
router.post('/turn_over/to/cs', submitTurnOverToCS)
router.get('/get/assigned/CDT/List/:userKey', getCDTAssignedList)

export { router as CDTRouter }