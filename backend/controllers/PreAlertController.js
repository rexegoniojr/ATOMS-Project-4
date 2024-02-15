import crypto from 'crypto'
import { PreAlertList, ShipmentSequence, PreAlertTurnOverList } from '../models/PreAlertModel.js'

export const submitPreAlert = async (req, res) => {

    const { typeOfShipment, typeOfDeclaration, nameOfCS, consigneeName, typeOfAccount, hbl_awbl,
        arrivalDate, numOfLineItems, dateOfReceipt, timeOfReceipt,
        proNum, oldPro, remarks, typeOfPermit, fileKey, userKey } = req.body

    try {
        const check_hbl = await PreAlertList.findOne({ hbl_awbl: hbl_awbl })
        const check_pro = await PreAlertList.findOne({ proNum: proNum })
        const check_old = await PreAlertList.findOne({ oldPro: oldPro })

        if (check_hbl) {
            return res.json({
                title: 'HBL/AWBL Exist',
                message: `HBL/AWBL is already exist in Sequence Number ${("000" + check_hbl.sos).slice(-3)}.`,
                status: 'info'
            });
        }

        if (check_pro) {
            return res.json({
                title: 'Pro Number Exist',
                message: `Pro Number is already exist in Sequence Number ${("000" + check_pro.sos).slice(-3)}.`,
                status: 'info'
            });
        }

        if (check_old) {
            return res.json({
                title: 'Old Pro Exist',
                message: `Old Pro is already exist in Sequence Number ${("000" + check_old.sos).slice(-3)}.`,
                status: 'info'
            });
        }
    }
    catch (error) {
        console.log(error)
        return res.json({
            title: 'Please report this to the administrator',
            message: error.message,
            status: 'error'
        });
    }

    await ShipmentSequence.findOneAndUpdate(
        { ssqData: 'autoval' },
        { '$inc': { 'ssqNumber': 1 } },
        { new: true })
        .then((data) => {
            let today = new Date()
            let date = ("0" + today.getDate()).slice(-2);
            let month = ("0" + (today.getMonth() + 1)).slice(-2);
            let year = today.getFullYear();
            let hours = today.getHours();
            let minutes = today.getMinutes();
            let getSeq;
            if (data === null) {
                const newSeq = new ShipmentSequence({ ssqData: 'autoval', ssqNumber: 1 })
                newSeq.save()
                getSeq = 1;
            }
            else {
                getSeq = data.ssqNumber
            }

            let generateRefNum = crypto.randomBytes(22).toString('hex');

            const ReportData = {
                sos: getSeq,
                typeOfShipment: typeOfShipment,
                typeOfDeclaration: typeOfDeclaration,
                nameOfCS: nameOfCS,
                consigneeName: consigneeName,
                typeOfAccount: typeOfAccount,
                hbl_awbl: hbl_awbl,
                arrivalDate: arrivalDate,
                dateOfReceipt: dateOfReceipt,
                timeOfReceipt: timeOfReceipt,
                numOfLineItems: numOfLineItems,
                proNum: proNum,
                oldPro: oldPro,
                remarks: remarks,
                typeOfPermit: typeOfPermit,
                fileKey: fileKey,
                refNum: generateRefNum,
                userKey: userKey,
                sortMonth: month,
                sortDay: date,
                sortYear: year,
                sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
            }

            const SubmitReport = new PreAlertList(ReportData)
            SubmitReport.save()

            res.json({
                title: 'Report added successfully',
                message: 'You can view the report and upload files for additional info.',
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

export const submitUpdatePreAlert = async (req, res) => {

    const { typeOfShipment, typeOfDeclaration, consigneeName, typeOfAccount, hbl_awbl,
        arrivalDate, numOfLineItems, dateOfReceipt, timeOfReceipt, proNum, oldPro, remarks,
        refNum } = req.body
    const dataContainer = {
        typeOfShipment: typeOfShipment,
        typeOfDeclaration: typeOfDeclaration,
        consigneeName: consigneeName,
        typeOfAccount: typeOfAccount,
        hbl_awbl: hbl_awbl,
        arrivalDate: arrivalDate,
        numOfLineItems: numOfLineItems,
        dateOfReceipt: dateOfReceipt,
        timeOfReceipt: timeOfReceipt,
        proNum: proNum,
        oldPro: oldPro,
        remarks: remarks,
    }

    await PreAlertList.updateOne({ refNum: refNum }, dataContainer)
        .then(() => {
            res.json({
                title: 'Update Successful',
                message: 'The Pre Alert is now updated.',
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

export const getPreAlertComplete = async (req, res) => {
    await PreAlertList.find({})
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

export const getPreAlertList = async (req, res) => {
    await PreAlertList.find({ userKey: req.params.userKey })
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

export const getPreAlertDetails = async (req, res) => {
    await PreAlertList.find({ refNum: req.params.refNum })
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

export const submitTurnOverToDeclarant = async (req, res) => {
    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    const { userKey, refNum } = req.body

    const toDetails = {
        dateOfTurnOver: month + '-' + date + '-' + year,
        timeOfTurnOver: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        userKey: userKey,
        refNum: refNum,
    }

    const submitDetails = new PreAlertTurnOverList(toDetails)
    submitDetails.save()
        .then(() => {
            res.json({
                title: 'Turn Over successfully',
                message: 'The data has been turn over to the declarant.',
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

export const getTurnOverToDeclarantDetails = async (req, res) => {
    await PreAlertTurnOverList.find({ refNum: req.params.refNum })
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