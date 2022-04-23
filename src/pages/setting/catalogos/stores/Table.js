import React from 'react';
import dateFormat from 'dateformat'
import Button from '@material-ui/core/Button';

const TableStores = ({ posts, loading, toggleModal }) => {
  if (loading) {
    return <h2>Cargando Datos...</h2>;
  }

  return (
    posts.map((post, i) => (
      <tr key={i}>
        <td>{post.name}</td>
        <td>{post.sbs}</td>
        <td>{post.status}</td>
        <td>{dateFormat(post.timestamp, 'dd/mm/yyyy')}</td>
        <td>
        <Button variant="contained" color="primary" onClick={() => toggleModal(
          post._id,
          post.name,
          post.sbs,
          post.status
        )}>Editar</Button>&nbsp;
        </td>
       </tr>
    ))
  );
};

export default TableStores;