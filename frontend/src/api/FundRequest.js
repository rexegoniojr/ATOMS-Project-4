import axios from 'axios'

/* GET */
export const getAvailableFundRequestList = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`/Fund_Request/get/available`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getFundRequestDetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Fund_Request/get/details/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getPendingFundRequest = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Fund_Request/get/list/${'Pending'}/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getCompleteFundRequest = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Fund_Request/get/list/${'Complete'}/${data}`)
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
export async function submitRequest(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Fund_Request/submit/request`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function submitCancellation(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Fund_Request/submit/cancellation/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function submitAcceptRequest(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Fund_Request/accept/request`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function submitUpdate(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Fund_Request/submit/update`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}