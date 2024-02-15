import crypto from 'crypto'
import { AssignedPermitList } from '../models/PermitModel.js'
import { PreAlertList } from '../models/PreAlertModel.js'

export const assignPermit = async (req, res) => {
    let generatePermitKey = crypto.randomBytes(22).toString('hex');
    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const { permitActionOwner, typeOfPermit, submitDate, submitTime,
        assignedBy, assigneeKey, userPermitKey, refNum } = req.body

    const permitDetails = {
        permitActionOwner: permitActionOwner,
        typeOfPermit: typeOfPermit,
        dateOfAppPermit: '',
        dateSecPermit: '',
        permitRemarks: '',
        permitStatus: 'Assigned',
        submitDate: submitDate,
        submitTime: submitTime,
        assignedBy: assignedBy,
        assigneeKey: assigneeKey,
        userPermitKey: userPermitKey,
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        permitKey: generatePermitKey,
        refNum: refNum,
    }
    const submitAssignPermit = new AssignedPermitList(permitDetails)
    submitAssignPermit.save()
        .then(() => {
            res.json({
                title: 'Permit assigned successfully',
                message: 'You may assign new permit task.',
                status: 'success'
            });
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

export const transferPermit = async (req, res) => {
    const { permitActionOwner, submitDate, submitTime, assignedBy,
        assigneeKey, userPermitKey, permitKey } = req.body

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const dataContainer = {
        permitActionOwner: permitActionOwner,
        submitDate: submitDate,
        submitTime: submitTime,
        assigneeKey: assigneeKey,
        assignedBy: assignedBy,
        userPermitKey: userPermitKey,
        permitStatus: 'Transfered',
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
    }

    await AssignedPermitList.updateOne({ permitKey: permitKey }, dataContainer)
        .then(() => {
            res.json({
                title: 'Permit transfer successfully',
                message: `The permit is transfered to ${permitActionOwner}.`,
                status: 'success'
            });
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

export const getPreAlertWithPermit = async (req, res) => {
    await PreAlertList.find({ typeOfPermit: { $ne: 'W/O' } })
        .sort({ dateOfReceipt: -1, timeOfReceipt: -1 })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const getPermitDetails = async (req, res) => {
    await AssignedPermitList.find({ refNum: req.params.refNum })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const getAssignedPermit = async (req, res) => {
    await AssignedPermitList.find({ refNum: req.params.refNum })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const getAssignedPermitList = async (req, res) => {
    await AssignedPermitList.aggregate([
        { $match: { userPermitKey: req.params.userPermitKey } },
        {
            $lookup: {
                from: 'cslists',
                localField: 'refNum',
                foreignField: 'refNum',
                pipeline: [{
                    $match: { 'typeOfPermit': { $ne: 'W/O' } }
                }],
                as: 'cslists'
            }
        },
        { $sort: { 'submitDate': -1, 'submitTime': -1 } },
    ])
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const getAssignedPermitListToEmployee = async (req, res) => {
    try {
        const { userPermitKey } = req.params
        const assigned = await AssignedPermitList.find({ userPermitKey: userPermitKey })
        const prealert = await PreAlertList.find({})

        let data_list = []
        assigned?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum) {
                    data_list.push({
                        sos: y.sos,
                        typeOfShipment: y.typeOfShipment,
                        typeOfDeclaration: y.typeOfDeclaration,
                        nameOfCS: y.nameOfCS,
                        consigneeName: y.consigneeName,
                        typeOfAccount: y.typeOfAccount,
                        hbl_awbl: y.hbl_awbl,
                        arrivalDate: y.arrivalDate,
                        dateOfReceipt: y.dateOfReceipt,
                        timeOfReceipt: y.timeOfReceipt,
                        numOfLineItems: y.numOfLineItems,
                        proNum: y.proNum,
                        oldPro: y.oldPro,
                        remarks: y.remarks,
                        refNum: y.refNum
                    })
                }
            })
        })

        return res.send(data_list)
    }
    catch (error) {
        console.log(error)
        res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error',
            token: ''
        });
    }
}

export const getAssignedPermitToEmployee = async (req, res) => {
    const { refNum, userPermitKey } = req.params
    await AssignedPermitList.find({
        $and: [
            { userPermitKey: userPermitKey },
            { refNum: refNum }
        ]
    })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const updatePermit = async (req, res) => {
    const { dateOfAppPermit, dateSecPermit, permitRemarks, permitKey } = req.body
    await AssignedPermitList.findOne({ permitKey: permitKey })
        .then((data) => {
            let stat = ''
            if (data.dateOfAppPermit !== '' && data.dateSecPermit !== '') {
                stat = 'Complete'
            }
            else { stat = 'Pending' }
            data.permitStatus = stat
            data.dateOfAppPermit = dateOfAppPermit
            data.dateSecPermit = dateSecPermit
            data.permitRemarks = permitRemarks
            data.save()

            res.json({
                title: 'Permit update successfully',
                message: 'You may proceed to other permit task.',
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