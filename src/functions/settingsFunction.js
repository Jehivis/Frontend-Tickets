import axios from 'axios'

const url = process.env.REACT_APP_URL_BASE;

/*Muestra los datos de retiros*/
export const statesShow = (store) => {
    return axios
        .post(url + '/statusShow')
        .then((response) => {
            return response.data.showStatusInfo;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const statesCreate = (data) => {
    return axios
        .post(url + '/statusCreate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const statesUpdate = (data) => {
    return axios
        .post(url + '/statusUpdate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const statesDelete = (data) => {
    return axios
        .post(url + '/statusDelete', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

/* COLABORADORES */
/*Muestra los datos de retiros*/
export const CollaboratorShow = (store) => {
    return axios
        .post(url + '/collaboratorShow')
        .then((response) => {
            return response.data.showCollaboratorInfo;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const collaboratorCreate = (data) => {
    return axios
        .post(url + '/collaboratorCreate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const collaboratorUpdate = (data) => {
    return axios
        .put(url + '/collaboratorUpdate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

/* USUARIOS */
/*Muestra los datos de retiros*/
export const userShow = (store) => {
    return axios
        .post(url + '/userShow')
        .then((response) => {
            return response.data.showUserInfo;
        })
        .catch((error) => {
            console.log(error);
        })
};

/*Muestra los datos de retiros*/
export const userCreate = (data) => {
    return axios
        .post(url + '/userCreate', data)
        .then((response) => {
            return response.data.showUserInfo;
        }).catch((error) => {
            console.log(error);
        });
};

/*Muestra los datos de retiros*/
export const userUpdate = (data) => {
    return axios
        .post(url + '/userUpdate', data)
        .then((response) => {
            return response.data.showUserInfo;
        }).catch((error) => {
            console.log(error);
        });
};

/* SUBSIDIARIAS */

/*Muestra los datos de subsidiarias activas*/
export const getSubsidiariaActives = (store) => {
    return axios
        .get(url + '/subsidiarias_actives')
        .then((response) => {
            return response.data.subsidiarias;
        })
        .catch((error) => {
            console.log(error);
        })
};

/*Muestra los datos de subsidiarias*/
export const SubsidiariasShow = () => {
    return axios
        .post(url + '/subsidiariaShow')
        .then((response) => {
            return response.data.subsidiarias;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const subsidiariaCreate = (data) => {
    return axios
        .post(url + '/subsidiariaCreate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const subsidiariaUpdate = (data) => {
    return axios
        .put(url + '/subsidiariaUpdate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

/* TIENDAS */

export const getOneStore = (data) => {
    return axios
        .post(url + '/user/store', { store: data })
        .then((response) => {
            return response.data.result[0];
        })
        .catch((error) => {
            console.log(error);
        })
};

export const storeCreate = (data) => {
    return axios
        .post(url + '/storeCreate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const storeUpdate = (data) => {
    return axios
        .put(url + '/storeUpdate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

/*Muestra los datos de email plantillas*/
export const emailTemplateShow = () => {
    return axios
        .post(url + '/emailTemplateShow')
        .then((response) => {
            return response.data.showUserInfo;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const emailTemplateCreate = (data) => {
    return axios
        .post(url + '/emailTemplateCreate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const emailTemplateUpdate = (data) => {
    return axios
        .put(url + '/emailTemplateUpdate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

/*Muestra los datos de las plantillas asignadas a los emials*/
export const templateAsignedEmailShow = () => {
    return axios
        .post(url + '/templateAsignedEmaileShow')
        .then((response) => {
            return response.data.showTemplateAsignationEmail;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const templateAsignedEmailCreate = (data) => {
    return axios
        .post(url + '/templateAsignedEmailCreate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};

export const templateAsignedEmailUpdate = (data) => {
    return axios
        .put(url + '/templateAsignedEmailUpdate', data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
};