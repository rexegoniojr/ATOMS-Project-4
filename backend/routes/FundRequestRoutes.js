import express from 'express'
const router = express.Router()
import {
    getAvailableFundRequest, getFundRequestDetails, submitRequest,
    submitCancellationRequest, submitAcceptRequest, getFundRequestList,
    submitUpdate
} from '../controllers/FundRequestController.js'

router.get('/get/available', getAvailableFundRequest)
router.get('/get/list/:selected/:userKey', getFundRequestList)
router.get('/get/details/:refNum', getFundRequestDetails)
router.post('/submit/request', submitRequest)
router.post('/submit/cancellation/:frKey', submitCancellationRequest)
router.post('/accept/request', submitAcceptRequest)
router.post('/submit/update', submitUpdate)
//router.get('/get/sad/details/:refNum', getSAD)
//router.post('/submit/sad/details', submitSAD)

export { router as FundRequestRouter }