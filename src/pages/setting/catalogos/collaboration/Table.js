import React from 'react';
import dateFormat from 'dateformat'
import Button from '@material-ui/core/Button';
//Funciones

const TableCollaborators = ({ posts, loading,toggleModal }) => {
  if (loading) {
    return <h2>Cargando Datos...</h2>;
  }

  return (
    posts.map((post, i) => (
      <tr key={i}>
        <td>{post.name}</td>
        <td>{post.store_asigned}</td>
        <td>{post.status}</td>
        <td>{dateFormat(post.timestamp, 'dd/mm/yyyy')}</td>
        <td>
          <Button variant="contained" color="primary" onClick={() => toggleModal(
            post._id,
            post.name,
            post.store_asigned,
            post.status
          )}>Editar</Button>&nbsp;
        </td>
      </tr>
    ))
  );
};

export default TableCollaborators;