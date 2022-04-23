import axios from 'axios'

const url = process.env.REACT_APP_URL_BASE;

/* Crea un nuevo ticket para transferir a otra tienda */
export const storeCertificate = (data) => {
    return axios
        .post(`${url}/certificate/create`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene todos los certificados activos de una subsidiaria */
export const getCertificates = () => {
    let store = localStorage.getItem("store");
    return axios
        .post(`${url}/certificates/actives`, {store:store})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene todos los certificados de una subsidiaria */
export const getAllCertificates = (store) => {
    return axios
        .post(`${url}/certificates/exchange`, {store:store})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Función para  */
export const exchangeCertificate = (id,data) => {
    let store = localStorage.getItem("store");
    return axios
        .put(`${url}/certificate/exchange`, { id: id ,store:store, data: data})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene los datos de los certificados en un rango de fechas especificado*/
export const getDataReportCertificates = (date_start, date_end) => {
    return axios
        .post(`${url}/certificates/report/${date_start}/${date_end}`)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}