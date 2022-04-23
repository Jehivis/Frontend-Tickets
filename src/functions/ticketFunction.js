import axios from 'axios'

const url = process.env.REACT_APP_URL_BASE;

/* Crea un nuevo ticket para transferir a otra tienda */
export const storeTicketsSystemTransfer = (data) => {
    return axios
        .post(`${url}/tickets/add/transfer`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Crea un nuevo ticket de retiros inmediatos */
export const storeTicketInmediates = (data) => {
    let formData = new FormData();
    formData.append('file',data[0].image);
    formData.append('data',JSON.stringify(data));

    return axios
        .post(`${url}/tickets/add/inmediates`, formData,{
            headers:{
                'Content-type': 'multipart/form-data'
            }
        }).then(response=>{
            return response;
        }).catch(error=>{
            console.log(error);
        })
}

/* Crea un nuevo ticket de retiros fotografía */
export const storeTicketPhotoRetrats = (data) => {
    return axios
        .post(`${url}/tickets/add/photo_retreats`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Crea un nuevo ticket de retiros externos */
export const storeTicketExternalRetrats = (data) => {
    return axios
        .post(`${url}/tickets/add/external_retreats`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene todos los tikets de traslados entre tiendas (de la tienda registrada)*/
export const getAllTicketsSystemTransfer = (status) => {
    const data = {store : localStorage.getItem("store"), status: status}
    return axios
        .post(`${url}/tickets/transfer`, data)
        .then((response) => {
            return response.data.ticketSystem;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene la data de movimientos de tikets entre tiendas (de la tienda registrada)*/
export const getTicketsSystemTransferCreated = () => {
    const data = {store : localStorage.getItem("store"), subs: localStorage.getItem("subsidiaria")}
    return axios
        .post(`${url}/tickets/transfer_created`, data)
        .then((response) => {
            return response.data.ticketSystem;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene la data de movimientos de tikets entre tiendas (de la tienda registrada)*/
export const getTicketsSystemTransferAssigned = () => {
    const data = {store : localStorage.getItem("store"), subs: localStorage.getItem("subsidiaria")}
    return axios
        .post(`${url}/tickets/transfer_assigned`, data)
        .then((response) => {
            return response.data.ticketSystem;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene todos los tikets de entregas inemediatas de una tienda (de la tienda registrada)*/
export const getAllTicketsImmediatesDeliveries = (status) => {
    const data = {store : localStorage.getItem("store"), status: status}
    return axios
        .post(`${url}/tickets/immediate_deliveries`, data)
        .then((response) => {
            return response.data.ticketInmediates;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene la data de tickets de entregas inmediatas creados por el usuario */
export const getTicketsImmediatesDeliveriesCreated = () => {
    const data = {store : localStorage.getItem("store"), subs: localStorage.getItem("subsidiaria")}
    return axios
        .post(`${url}/tickets/immediate_deliveries_created`, data)
        .then((response) => {
            return response.data.ticketInmediates;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene la data de tickets de entregas inmediatas asignados al usuario*/
export const getTicketsImmediatesDeliveriesAssigned = () => {
    const data = {store : localStorage.getItem("store"), subs: localStorage.getItem("subsidiaria")}
    return axios
        .post(`${url}/tickets/immediate_deliveries_assigned`, data)
        .then((response) => {
            return response.data.ticketInmediates;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene toda la data de los tickets de retiros fotografía de una tienda */
export const getAllPhotoRetreats = (status) => {
    const data = {store : localStorage.getItem("store"), status:status}
    return axios
        .post(`${url}/tickets/all/photo_retreats`, data)
        .then((response) => {
            return response.data.ticketPhotoRetrats;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene la data de los tickets de retiros fotografía de una tienda */
export const getPhotoRetreats = () => {
    const data = {store : localStorage.getItem("store"), subs: localStorage.getItem("subsidiaria")}
    return axios
        .post(`${url}/tickets/photo_retreats`, data)
        .then((response) => {
            return response.data.ticketPhotoRetrats;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene toda la data de los tickets retiros externos de una tienda */
export const getAllExternalRetreats = (status) => {
    const data = {store : localStorage.getItem("store"), status: status}
    return axios
        .post(`${url}/tickets/all/external_retreats`, data)
        .then((response) => {
            return response.data.ticketExternal;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene la data de los tickets retiros externos */
export const getExternalRetreats = () => {
    const data = {store : localStorage.getItem("store"), subs: localStorage.getItem("subsidiaria")}
    return axios
        .post(`${url}/tickets/external_retreats`, data)
        .then((response) => {
            return response.data.ticketExternal;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene todas las tiendas */
export const getStore = () => {
    return axios
        .get(`${url}/tickets/stores`)
        .then((response) => {
            return response.data.result;
        })
        .catch((error) => {
            console.log(error);
        })
}

/* Obtiene todas las tiendas Activas */
export const getStoreActives = () => {
    return axios
        .get(`${url}/tickets/stores_actives`)
        .then((response) => {
            return response.data.result;
        })
        .catch((error) => {
            console.log(error);
        })
}

/* Inactiva un ticket de traslado de sistema*/
export const inactivateTicket = (id) =>{
    let email = localStorage.getItem("email")
    return axios
    .put(`${url}/ticket/inactive/${id}`, {email: email})
    .then((response) => {
        return response
    })
    .catch((error)=>{
        console.log(error)
    })
}

/* Inactiva un ticket de entregas inmeditas */
export const inactivateTicketInmediates = (id) =>{
    let email = localStorage.getItem("email")
    return axios
    .put(`${url}/ticket/immediate_deliveries/inactive/${id}`,{email: email})
    .then((response) => {
        return response
    })
    .catch((error)=>{
        console.log(error)
    })
}

/* Inactiva un ticket de fotos retiradas*/
export const inactivatePhotoRetreats = (id) =>{
    let email = localStorage.getItem("email")
    return axios
    .put(`${url}/ticket/photo_retreats/inactive/${id}`, {email: email})
    .then((response) => {
        return response
    })
    .catch((error)=>{
        console.log(error)
    })
}

/* Inactiva un ticket de retiros externos*/
export const inactivateExternalRetreats = (id) =>{
    return axios
    .put(`${url}/ticket/external_retreats/inactive/${id}`)
    .then((response) => {
        return response
    })
    .catch((error)=>{
        console.log(error)
    })
}

/* Cambia el estado de un ticket de traslado de sistema a 'Completado' */
export const completeTicket = (id,retailn) =>{
    let email = localStorage.getItem("email")
    return axios
    .put(`${url}/ticket/complete/${id}`, {retailn,email:email})
    .then((response) => {
        return response
    })
    .catch((error)=>{
        console.log(error)
    })
}

/* Cambia el estado de un ticket de entregas inmediatas a 'Completado' */
export const completeTicketInmediates = (id) =>{
    return axios
    .put(`${url}/ticket/immediate_deliveries/complete/${id}`)
    .then((response) => {
        return response
    })
    .catch((error)=>{
        console.log(error)
    })
}

/* Cambia el estado de un ticket de fotos retiradas a 'Completado' */
export const completePhotoRetreats = (id) =>{
    return axios
    .put(`${url}/ticket/photo_retreats/complete/${id}`)
    .then((response) => {
        return response
    })
    .catch((error)=>{
        console.log(error)
    })
}

/* Obtiene los datos de los tickets en un rango de fechas especificado*/
export const getDataReportTickets = (date_start, date_end, type, store=false) => {
    let data = store !== null?(
        {store : store, role : localStorage.getItem("type"), type: type}
    ) : ({ role : localStorage.getItem("type"), type: type})
    return axios
        .post(`${url}/tickets/report/${date_start}/${date_end}`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}