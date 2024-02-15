import { SADSentToClientList } from '../models/LodgeModel.js';
import { PreAlertList } from '../models/PreAlertModel.js';
import { PortalList } from '../models/PortalModel.js'

export const getAvailablePortal = async (req, res) => {
    try {
        const sad = await SADSentToClientList.find({}).sort({ sentDate: -1, sentTime: -1 })
        const prealert = await PreAlertList.find({})
        const portal = await PortalList.find({})

        let dataHolder = []
        sad?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum && x.sentDate) {
                    if (portal?.length === 0) {
                        dataHolder.push(y)
                    }
                    else {
                        portal?.map((z) => {
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

export const getPortalList = async (req, res) => {
    try {
        const sad = await SADSentToClientList.find({}).sort({ sentDate: -1, sentTime: -1 })
        const prealert = await PreAlertList.find({})
        const portal = await PortalList.find({ userKey: req.params.userKey })

        let dataHolder = []
        sad?.map((x) => {
            prealert?.map((y) => {
                if (x.refNum === y.refNum && x.sentDate) {
                    portal?.map((z) => {
                        if (y.refNum === z.refNum && z.portalStatus === req.params.selected) {
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

export const getPortalDetails = async (req, res) => {
    await PortalList.find({ refNum: req.params.refNum })
        .then((data) => {
            if (data.length !== 0) {
                res.json({
                    ActionOwner: data[0].ActionOwner,
                    portalDate: data[0].portalDate,
                    portalTime: data[0].portalTime,
                    portalStatus: data[0].portalStatus,
                    ticketNo: data[0].ticketNo,
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

export const updatePortal = async (req, res) => {

    const { ActionOwner, ticketNo, portalDate, portalTime,
        portalStatus, Remarks, userKey, refNum } = req.body

    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    await PortalList.findOne({ refNum: refNum })
        .then((data) => {
            if (data === null) {
                const dataHolder = {
                    ActionOwner: ActionOwner,
                    ticketNo: ticketNo,
                    portalDate: portalDate,
                    portalTime: portalTime,
                    portalStatus: 'Pending',
                    Remarks: Remarks,
                    userKey: userKey,
                    sortMonth: month,
                    sortDay: date,
                    sortYear: year,
                    sortTime: ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2),
                    refNum: refNum
                }
                const SubmitLodge = new PortalList(dataHolder)
                SubmitLodge.save()
            }
            else {
                data.ticketNo = ticketNo
                data.portalDate = portalDate
                data.portalTime = portalTime
                data.portalStatus = portalStatus
                data.Remarks = Remarks
                data.sortMonth = month
                data.sortDay = date
                data.sortYear = year
                data.sortTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)
                data.save()
            }

            res.json({
                title: 'Portal update successfully',
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