import express from 'express'
const router = express.Router()
import { getDeclarantTurnOverDetails, updateClientCDTApproval } from '../controllers/CDTApprovedController.js'

router.get('/get/declarant/TurnOver/:refNum', getDeclarantTurnOverDetails)
router.post('/update/client/Approval', updateClientCDTApproval)

export { router as CDTApprovedRouter }