import axios from 'axios'

/* GET */
export const getPeerCheckerAssignedList = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/PeerChecker/get/assigned/list/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}


export const getPeerCheckerDetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/PeerChecker/get/details/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

/* POST */
export async function assignPeerChecker(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/PeerChecker/assign/user`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function transferPeerChecker(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/PeerChecker/update/assigned/user`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function updatePeerChecker(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/PeerChecker/update/details`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}