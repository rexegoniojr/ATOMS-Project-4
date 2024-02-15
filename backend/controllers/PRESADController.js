import { TurnOverPreSad, PRESADList } from '../models/PRESADModel.js';
import { DeclarantCDTTurnOverList } from '../models/CDTModel.js';
import { PreAlertList } from '../models/PreAlertModel.js';

export const submitTurnOverPreSad = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    const { ActionOwner, declarantUserKey, userKey, refNum } = req.body

    const toDetails = {
        ActionOwner: ActionOwner,
        dateOfTurnOver: month + '-' + date + '-' + year,
        timeOfTurnOver: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        declarantUserKey: declarantUserKey,
        userKey: userKey,
        refNum: refNum,
    }

    const submitDetails = new TurnOverPreSad(toDetails)
    submitDetails.save()
        .then(() => {
            res.json({
                title: 'Turn Over successfully',
                message: 'The data has been turn over to the Declarant for PRESAD.',
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

export const getTurnOverPRESADDetails = async (req, res) => {

    try {
        const { refNum } = req.params
        const cdt = await DeclarantCDTTurnOverList.find({ refNum: refNum })
        const presadTurnOver = await TurnOverPreSad.find({ refNum: refNum })

        let clientApprovalDate = ''
        let ActionOwner = ''
        let declarantUserKey = ''
        cdt?.map((x) => {
            clientApprovalDate = x.clientApprovalDate
            ActionOwner = x.ActionOwner
            declarantUserKey = x.userKey
        })

        let dateOfTurnOver = ''
        let timeOfTurnOver = ''
        presadTurnOver?.map((x) => {
            dateOfTurnOver = x.dateOfTurnOver
            timeOfTurnOver = x.timeOfTurnOver
        })

        return res.json({
            clientApprovalDate: clientApprovalDate,
            ActionOwner: ActionOwner,
            declarantUserKey: declarantUserKey,
            dateOfTurnOver: dateOfTurnOver,
            timeOfTurnOver: timeOfTurnOver
        })
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

export const getTurnOverPRESADList = async (req, res) => {

    try {
        const { userKey } = req.params
        const presad = await TurnOverPreSad.find({ declarantUserKey: userKey })
            .sort({ dateOfTurnOver: -1, timeOfTurnOver: -1 })
        const prealert = await PreAlertList.find({})

        let dataHolder = []
        presad?.map((x) => {
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

export const getPresadDetails = async (req, res) => {

    await PRESADList.find({ refNum: req.params.refNum })
        .then((data) => {
            res.json({
                ActionOwner: data[0].ActionOwner,
                PRESADDate: data[0].PRESADDate,
                PRESADTime: data[0].PRESADTime,
                userKey: data[0].userKey,
                refNum: data[0].refNum
            })
        })
        .catch((error) => {
            res.json({
                title: 'Please report this to the administrator',
                message: error.message,
                status: 'error'
            });
        })
}

export const submitPreSad = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const { ActionOwner, userKey, refNum } = req.body
    const dataHolder = {
        ActionOwner: ActionOwner,
        PRESADDate: month + '-' + date + '-' + year,
        PRESADTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        userKey: userKey,
        refNum: refNum,
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
    }
    const submitDetails = new PRESADList(dataHolder)
    submitDetails.save()
        .then(() => {
            res.json({
                title: 'PRESAD submit successfully',
                message: 'The data has been submitted, you may assign Peer Checker now.',
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