import express from 'express'
const router = express.Router()
import {
    submitPreAlert, submitUpdatePreAlert, getPreAlertComplete, getPreAlertList, getPreAlertDetails,
    submitTurnOverToDeclarant, getTurnOverToDeclarantDetails
} from '../controllers/PreAlertController.js'

router.post('/submit/data', submitPreAlert)
router.post('/update/PreAlert', submitUpdatePreAlert)
router.get('/get/complete/list', getPreAlertComplete)
router.get('/get/list/:userKey', getPreAlertList)
router.get('/get/details/:refNum', getPreAlertDetails)
router.post('/submit/TurnOver/to/declarant', submitTurnOverToDeclarant)
router.get('/get/TurnOver/to/declarant/:refNum', getTurnOverToDeclarantDetails)

export { router as PreAlertRouter }