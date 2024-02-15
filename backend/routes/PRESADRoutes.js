import express from 'express'
const router = express.Router()
import {
    submitTurnOverPreSad, getTurnOverPRESADDetails, getTurnOverPRESADList,
    getPresadDetails, submitPreSad
} from '../controllers/PRESADController.js'

router.get('/get/turn_over/details/:refNum', getTurnOverPRESADDetails)
router.post('/submit/turnOver/to/declarant', submitTurnOverPreSad)
router.get('/get/turn_over/list/:userKey', getTurnOverPRESADList)
router.get('/get/details/:refNum', getPresadDetails)
router.post('/submit/details', submitPreSad)

export { router as PRESADRouter }