import React, { useState } from 'react';
import dateFormat from 'dateformat'
import CurrencyFormat from 'react-currency-format';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

const Tablebinnacle = ({ posts, loading }) => {

  const [toggle, setToggle] = useState(false);
  
  const history = useHistory();
  if (loading) {
    return <h2>Cargando Datos...</h2>;
  }

  const handleNext = (name) => {
    localStorage.setItem('collaborator', name);
    history.push('/retreats_bitacoras');
  };

  return (
    <>
    {posts.map((post, i) => (
      <tr key={i}>
        <td>{post.name}</td>
        <td><CurrencyFormat value={post.total_debt} displayType={'text'} prefix={'Q'} /></td>
        <td>{dateFormat(post.date_created, 'dd/mm/yyyy')}</td>
        <td>{dateFormat(post.update_created, 'dd/mm/yyyy')}</td>
        <td><Button variant="contained" color="primary" onClick={() => handleNext(post.name)}>editar</Button></td>
      </tr>
    ))
    }

    <MDBContainer>
      <MDBModal isOpen={toggle}>
        <MDBModalHeader>XX</MDBModalHeader>
        <MDBModalBody>(...)</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color='secondary' onClick={() => setToggle(false)}>
            Close
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
    </>
  );
};

export default Tablebinnacle;