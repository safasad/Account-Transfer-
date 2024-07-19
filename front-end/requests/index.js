import axios from 'axios';
import { toast } from 'react-toastify'

export const Base_URL = "http://localhost:8000"

export const APICall = async (method, API, data) => {
    let res;
    return new Promise((resolve, reject) => {
        axios({
            baseURL: Base_URL,
            method,
            url: API,
            data: data || null,
            responseType: 'json',
            headers: {  }
        }).then(response => {
            res = response;
            resolve(response)
        }).catch(error => {
            toast.error(error.response?.data.message || error.message)
            reject(error)
        })
    })
}