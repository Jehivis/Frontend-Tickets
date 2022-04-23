import React from 'react';
import dateFormat from 'dateformat';
import Button from '@material-ui/core/Button';
const Tablebinnacle = ({ posts, loading, toggleModal }) => {
  if (loading) {
    return <h2>Cargando Datos...</h2>;
  }

  return (
    posts.map((post, i) => (
      <tr key={i}>
        <td>{post.email}</td>
        <td>{post.template}</td>
        <td>{post.status}</td>
        <td>{dateFormat(post.date_at, 'dd/mm/yyyy')}</td>
        <td>{dateFormat(post.date_update, 'dd/mm/yyyy')}</td>
        <td>
          <Button variant="contained" color="primary" onClick={() => toggleModal(
            post._id,
            post.email,
            post.template,
            post.status,
            post.date_at,
            post.date_update
          )}>Editar</Button>
        </td>
      </tr>
    ))
  );
};

export default Tablebinnacle;