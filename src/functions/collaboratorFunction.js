import axios from 'axios'

const url = process.env.REACT_APP_URL_BASE;

export const getCollaboration = (req,res) => {
    return axios
        .get(url + '/collaborator/get')
        .then((response) => {
            return response.data.collaborator;
        })
        .catch((error) => {
            console.log(error);
        })
}
