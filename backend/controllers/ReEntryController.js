import { LodgeList } from '../models/LodgeModel.js';
import { PreAlertList } from '../models/PreAlertModel.js';
import { ReEntryList } from '../models/ReEntry.js';

export const getAvailableREList = async (req, res) => {
    try {
        const lodge = await LodgeList.find({})
        const prealert = await PreAlertList.find({})
        const re = await ReEntryList.find({})

        let dataHolder = []
        lodge?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum && x?.LodgeDate !== '' && x?.LodgeTime !== '') {
                    if (re?.length === 0) {
                        dataHolder.push(y)
                    }
                    else {
                        re?.map((z) => {
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

export const getREList = async (req, res) => {
    try {
        const lodge = await LodgeList.find({})
        const prealert = await PreAlertList.find({})
        const re = await ReEntryList.find({ userKey: req.params.userKey })

        let dataHolder = []
        lodge?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum) {
                    re?.map((z) => {
                        if (y.refNum === z.refNum && z.reStatus === req.params.selected) {
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

export const getREDetails = async (req, res) => {
    await ReEntryList.find({ refNum: req.params.refNum })
        .then((data) => {
            if (data.length !== 0) {
                res.json({
                    ActionOwner: data[0].ActionOwner,
                    filedDate: data[0].filedDate,
                    filedTime: data[0].filedTime,
                    securedDate: data[0].securedDate,
                    securedTime: data[0].securedTime,
                    reStatus: data[0].reStatus,
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

export const updateRE = async (req, res) => {

    const { ActionOwner, filedDate, filedTime, securedDate,
        securedTime, reStatus, Remarks, userKey, refNum } = req.body

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    await ReEntryList.findOne({ refNum: refNum })
        .then((data) => {
            if (data === null) {
                const dataHolder = {
                    ActionOwner: ActionOwner,
                    filedDate: filedDate,
                    filedTime: filedTime,
                    securedDate: securedDate,
                    securedTime: securedTime,
                    reStatus: 'Pending',
                    Remarks: Remarks,
                    userKey: userKey,
                    sortMonth: month,
                    sortDay: date,
                    sortYear: year,
                    sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
                    refNum: refNum
                }
                const SubmitRE = new ReEntryList(dataHolder)
                SubmitRE.save()
            }
            else {
                if (!data.filedDate || !data.filedTime) {
                    data.filedDate = filedDate
                    data.filedTime = filedTime
                    data.reStatus = reStatus
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
                    data.reStatus = reStatus
                    data.Remarks = Remarks
                    data.sortMonth = month
                    data.sortDay = date
                    data.sortYear = year
                    data.sortTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)
                    data.save()
                }

            }

            res.json({
                title: 'Re Entry update successfully',
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