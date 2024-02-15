import crypto from 'crypto'
import { AssignedPeerCheckerList } from '../models/PeerCheckerModel.js'
import { PreAlertList } from '../models/PreAlertModel.js';
import { DOROList } from '../models/DORO.js'

export const getAvailableDOROList = async (req, res) => {
    try {
        const peerchecker = await AssignedPeerCheckerList.find({})
            .sort({ dateAssigned: -1, timeAssigned: -1 })
        const doro = await DOROList.find({})
        const prealert = await PreAlertList.find({})

        let dataHolder = []
        peerchecker?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum && x?.pcStatus === 'Complete') {
                    if (doro?.length === 0) {
                        dataHolder.push(y)
                    }
                    else {
                        doro?.map((z) => {
                            if (y.refNum !== z.refNum) {
                                dataHolder.push(y)
                            }
                        })
                    }
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

export const getDOROList = async (req, res) => {
    try {
        const peerchecker = await AssignedPeerCheckerList.find({})
            .sort({ dateAssigned: -1, timeAssigned: -1 })
        const doro = await DOROList.find({ userKey: req.params.userKey })
        const prealert = await PreAlertList.find({})

        let dataHolder = []
        peerchecker?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum) {
                    doro?.map((z) => {
                        if (y.refNum === z.refNum && z.drStatus === req.params.selected) {
                            dataHolder.push(y)
                        }
                    })
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

export const getDORODetails = async (req, res) => {
    await DOROList.find({ refNum: req.params.refNum })
        .then((data) => {
            if (data.length !== 0) {
                res.json({
                    ActionOwner: data[0].ActionOwner,
                    appliedDate: data[0].appliedDate,
                    appliedTime: data[0].appliedTime,
                    securedDate: data[0].securedDate,
                    securedTime: data[0].securedTime,
                    drStatus: data[0].drStatus,
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

export const updateDORO = async (req, res) => {

    const { ActionOwner, appliedDate, appliedTime, securedDate,
        securedTime, drStatus, Remarks, userKey, refNum } = req.body

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    await DOROList.findOne({ refNum: refNum })
        .then((data) => {
            if (data === null) {
                const dataHolder = {
                    ActionOwner: ActionOwner,
                    appliedDate: appliedDate,
                    appliedTime: appliedTime,
                    securedDate: securedDate,
                    securedTime: securedTime,
                    drStatus: 'Pending',
                    Remarks: Remarks,
                    userKey: userKey,
                    sortMonth: month,
                    sortDay: date,
                    sortYear: year,
                    sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
                    refNum: refNum
                }
                const SubmitDORO = new DOROList(dataHolder)
                SubmitDORO.save()
            }
            else {
                if (!data.appliedDate || !data.appliedTime) {
                    data.appliedDate = appliedDate
                    data.appliedTime = appliedTime
                    data.drStatus = drStatus
                    data.Remarks = Remarks
                    data.sortMonth = month
                    data.sortDay = date
                    data.sortYear = year
                    data.sortTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)
                    data.save()
                }
                else {
                    data.securedDate = securedDate
                    data.securedTime = securedTime
                    data.drStatus = drStatus
                    data.Remarks = Remarks
                    data.sortMonth = month
                    data.sortDay = date
                    data.sortYear = year
                    data.sortTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)
                    data.save()
                }

            }

            res.json({
                title: 'DO/RO update successfully',
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