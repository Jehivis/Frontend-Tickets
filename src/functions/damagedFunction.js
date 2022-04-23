import axios from 'axios'

const url = process.env.REACT_APP_URL_BASE;

/* Guarda un registro de mercaderia dañada */
export const storeDamagedMerchandise = (data) => {
    let formData = new FormData();
    formData.append('file',data[0].image);
    formData.append('data',JSON.stringify(data[0]));
    return axios
        .post(`${url}/damaged_merchandise/create`, formData,{
            headers:{
                'Content-type': 'multipart/form-data'
            }
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene todos los datos de mercadería dañada de una tienda*/
export const getDamagedMerchandise = () => {
    const data = {store : localStorage.getItem("store")}
    return axios
        .post(`${url}/damaged_merchandise`, data)
        .then((response) => {
            return response.data.damaged;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene los datos de mercadería dañada para el reporte*/
export const getDamagedMerchandiseReport = (date_start, date_end, store=false) => {
    let data = store !== null?(
        {store : store, role : localStorage.getItem("type")}
    ) : ({ role : localStorage.getItem("type")})
    return axios
        .post(`${url}/damaged_merchandise/report/${date_start}/${date_end}`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}