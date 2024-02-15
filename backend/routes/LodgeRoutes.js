import express from 'express'
const router = express.Router()
import {
    getLodgeList, getLodgeDetails, updateLodge, getSAD, submitSAD
} from '../controllers/LodgeController.js'

router.get('/get/list/:userKey', getLodgeList)
router.get('/get/details/:refNum', getLodgeDetails)
router.post('/update/details', updateLodge)
router.get('/get/sad/details/:refNum', getSAD)
router.post('/submit/sad/details', submitSAD)

export { router as LodgeRouter }