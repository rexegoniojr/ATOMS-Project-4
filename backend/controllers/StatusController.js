import { AccountList } from '../models/AccountModel.js'
import { CDTList } from '../models/CDTModel.js'
import { AssignedPeerCheckerList } from '../models/PeerCheckerModel.js'

export const getOnlineUserPermit = async (req, res) => {
    try {
        var acc_access_match = new RegExp(/^Permit/g)
        const accounts = await AccountList.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    acc_type: 1,
                    acc_access: 1,
                    status: 1,
                    userKey: 1
                }
            },
            {
                $match: {
                    status: 'Online',
                    acc_type: { $ne: 'ADMINISTRATOR' },
                    acc_access: { $regex: acc_access_match }
                }
            },
            {
                $lookup: {
                    from: 'assignedpermitlists',
                    localField: 'userKey',
                    foreignField: 'userPermitKey',
                    pipeline: [{
                        $match: {
                            $or: [
                                { permitStatus: 'Assigned' },
                                { permitStatus: 'Transfered' },
                                { permitStatus: 'Pending' }
                            ]
                        }
                    }],
                    as: 'permits'
                }
            }
        ])

        let count_account = []
        accounts?.map((x) => {
            count_account.push({
                label: `${x.firstName} ${x.lastName} (${x.permits.length})`,
                value: `${x.firstName} ${x.lastName}`,
                key: x.userKey,
                total: x.permits.length
            })
        })

        let final_data = []
        count_account?.map((x) => {
            let check = false

            if (x.total === Math.max(...count_account.map(x => x.total))) { check = true }
            if (Math.min(...count_account.map(x => x.total))
                === Math.max(...count_account.map(x => x.total))) { check = false }

            final_data.push({
                label: x.label,
                value: x.value,
                key: x.key,
                disabled: check
            })
        })

        return res.send(final_data)
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

export const getOnlineUserPermitTransfer = async (req, res) => {
    try {
        var acc_access_match = new RegExp(/^Permit/g)
        const accounts = await AccountList.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    acc_type: 1,
                    acc_access: 1,
                    status: 1,
                    userKey: 1
                }
            },
            {
                $match: {
                    status: 'Online',
                    acc_type: { $ne: 'ADMINISTRATOR' },
                    acc_access: { $regex: acc_access_match },
                    userKey: { $ne: req.params.userKey }
                }
            },
            {
                $lookup: {
                    from: 'assignedpermitlists',
                    localField: 'userKey',
                    foreignField: 'userPermitKey',
                    pipeline: [{
                        $match: {
                            $or: [
                                { permitStatus: 'Assigned' },
                                { permitStatus: 'Transfered' },
                                { permitStatus: 'Pending' }
                            ]
                        }
                    }],
                    as: 'permits'
                }
            }
        ])

        let count_account = []
        accounts?.map((x) => {
            count_account.push({
                label: `${x.firstName} ${x.lastName} (${x.permits.length})`,
                value: `${x.firstName} ${x.lastName}`,
                key: x.userKey,
                total: x.permits.length
            })
        })

        let final_data = []
        count_account?.map((x) => {
            let check = false

            if (x.total === Math.max(...count_account.map(x => x.total))) { check = true }
            if (Math.min(...count_account.map(x => x.total))
                === Math.max(...count_account.map(x => x.total))) { check = false }

            final_data.push({
                label: x.label,
                value: x.value,
                key: x.key,
                disabled: check
            })
        })
        return res.send(final_data)
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

export const getOnlineUserCDT = async (req, res) => {
    try {
        var acc_access_match = new RegExp(/^CDT/g)
        const accounts = await AccountList.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    acc_type: 1,
                    acc_access: 1,
                    status: 1,
                    userKey: 1
                }
            },
            {
                $match: {
                    status: 'Online',
                    acc_type: { $ne: 'ADMINISTRATOR' },
                    acc_access: { $regex: acc_access_match }
                }
            },
        ])

        const cdt = await CDTList.aggregate([
            {
                $group: {
                    _id: '$refNum',
                    data: { '$last': '$$ROOT' }
                },
            },
        ])

        let count_account = []
        accounts?.map((x) => {
            let count = 0
            cdt?.map((y) => {
                if (x.userKey === y.data.userKey) {
                    if (y.data.CDTStatus !== 'Completed' ||
                        y.data.CDTStatus !== 'Approved') {
                        count++
                    }
                }
            })
            count_account.push({
                label: `${x.firstName} ${x.lastName} (${count})`,
                value: `${x.firstName} ${x.lastName}`,
                key: x.userKey,
                total: count
            })
        })

        let final_data = []
        count_account?.map((x) => {
            let check = false

            if (x.total === Math.max(...count_account.map(x => x.total))) { check = true }
            if (Math.min(...count_account.map(x => x.total))
                === Math.max(...count_account.map(x => x.total))) { check = false }

            final_data.push({
                label: x.label,
                value: x.value,
                key: x.key,
                disabled: check
            })
        })
        return res.send(final_data)
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

