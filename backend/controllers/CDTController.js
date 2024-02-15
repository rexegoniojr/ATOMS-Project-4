import crypto from 'crypto'
import { CDTList, DeclarantCDTTurnOverList } from '../models/CDTModel.js'
import { PreAlertList, PreAlertTurnOverList } from '../models/PreAlertModel.js'

export const getForCDTList = async (req, res) => {
    try {
        const TOL = await PreAlertTurnOverList.find({}).sort({
            'dateOfTurnOver': -1,
            'timeOfTurnOver': -1
        })
        const PAL = await PreAlertList.find({})

        let data_container = []
        TOL?.map((x) => {
            PAL?.map((y) => {
                if (x.refNum === y.refNum) {
                    data_container.push(y)
                }
            })
        })

        return res.send(data_container)

    } catch (error) {
        console.log(error)
        res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error'
        });
    }
}

export const assignCDT = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const { DeclarantName, userKey, refNum, assignedBy, assigneeKey, CDTStatus, ReviseRemarks } = req.body
    let generateKey = crypto.randomBytes(22).toString('hex');
    let generateCDTKey = crypto.randomBytes(50).toString('hex');
    const CDTData = {
        DeclarantName: DeclarantName,
        DateAssigned: month + '-' + date + '-' + year,
        TimeAssigned: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        DateOfCDT: '',
        TimeOfCDT: '',
        Remarks: '',
        ReviseRemarks: ReviseRemarks,
        CDTStatus: CDTStatus,
        assignedBy: assignedBy,
        assigneeKey: assigneeKey,
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        declarantKey: generateKey,
        CDTKey: generateCDTKey,
        userKey: userKey,
        refNum: refNum,
    }

    const saveCDT = new CDTList(CDTData)
    saveCDT.save()
        .then(() => {
            if (CDTStatus === 'Transfered') {
                res.json({
                    title: 'For CDT Transfered submit successfully',
                    message: `For CDT Task is re-assinged to ${DeclarantName}.`,
                    status: 'success'
                });
            }
            else if (CDTStatus === 'Revision') {
                res.json({
                    title: 'For CDT Revision submit successfully',
                    message: `Your request for CDT Revision has been submitted.
                    The declarant will be notified for the revision request.`,
                    status: 'success'
                });
            }
            else {
                res.json({
                    title: 'For CDT assigned successfully',
                    message: 'You may assign new for CDT task.',
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

export const updateCDT = async (req, res) => {

    const { DateOfCDT, TimeOfCDT, CDTStatus, Remarks, CDTKey } = req.body
    const dataContainer = {
        DateOfCDT: DateOfCDT,
        TimeOfCDT: TimeOfCDT,
        CDTStatus: CDTStatus,
        Remarks: Remarks
    }
    await CDTList.updateOne({ CDTKey: CDTKey }, dataContainer)
        .then(() => {
            if (CDTStatus === 'Complete') {
                res.json({
                    title: 'CDT submitted successfully',
                    message: `CDT has been submitted please wait for the approval, 
                    you may proceed to other task.`,
                    status: 'success'
                });
            }
            else {
                res.json({
                    title: 'CDT updated successfully',
                    message: `You may procceed to other task.`,
                    status: 'success'
                });
            }
        })
        .catch((error) => {
            console.log(error)
            res.json({
                title: 'Please report this to the administrator',
                message: 'An Error was encountered during this process.',
                status: 'error'
            });
        })
}

export const getAssinedCDT = async (req, res) => {
    await CDTList.find({ refNum: req.params.refNum })
        .sort({ _id: -1 }).limit(1)
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
        })
}

export const getCDTAssignedList = async (req, res) => {

    try {
        const CDT = await CDTList.find({ userKey: req.params.userKey })
        const PAL = await PreAlertList.find({})

        let data_container = []
        CDT?.map((x) => {
            PAL?.map((y) => {
                if (x.refNum === y.refNum) {
                    data_container.push(y)
                }
            })
        })

        return res.send(data_container)

    } catch (error) {
        console.log(error)
        res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error'
        });
    }
}

export const submitTurnOverToCS = async (req, res) => {
    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const { ActionOwner, CDTKey, userKey, refNum } = req.body
    const dataContainer = {
        transferToCS: 1,
        CDTStatus: 'Approved'
    }
    await CDTList.updateOne({ CDTKey: CDTKey }, dataContainer)
        .then(() => {
            const turnOverData = {
                ActionOwner: ActionOwner,
                dateOfTurnOver: month + '-' + date + '-' + year,
                timeOfTurnOver: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
                sortMonth: month,
                sortDay: date,
                sortYear: year,
                sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
                CDTKey: CDTKey,
                userKey: userKey,
                refNum: refNum
            }

            const SubmitTurnOver = new DeclarantCDTTurnOverList(turnOverData)
            SubmitTurnOver.save()

            res.json({
                title: 'CDT Turn Over to CS successfully',
                message: 'You may proceed to other task.',
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

export const getAssignedCDTUser = async (req, res) => {
    await CDTList.aggregate([
        { $match: { userKey: req.params.userKey, } },
        {
            $lookup: {
                from: 'cslists',
                localField: 'refNum',
                foreignField: 'refNum',
                as: 'cslists'
            }
        }
    ])
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
        })
}
