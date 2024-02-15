import axios from 'axios'

/* GET */
export async function getAllFiles(data) {
    return new Promise((resolve, reject) => {
        axios.get(`/Files/get/files/${data}`)
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
export async function fileUpload(data) {
    return new Promise((resolve, reject) => {
        axios.post(`/Files/upload`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
                reject(error)
            })
    })
}