export const getOnlineUserCDTTransfer = async (req, res) => {
    try {
        var acc_access_match = new RegExp(/^CDT/g)
        const accounts = await AccountList.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    acc_type: 1,
                    acc_access: 1,
                    status: 1,
                    userKey: 1
                }
            },
            {
                $match: {
                    status: 'Online',
                    acc_type: { $ne: 'ADMINISTRATOR' },
                    acc_access: { $regex: acc_access_match },
                    userKey: { $ne: req.params.userKey }
                }
            }
        ])

        const cdt = await CDTList.aggregate([
            {
                $group: {
                    _id: '$refNum',
                    data: { '$last': '$$ROOT' }
                },
            },
        ])

        let count_account = []
        accounts?.map((x) => {
            let count = 0
            cdt?.map((y) => {
                if (x.userKey === y.data.userKey) {
                    if (y.data.CDTStatus !== 'Completed' ||
                        y.data.CDTStatus !== 'Approved') {
                        count++
                    }
                }
            })
            count_account.push({
                label: `${x.firstName} ${x.lastName} (${count})`,
                value: `${x.firstName} ${x.lastName}`,
                key: x.userKey,
                total: count
            })
        })

        let final_data = []
        count_account?.map((x) => {

            let check = false
            if (x.total === Math.max(...count_account.map(x => x.total))) { check = true }
            if (Math.min(...count_account.map(x => x.total))
                === Math.max(...count_account.map(x => x.total))) { check = false }

            final_data.push({
                label: x.label,
                value: x.value,
                key: x.key,
                disabled: check
            })
        })

        return res.send(final_data)
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

export const getOnlineUserPeerChecker = async (req, res) => {
    try {
        var acc_access_match = new RegExp(/Peer Checker/g)
        const accounts = await AccountList.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    acc_type: 1,
                    acc_access: 1,
                    status: 1,
                    userKey: 1
                }
            },
            {
                $match: {
                    status: 'Online',
                    acc_type: { $ne: 'ADMINISTRATOR' },
                    acc_access: { $regex: acc_access_match }
                }
            },
        ])

        const peerchecker = await AssignedPeerCheckerList.find({})

        let count_account = []
        accounts?.map((x) => {
            let count = 0
            peerchecker?.map((y) => {
                if (x.userKey === y.userPCKey &&
                    y.pcStatus === 'Assigned' ||
                    y.pcStatus === 'Transfered' ||
                    y.pcStatus === 'Pending') {
                    count++
                }
            })
            count_account.push({
                label: `${x.firstName} ${x.lastName} (${count})`,
                value: `${x.firstName} ${x.lastName}`,
                key: x.userKey,
            })
        })
        return res.send(count_account)
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

export const getOnlineUserPeerCheckerTransfer = async (req, res) => {
    try {
        var acc_access_match = new RegExp(/Peer Checker/g)
        const accounts = await AccountList.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    acc_type: 1,
                    acc_access: 1,
                    status: 1,
                    userKey: 1
                }
            },
            {
                $match: {
                    status: 'Online',
                    acc_type: { $ne: 'ADMINISTRATOR' },
                    acc_access: { $regex: acc_access_match },
                    userKey: { $ne: req.params.userPCKey }
                }
            }
        ])

        const peerchecker = await AssignedPeerCheckerList.find({})

        let count_account = []
        accounts?.map((x) => {
            let count = 0
            peerchecker?.map((y) => {
                if (x.userKey === y.userPCKey &&
                    y.pcStatus === 'Assigned' ||
                    y.pcStatus === 'Transfered' ||
                    y.pcStatus === 'Pending') {
                    count++
                }
            })
            count_account.push({
                label: `${x.firstName} ${x.lastName} (${count})`,
                value: `${x.firstName} ${x.lastName}`,
                key: x.userKey,
            })
        })

        return res.send(count_account)
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