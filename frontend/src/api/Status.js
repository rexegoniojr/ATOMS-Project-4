import axios from 'axios'

/* GET */
export const getOnlineUserPermit = async () => {
    return new Promise((resolve, reject) => {
        axios.get('/status/online/user/permit')
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getOnlineUserPermitTransfer = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/status/online/user/transfer/permit/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getOnlineUserCDT = async () => {
    return new Promise((resolve, reject) => {
        axios.get('/status/online/user/cdt')
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getOnlineUserCDTTransfer = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/status/online/user/transfer/cdt/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getOnlineUserPeerChecker = async () => {
    return new Promise((resolve, reject) => {
        axios.get('/status/online/user/peerchecker')
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getOnlineUserPeerCheckerTransfer = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/status/online/user/transfer/peerchecker/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}