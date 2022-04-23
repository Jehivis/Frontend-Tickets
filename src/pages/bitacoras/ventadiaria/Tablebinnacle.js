import React from 'react';
import dateFormat from 'dateformat'
import CurrencyFormat from 'react-currency-format';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { MDBIcon } from 'mdbreact'
//Funciones
import { deleteDataSales } from '../../../functions/salesFunctions'
const Tablebinnacle = ({ posts, loading }) => {
  const history = useHistory();
  if (loading) {
    return <h2>Cargando Datos...</h2>;
  }

  const handleNext = (id) => {

    Swal.fire({
      title: 'Está seguro de eliminar este dato de venta?',
      text: 'Ya no podrá recuperar este dato de venta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        deleteDataSales(id)
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
                'No se pudo eliminar el dato de venta',
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

  const sendUpdate = (id) => {
    localStorage.setItem("idBinnacleSale", id);
    history.push(`/bitacora_ventas_update`);
  }

  return (
    posts.map((post, i) => (
      <tr key={i}>
        <td><CurrencyFormat value={post.ventas} displayType={'text'} prefix={'Q'} /></td>
        <td><CurrencyFormat value={post.metas} displayType={'text'} prefix={'Q'} /></td>
        <td>{post.manager}</td>
        <td>{post.tienda}</td>
        <td>{dateFormat(post.fechaCreacion, 'dd/mm/yyyy')}</td>
        {localStorage.getItem('type') === 'admin' ? (
          <>
            <td><Button variant="contained" color="primary" onClick={() => sendUpdate(post.id)}><MDBIcon icon='edit' /></Button></td>
            <td><Button variant="contained" color="primary" onClick={() => handleNext(post.id)}><MDBIcon icon='calendar-times' /></Button></td>
          </>
        ) : ''}
      </tr>
    ))
  );
};

export default Tablebinnacle;