import axios from 'axios'

/* GET */
export async function getPreAlertCompleteList() {
    return new Promise((resolve, reject) => {
        axios.get(`/pre_alert/get/complete/list`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}


export async function getPreAlertList(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/pre_alert/get/list/${data}`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function getPreAlertDetails(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/pre_alert/get/details/${data}`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function getTurnOverToDeclarantDetails(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/pre_alert/get/TurnOver/to/declarant/${data}`)
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
export async function addPreAlert(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/pre_alert/submit/data`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function updatePreAlert(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/pre_alert/update/PreAlert`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function turnOverToDeclarant(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/pre_alert/submit/TurnOver/to/declarant`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}