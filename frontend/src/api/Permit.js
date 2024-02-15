import axios from 'axios'

/* GET */
export const getPreAlertWithPermit = async () => {
    return new Promise((resolve, reject) => {
        axios.get('/permit/get/pre_alert')
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getPermitDetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/permit/get/details/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getAssignedPermit = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/permit/get/assigned/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getAssignedPermitListToEmployee = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/permit/get/assigned/to/employee/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getAssignedPermitToEmployee = async (refNum, userPermitKey) => {
    return new Promise((resolve, reject) => {
        axios.get(`/permit/get/assigned/to/employee/list/${refNum}/${userPermitKey}`)
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
export async function assignPermit(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/permit/assign`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function transferPermit(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/permit/transfer`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function updatePermit(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/permit/update/permitDetails`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}
