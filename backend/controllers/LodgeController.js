import crypto from 'crypto'
import { AssignedPeerCheckerList } from '../models/PeerCheckerModel.js'
import { SADSentToClientList } from '../models/LodgeModel.js';
import { PreAlertList } from '../models/PreAlertModel.js';
import { LodgeList } from '../models/LodgeModel.js';

export const getLodgeList = async (req, res) => {
    try {
        const { userKey } = req.params
        const peerchecker = await AssignedPeerCheckerList.find({ userPCKey: userKey })
            .sort({ dateAssigned: -1, timeAssigned: -1 })
        const prealert = await PreAlertList.find({})

        let dataHolder = []
        peerchecker?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum && x.dateComplete) {
                    dataHolder.push(y)
                }
            })
        })

        return res.send(dataHolder)
    }
    catch (error) {
        console.log(error)
        res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error'
        });
    }
}

export const getLodgeDetails = async (req, res) => {
    await LodgeList.find({ refNum: req.params.refNum })
        .then((data) => {
            if (data.length !== 0) {
                res.json({
                    ActionOwner: data[0].ActionOwner,
                    LodgeDate: data[0].LodgeDate,
                    LodgeTime: data[0].LodgeTime,
                    Remarks: data[0].Remarks,
                    userKey: data[0].userKey,
                    refNum: data[0].refNum,
                })
            }
            else {
                res.send([])
            }
        })
        .catch((error) => {
            console.log(error)
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const updateLodge = async (req, res) => {

    const { ActionOwner, LodgeDate, LodgeTime, Remarks, userKey, refNum } = req.body

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    await LodgeList.findOne({ refNum: refNum })
        .then((data) => {
            if (data === null) {
                const dataHolder = {
                    ActionOwner: ActionOwner,
                    LodgeDate: LodgeDate,
                    LodgeTime: LodgeTime,
                    Remarks: Remarks,
                    userKey: userKey,
                    sortMonth: month,
                    sortDay: date,
                    sortYear: year,
                    sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
                    refNum: refNum
                }
                const SubmitLodge = new LodgeList(dataHolder)
                SubmitLodge.save()
            }
            else {
                data.LodgeDate = LodgeDate
                data.LodgeTime = LodgeTime
                data.Remarks = Remarks
                data.sortMonth = month
                data.sortDay = date
                data.sortYear = year
                data.sortTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)
                data.save()
            }

            res.json({
                title: 'Lodgement update successfully',
                message: `You may procceed to other task.`,
                status: 'success'
            });
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const getSAD = async (req, res) => {
    await SADSentToClientList.find({ refNum: req.params.refNum })
        .then((data) => {
            if (data.length !== 0) {
                res.json({
                    ActionOwner: data[0].ActionOwner,
                    sentDate: data[0].sentDate,
                    sentTime: data[0].sentTime,
                    userKey: data[0].userKey,
                    refNum: data[0].refNum,
                })
            }
            else {
                res.send([])
            }
        })
        .catch((error) => {
            console.log(error)
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const submitSAD = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const { ActionOwner, userKey, refNum } = req.body
    const dataHolder = {
        ActionOwner: ActionOwner,
        sentDate: month + '-' + date + '-' + year,
        sentTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        userKey: userKey,
        refNum: refNum,
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
    }
    const submitDetails = new SADSentToClientList(dataHolder)
    submitDetails.save()
        .then(() => {
            res.json({
                title: 'SAD submit successfully',
                message: 'The SAD has been submitted to client, You may procceed to other task.',
                status: 'success'
            });
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}