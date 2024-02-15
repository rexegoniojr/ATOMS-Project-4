import express from 'express'
const router = express.Router()
import {
    assignPermit, transferPermit, updatePermit, getPreAlertWithPermit, getPermitDetails, getAssignedPermit,
    getAssignedPermitListToEmployee, getAssignedPermitToEmployee
} from '../controllers/PermitController.js'

router.post('/assign', assignPermit)
router.post('/transfer', transferPermit)
router.get('/get/pre_alert', getPreAlertWithPermit)
router.get('/get/details/:refNum', getPermitDetails)
router.post('/update/permitDetails', updatePermit)
router.get('/get/assigned/:refNum', getAssignedPermit)
router.get('/get/assigned/to/employee/:userPermitKey', getAssignedPermitListToEmployee)
router.get('/get/assigned/to/employee/list/:refNum/:userPermitKey', getAssignedPermitToEmployee)

export { router as PermitRouter }