import axios from 'axios'

/* GET */
export const VerifyAccount = async () => {
    return new Promise((resolve, reject) => {
        axios.get('/account/verify')
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error })
                reject(error)
            })
    })
}

export async function getAccountList(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/account/list`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function getAccountDetails(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/account/details/${data}`)
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
export async function LoginAccount(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/account/login`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function LogoutAccount(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/account/logout/${data}`)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function RegisterAccount(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/account/register`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function updateUserInformation(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/account/update/user/information`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}

export async function updateUserPassword(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/account/update/user/password`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}