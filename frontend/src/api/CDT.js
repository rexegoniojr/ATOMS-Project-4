import axios from 'axios'

/* GET */
export const getForCDTList = async () => {
    return new Promise((resolve, reject) => {
        axios.get('/CDT/get/ForCDTList')
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getAssignedUserCDT = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/CDT/get/assigned/user/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getCDTAssignedList = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/CDT/get/assigned/CDT/List/${data}`)
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
export async function submitCDT(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/CDT/assign/user`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function updateCDT(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/CDT/update/assigned/cdt`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function submitTurnOverToCS(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/CDT/turn_over/to/cs`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

