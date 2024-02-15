import crypto from 'crypto'
import { AssignedPeerCheckerList } from '../models/PeerCheckerModel.js'
import { PreAlertList } from '../models/PreAlertModel.js';

export const getPeerCheckerAssignedList = async (req, res) => {
    try {
        const { userKey } = req.params
        const peerchecker = await AssignedPeerCheckerList.find({ userPCKey: userKey })
            .sort({ dateAssigned: -1, timeAssigned: -1 })
        const prealert = await PreAlertList.find({})

        let dataHolder = []
        peerchecker?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum) {
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

export const getPeerCheckerDetails = async (req, res) => {
    await AssignedPeerCheckerList.find({ refNum: req.params.refNum })
        .then((data) => {
            if (data.length !== 0) {
                res.json({
                    PeerCheckerActionOwner: data[0].PeerCheckerActionOwner,
                    dateAssigned: data[0].dateAssigned,
                    timeAssigned: data[0].timeAssigned,
                    dateComplete: data[0].dateComplete,
                    timeComplete: data[0].timeComplete,
                    pcStatus: data[0].pcStatus,
                    Remarks: data[0].Remarks,
                    assignedBy: data[0].assignedBy,
                    assigneeKey: data[0].assigneeKey,
                    userPCKey: data[0].userPCKey,
                    peerCheckerKey: data[0].peerCheckerKey,
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

export const assignPeerChecker = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let generatePCKey = crypto.randomBytes(22).toString('hex');

    const { PeerCheckerActionOwner, assignedBy, assigneeKey, userPCKey, refNum } = req.body
    const dataHolder = {
        PeerCheckerActionOwner: PeerCheckerActionOwner,
        dateAssigned: month + '-' + date + '-' + year,
        timeAssigned: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        Remarks: '',
        assignedBy: assignedBy,
        assigneeKey: assigneeKey,
        userPCKey: userPCKey,
        peerCheckerKey: generatePCKey,
        refNum: refNum,
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
    }
    const submitDetails = new AssignedPeerCheckerList(dataHolder)
    submitDetails.save()
        .then(() => {
            res.json({
                title: 'Peer Checker assigned successfully',
                message: 'You may proceed to other task. Peer Check will notify you for updates.',
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

export const transferPeerChecker = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const { PeerCheckerActionOwner, assignedBy, assigneeKey, pcStatus, userPCKey, refNum } = req.body
    const dataHolder = {
        PeerCheckerActionOwner: PeerCheckerActionOwner,
        dateAssigned: month + '-' + date + '-' + year,
        timeAssigned: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        Remarks: '',
        pcStatus: pcStatus,
        assignedBy: assignedBy,
        assigneeKey: assigneeKey,
        userPCKey: userPCKey,
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
    }
    await AssignedPeerCheckerList.updateOne({ refNum: refNum }, dataHolder)
        .then(() => {
            res.json({
                title: 'Peer Checker transfer successfully',
                message: `The peer checker is transfered to ${PeerCheckerActionOwner}.`,
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

export const updatePeerChecker = async (req, res) => {

    const { dateComplete, timeComplete, Remarks, pcStatus, refNum } = req.body
    const dataHolder = {
        dateComplete: dateComplete,
        timeComplete: timeComplete,
        Remarks: Remarks,
        pcStatus: pcStatus,
    }
    await AssignedPeerCheckerList.updateOne({ refNum: refNum }, dataHolder)
        .then(() => {
            if (pcStatus === 'Complete') {
                res.json({
                    title: 'Peer Checker update successfully',
                    message: `You may procceed to other task.`,
                    status: 'success'
                });
            }
            else {
                res.json({
                    title: 'Peer Checker update successfully',
                    message: `Task is pending please complete the data to proceed to next process.`,
                    status: 'success'
                });
            }
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}