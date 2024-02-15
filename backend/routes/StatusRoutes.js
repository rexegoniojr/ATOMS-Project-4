import express from 'express'
const router = express.Router()
import {
    getOnlineUserPermit, getOnlineUserPermitTransfer,
    getOnlineUserCDT, getOnlineUserCDTTransfer,
    getOnlineUserPeerChecker, getOnlineUserPeerCheckerTransfer
} from '../controllers/StatusController.js'

router.get('/online/user/permit', getOnlineUserPermit)
router.get('/online/user/transfer/permit/:userKey', getOnlineUserPermitTransfer)
router.get('/online/user/cdt', getOnlineUserCDT)
router.get('/online/user/transfer/cdt/:userKey', getOnlineUserCDTTransfer)
router.get('/online/user/peerchecker', getOnlineUserPeerChecker)
router.get('/online/user/transfer/peerchecker/:userPCKey', getOnlineUserPeerCheckerTransfer)

export { router as StatusRouter }