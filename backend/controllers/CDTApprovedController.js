import { DeclarantCDTTurnOverList } from '../models/CDTModel.js'

export const getDeclarantTurnOverDetails = async (req, res) => {
    await DeclarantCDTTurnOverList.find({ refNum: req.params.refNum })
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

export const updateClientCDTApproval = async (req, res) => {

    const { refNum, command } = req.body
    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const dataSent = {
        dateSentToClient: month + '-' + date + '-' + year,
        timeSentToClient: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
    }

    const dataApproval = {
        clientApprovalDate: month + '-' + date + '-' + year,
        clientApprovalTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
    }

    if (command === 'SENT TO CLIENT') {
        await DeclarantCDTTurnOverList.updateOne({ refNum: refNum }, dataSent)
            .then(() => {
                res.json({
                    title: 'Update Successful',
                    message: 'The date and time sent to client has been updated, Please wait for the approval of client. ',
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
    else {
        await DeclarantCDTTurnOverList.updateOne({ refNum: refNum }, dataApproval)
            .then(() => {
                res.json({
                    title: 'Update Successful',
                    message: 'CDT has been approved by client, you may proceed to other task.',
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
}