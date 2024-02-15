import axios from 'axios'

/* GET */
export const getLodgeList = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Lodge/get/list/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getLodgeDetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Lodge/get/details/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export const getSADDetails = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/Lodge/get/sad/details/${data}`)
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
export async function updateLodge(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Lodge/update/details`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function submitSad(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Lodge/submit/sad/details`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}