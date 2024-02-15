import axios from 'axios'

/* GET */
export const getAvailableDORO = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`/DORO/get/available`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getDORODetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/DORO/get/details/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getPendingDORO = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/DORO/get/list/${'Pending'}/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getCompleteDORO = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/DORO/get/list/${'Complete'}/${data}`)
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
export async function updateDORO(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/DORO/update/details`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}
