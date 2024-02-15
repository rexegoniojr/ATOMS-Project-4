import crypto from 'crypto'
import { PreAlertList } from '../models/PreAlertModel.js';
import { FundRequestList } from '../models/FundRequest.js';

export const getAvailableFundRequest = async (req, res) => {
    try {
        const fund = await FundRequestList.find({ frStatus: 'Available' })
            .sort({ requestDate: -1, requestTime: -1 })
        const prealert = await PreAlertList.find({})

        let dataHolder = []
        fund?.map((x) => {
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


export const getFundRequestList = async (req, res) => {
    try {
        const fund = await FundRequestList.find({ userKey: req.params.userKey })
            .sort({ requestDate: -1, requestTime: -1 })
        const prealert = await PreAlertList.find({})

        let dataHolder = []
        fund?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum && x.frStatus === req.params.selected) {
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

export const getFundRequestDetails = async (req, res) => {
    await FundRequestList.find({ refNum: req.params.refNum })
        .sort({ requestDate: -1, requestTime: -1 })
        .then((data) => {
            res.send(data)
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

export const submitRequest = async (req, res) => {
    let generateFRKey = crypto.randomBytes(22).toString('hex');
    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    const { frNote, refNum } = req.body

    const frDetails = {

        frNote: frNote,
        requestDate: month + '-' + date + '-' + year,
        requestTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        sortMonth: month,
        sortDay: date,
        sortYear: year,
        sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
        frKey: generateFRKey,
        refNum: refNum,
    }
    const submitFundRequest = new FundRequestList(frDetails)
    submitFundRequest.save()
        .then(() => {
            res.json({
                title: 'Fund Request submit successfully',
                message: 'You may request another fund or proceed to other task.',
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

export const submitCancellationRequest = async (req, res) => {

    await FundRequestList.findOne({ frKey: req.params.frKey })
        .then((data) => {
            data.frStatus = 'Cancelled'
            data.save()
            res.json({
                title: 'Fund Request cancelled successfully',
                message: 'You may request another fund or proceed to other task.',
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

export const submitAcceptRequest = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    const { frKey, ActionOwner, userKey } = req.body
    await FundRequestList.findOne({ frKey: frKey })
        .then((data) => {
            data.frStatus = 'Pending'
            data.sortMonth = month
            data.sortDay = date
            data.sortYear = year
            data.sortTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)
            data.ActionOwner = ActionOwner
            data.userKey = userKey
            data.save()
            res.json({
                title: 'Fund Request accecpt successfully',
                message: 'You may proceed to other task.',
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

export const submitUpdate = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    const { frKey, receivedDate, receivedTime, Remarks } = req.body
    await FundRequestList.findOne({ frKey: frKey })
        .then((data) => {
            let stat = ''
            if (!receivedDate) { stat = 'Pending' }
            else { stat = 'Complete' }
            data.sortMonth = month
            data.sortDay = date
            data.sortYear = year
            data.sortTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)
            data.receivedDate = receivedDate
            data.receivedTime = receivedTime
            data.Remarks = Remarks
            data.frStatus = stat
            data.save()
            res.json({
                title: 'Fund Request update successfully',
                message: 'You may proceed to other task.',
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