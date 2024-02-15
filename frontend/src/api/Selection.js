import axios from 'axios'

/* GET */
export async function getAllConsigneeName() {
    return new Promise((resolve, reject) => {
        axios.get(`/selection/get/consignee_names`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function getAllPermitTypes() {
    return new Promise((resolve, reject) => {
        axios.get(`/selection/get/permits`)
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
export async function addConsignee(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/selection/add/consignee`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function addPermitType(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/selection/add/permit`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}