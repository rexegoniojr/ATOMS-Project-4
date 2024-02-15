import axios from 'axios'

/* GET */
export const getAvailableRE = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`/RE/get/available`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getREDetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/RE/get/details/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getPendingRE= async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/RE/get/list/${'Pending'}/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getCompleteRE = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/RE/get/list/${'Complete'}/${data}`)
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
export async function updateRE(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/RE/update/details`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}
