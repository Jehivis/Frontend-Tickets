import React, { useState } from 'react';
import dateFormat from 'dateformat'
import CurrencyFormat from 'react-currency-format';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

const Tablebinnacle = ({ posts, loading }) => {

  const [toggle, setToggle] = useState(false);

  return (
    <>
      {posts.map((post, i) => (
        <tr key={i}>
          <td>{post.name ? post.name : 'null'}</td>
          <td><CurrencyFormat value={post.price ? post.price : 0} displayType={'text'} prefix={'Q'} /></td>
          <td>{post.descount ? post.descount : 0}%</td>
          <td><CurrencyFormat value={post.price_f ? post.price_f : 0} displayType={'text'} prefix={'Q'} /></td>
          <td>{dateFormat(post.date_created, 'dd/mm/yyyy')}</td>
          <td>{dateFormat(post.update_created, 'dd/mm/yyyy')}</td>
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