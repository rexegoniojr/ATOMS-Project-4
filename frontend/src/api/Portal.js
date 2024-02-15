import axios from 'axios'

/* GET */
export const getAvailablePortal = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`/Portal/get/available`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getPortalDetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Portal/get/details/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getPendingPortal = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Portal/get/list/${'Pending'}/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getCompletePortal = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Portal/get/list/${'Complete'}/${data}`)
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
export async function updatePortal(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Portal/update/details`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}