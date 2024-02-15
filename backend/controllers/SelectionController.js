import { ConsigneeList, TypeOfPermitList } from "../models/SelectionModel.js";
import crypto from 'crypto'

/* CONSIGNEE */
export const addConsignee = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    const { consigneeName, userKey } = req.body

    await ConsigneeList.findOne({ consigneeName: consigneeName })
        .then((data) => {
            if (data === null) {

                let generateRefNum = crypto.randomBytes(22).toString('hex');
                const newConsignee = new ConsigneeList({
                    consigneeName: consigneeName,
                    userKey: userKey,
                    dateInput: month + '-' + date + '-' + year,
                    refNum: generateRefNum
                })
                newConsignee.save()
                res.json({
                    title: 'Consignee name Added',
                    message: 'You can select the new consignee name now.',
                    status: 'success'
                });
            }
            else {
                res.json({
                    title: 'Consignee Name Exist',
                    message: 'Consignee name is already in the selection.',
                    status: 'info'
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

export const getConsigneeNames = async (req, res) => {
    await ConsigneeList.find({})
        .sort({ consigneeName: 1 })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
        })
}


/* PERMIT */
export const addPermit = async (req, res) => {

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    const { typeOfPermit, userKey } = req.body

    await TypeOfPermitList.findOne({ typeOfPermit: typeOfPermit })
        .then((data) => {
            if (data === null) {

                let generateRefNum = crypto.randomBytes(22).toString('hex');
                const newTypeOfPermitList = new TypeOfPermitList({
                    typeOfPermit: typeOfPermit,
                    userKey: userKey,
                    dateInput: month + '-' + date + '-' + year,
                    refNum: generateRefNum
                })
                newTypeOfPermitList.save()
                res.json({
                    title: 'Permit type Added',
                    message: 'You can select the new permit type now.',
                    status: 'success'
                });
            }
            else {
                res.json({
                    title: 'Permit type Exist',
                    message: 'Permit type is already in the selection.',
                    status: 'info'
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

export const getPermit = async (req, res) => {
    await TypeOfPermitList.find({})
        .sort({ typeOfPermit: 1 })
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
        })
}