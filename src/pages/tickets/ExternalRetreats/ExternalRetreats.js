import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader';
import {
    storeTicketExternalRetrats,
    inactivateExternalRetreats,
    getExternalRetreats
} from '../../../functions/ticketFunction';
import Pagination from '../../../components/pagination';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBIcon,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from 'mdbreact';
import Button from '@material-ui/core/Button';
import { FaTimes, FaCheckDouble, FaPersonBooth } from 'react-icons/fa'
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const ExternalRetreats = () => {
    const my_store = localStorage.getItem("store");
    const my_email = localStorage.getItem("email");
    const history = useHistory();
    const [fields, setFields] = useState([{ person_retreats: null, person_authorizing: null, bill: null, upc: null, alu: null, size: null, store_created: my_store,email: my_email }]);
    const [externalRetreats, setExternalRetreats] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }

    useEffect(() => {
        get_external_retreats();
    }, []);

    function get_external_retreats() {
        getExternalRetreats().then((res) => setExternalRetreats(res));
    }

    /* CREAT UN NUEVO TICKET */
    function crearTicket() {
        let cont = 0;
        fields.some(function (x, i) {
            if (x.person_retreats === null) {
                result_function('error', 'Ingresa el nombre de la persona que retirara el producto');
                cont++;
                return true;
            } else if (x.person_authorizing === null) {
                result_function('error', 'Ingresa el nombre de la persona que autoriza el retiro');
                cont++;
                return true;
            } else if (x.bill === null) {
                result_function('error', 'Ingresa un número de FACTURA');
                cont++;
                return true;
            } else if (x.upc === null) {
                result_function('error', 'El valor de UPC está vacío');
                cont++;
                return true;
            } else if (x.alu === null) {
                result_function('error', 'El valor de ALU está vacío');
                cont++;
                return true;
            } else if (x.size === null) {
                result_function('error', 'Debes ingresar la TALLA');
                cont++;
                return true;
            }else{
                return false;
            }
        })

        if (fields[0]["store_asigned"] === null) {
            result_function('error', 'Debes seleccionar alguna tienda');
        } else {
            if (cont === 0) {
                storeTicketExternalRetrats(fields)
                    .then(response => {
                        result_function('success', response.data.message)
                        setTimeout(() => {
                            history.go(0);
                        }, 2000);
                    })
                    .catch(error => {
                        result_function('error', 'Algo salió mal')
                    })
            }
        }
    }
    /* INACTIVA UN TICKET */
    function removeTicket(id) {
        inactivateExternalRetreats(id)
            .then(response => {
                get_external_retreats();
                result_function('success', response.data.message)
            })
            .catch(error => {
                result_function('error', 'Error al eliminar el ticket')
            })
    }
    /* OBTIENE LOS VALORES DE LOS INPUTS */
    function handleChange(i, event, name, type) {
        const values = [...fields];
        if (name === "store_asigned") {
            values[i][name] = event.value;
        } else if (event.target.value.length === 0) {

            values[i][name] = null;
        } else {
            values[i][name] = event.target.value;
            setFields(values);
        }
    }
    /* GENERA LOS NUEVOS INPUTS */
    function handleAdd() {
        const values = [...fields];
        if (fields.length <= 10) {
            values.push({ upc: null, alu: null, size: null });
            setFields(values);
        } else {
            result_function('warning', 'Alcanzaste el número maximo de alementos')
        }
    }
    /* ELIMINAR UNA FILA DE INPUTS */
    function handleRemove(i) {
        if (i !== 0) {
            const values = [...fields];
            values.splice(i, 1);
            setFields(values);
        }
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = externalRetreats.slice(indexOfFirstPost, indexOfLastPost);
    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <Layaout>
            <br></br>
            <CardHeader title='RETIROS EXTERNOS'>
                <MDBRow className="center-element">
                    <MDBCol md='4'>
                        <MDBInput
                            label='Persona que retira'
                            type='text'
                            validate
                            onChange={e => handleChange(0, e, "person_retreats", "text")}
                        />
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBInput
                            label='Persona que autoriza'
                            type='text'
                            validate
                            onChange={e => handleChange(0, e, "person_authorizing")}
                        />
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBInput
                            label='Factura'
                            type='text'
                            validate
                            onChange={e => handleChange(0, e, "bill")}
                        />
                    </MDBCol>
                </MDBRow>
                {fields.map((field, idx) => {
                    return (
                        <MDBRow id={idx} className="center-element" key={`${field}-${idx}`}>
                            <MDBCol md='3'>
                                <MDBInput
                                    label='UPC'
                                    type='text'
                                    validate onChange={e => handleChange(idx, e, "upc")}
                                />
                            </MDBCol>
                            <MDBCol md='3'>
                                <MDBInput
                                    label='ALU'
                                    type='text'
                                    validate onChange={e => handleChange(idx, e, "alu")}
                                />
                            </MDBCol>
                            <MDBCol md='3'>
                                <MDBInput
                                    label='Talla'
                                    type='text'
                                    validate onChange={e => handleChange(idx, e, "size")}
                                />
                            </MDBCol>
                            {idx !== 0 && (
                                <MDBCol md='1' style={{ paddingLeft: "0px", paddingTop: "20px" }}>
                                    <MDBBtn
                                        size="sm"
                                        color='danger'
                                        onClick={() => handleRemove(idx)
                                        }>X</MDBBtn>
                                </MDBCol>)}
                        </MDBRow>
                    )
                })}
                <MDBRow className="center-element">
                    <Button variant="outlined" color='primary' onClick={(e) => handleAdd(e)}><span><MDBIcon icon="plus" /> Agregar</span></Button>
                    <Button variant="outlined" style={{color: "#4caf50", marginLeft: "10px"}} onClick={(e) => crearTicket(e)}><span><MDBIcon icon='ticket-alt' />  Crear Ticket</span></Button>
                </MDBRow>
            </CardHeader>
            <br></br>
            <MDBContainer>
                <MDBRow>
                    {
                        externalRetreats.length > 0 ? (
                            currentPosts.map((data) => {

                                if (data.store_created === my_store) {
                                    let orden = 0;
                                    return (
                                        <MDBCol key={data._id} md="6" style={{ marginBottom: "15px" }}>
                                            <MDBCard>
                                                <MDBCardBody style={{ Height: "300px" }}>
                                                    <MDBCardTitle>
                                                        <span style={{ fontSize: "18px" }}><FaPersonBooth /> {data.name}  </span>
                                                        <span style={{ marginLeft: "10px", fontSize: "18px" }}><FaCheckDouble /> {data.manager}</span>
                                                        <MDBBtn className="float-right" size="sm" color='danger' onClick={() => removeTicket(data._id)}><FaTimes style={{ fontSize: '15px' }} /></MDBBtn>
                                                    </MDBCardTitle>
                                                    <MDBCardText>
                                                        <MDBTable small>
                                                            <MDBTableHead>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>UPC</th>
                                                                    <th>ALU</th>
                                                                    <th>TALLA</th>
                                                                </tr>
                                                            </MDBTableHead>
                                                            <MDBTableBody>
                                                                {
                                                                    data.product.map((prod) => {
                                                                        orden++;
                                                                        return (
                                                                            <tr key={prod._id}>
                                                                                <td>{orden}</td>
                                                                                <td>{prod.upc}</td>
                                                                                <td>{prod.alu}</td>
                                                                                <td>{prod.siz || prod.size}</td>
                                                                                <td>{data.fact}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </MDBTableBody>
                                                        </MDBTable>
                                                    </MDBCardText>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    )
                                }else{ return '' }
                            })
                        )
                            :
                            <MDBCol md='12'>
                                <MDBCard color='grey' text='white' className='text-center'>
                                    <MDBCardBody>
                                        NO HAY DATOS
                                        </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                    }
                </MDBRow>
                <MDBRow className="center-element">
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={externalRetreats.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
            </MDBContainer>
        </Layaout>
    )
}

export default ExternalRetreats;