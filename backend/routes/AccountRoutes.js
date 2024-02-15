import express from 'express'
const router = express.Router()
import {
    Register, AccountDataList, AccountDetails, Login, Logout, VerifyAccount,
    UpdateAccountData, UpdateAccountPassword
} from '../controllers/AccountController.js'

router.post('/login', Login)
router.post('/logout/:userKey', Logout)
router.get('/verify', VerifyAccount)
router.post('/register', Register)
router.get('/list', AccountDataList)
router.get('/details/:userKey', AccountDetails)
router.post('/update/user/information', UpdateAccountData)
router.post('/update/user/password', UpdateAccountPassword)

export { router as AccountRouter }