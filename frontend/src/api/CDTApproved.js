import axios from 'axios'

/* GET */
export const getApprovedCDT = async (data) => {
    return new Promise((resolve, reject) => {
        axios.get(`/CDTApproved/get/declarant/TurnOver/${data}`)
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
export async function updateApprovedCDT(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/CDTApproved/update/client/Approval`, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}