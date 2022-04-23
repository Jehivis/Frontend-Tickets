import React from 'react';
import dateFormat from 'dateformat'
import CurrencyFormat from 'react-currency-format';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
//Funciones
import { deletebinacleEjection } from '../../../functions/salesFunctions'
const Tablebinnacle = ({ posts, loading }) => {
  const history = useHistory();
  if (loading) {
    return <h2>Cargando Datos...</h2>;
  }

  const handleNext = (id) => {

    Swal.fire({
      title: 'Está seguro de eliminar este bitacora?',
      text: 'Ya no lo podrá',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        deletebinacleEjection(id)
          .then((res) => {
            if (res.response) {
              Swal.fire(
                'Eliminado',
                'El dato fue eliminado',
                'success'
              )
              history.go(0)
            } else {
              Swal.fire(
                'Error',
                'No se pudo eliminar',
                'error'
              )
            }
          }
          )
          .catch(err =>
            console.log("error"))

      }
    })
  };

  return (
    posts.map((post, i) => (
      <tr key={i}>
        <td><CurrencyFormat value={post.daily_goal} displayType={'text'} prefix={'Q'} /></td>
        <td><CurrencyFormat value={post.year_before_sale} displayType={'text'} prefix={'Q'} /></td>
        <td>{post.vendor_number}</td>
        <td>{dateFormat(post.date_created, 'dd/mm/yyyy')}</td>
        {localStorage.getItem('change_date') === 'true' ? (<td><Button variant="contained" color="primary" onClick={() => handleNext(post._id)}>x</Button></td>) : ''}
      </tr>
    ))
  );
};

export default Tablebinnacle;