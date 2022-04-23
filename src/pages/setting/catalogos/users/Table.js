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
        <td>{post.name}</td>
        <td>{post.type}</td>
        <td>{post.change_date === "true"? "Activo" : "Inactivo"}</td>
        <td>{post.store}</td>
        <td>{post.status}</td>
        <td>{dateFormat(post.timestamp, 'dd/mm/yyyy')}</td>
        <td>
        <Button variant="contained" color="primary" onClick={() => toggleModal(
          post.email,
          post.name,
          {value: post.type, label: post.type},
          post.change_date,
          {value: post.store, label: post.store},
          {value: post.status, label: post.status},
          post._id,
          post.password
        )}>Editar</Button>
        </td>
       </tr>
    ))
  );
};

export default Tablebinnacle;