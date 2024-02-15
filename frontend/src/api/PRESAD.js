import axios from 'axios'

/* GET */
export async function getPRESADList(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/PRESAD/get/turn_over/list/${data}`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function getPRESADDetails(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/PRESAD/get/turn_over/details/${data}`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function getPRESADData(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/PRESAD/get/details/${data}`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}

/* POST */
export async function submitTurnOverPreSad(data) {
    return new Promise((resolve, reject) => {
        axios.post(`PRESAD/submit/turnOver/to/declarant`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function submitPRESAD(data) {
    return new Promise((resolve, reject) => {
        axios.post(`PRESAD/submit/details`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}