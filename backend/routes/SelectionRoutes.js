import express from 'express'
const router = express.Router()
import { addConsignee, getConsigneeNames, addPermit, getPermit } from '../controllers/SelectionController.js'

/* Consignee */
router.post('/add/consignee', addConsignee)
router.get('/get/consignee_names', getConsigneeNames)

/* Permit */
router.post('/add/permit', addPermit)
router.get('/get/permits', getPermit)

export { router as SelectionRouter }