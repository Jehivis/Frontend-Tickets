import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader';
import {
    storeTicketPhotoRetrats,
    getPhotoRetreats,
    inactivatePhotoRetreats,
    completePhotoRetreats
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
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from 'mdbreact';
import Button from '@material-ui/core/Button';
import { FaCheck, FaTimes, FaStoreAlt } from 'react-icons/fa'
import Select from 'react-select';
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

const TicketsPhotoRetreats = () => {
    const my_store = localStorage.getItem("store");
    const my_email = localStorage.getItem("email");
    const history = useHistory();
    const [fields, setFields] = useState([{ upc: null, alu: null, size: null, caurier: null, store_created: my_store, email: my_email }]);
    const [photoRetreats, setphotoRetreats] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    let caurierList = [
        { value: 'Lourdes(Mensajeros)', label: 'Lourdes(Mensajeros)' },
        { value: 'Ricardo Herrera', label: 'Ricardo Herrera' },
        { value: 'Alberto Herrera', label: 'Alberto Herrera' },
        { value: 'Romeo Chávez', label: 'Romeo Chávez' },
    ];

    useEffect(() => {
        get_photo_retreats();
    }, []);

    function get_photo_retreats() {
        getPhotoRetreats().then((res) => setphotoRetreats(res));
    }

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }
    //created input
    function handleChange(i, event, name) {
        const values = [...fields];
        if (name === "caurier") {
            values[i][name] = event.value;
        } else if (event.target.value.length === 0) {
            values[i][name] = null;
        } else {
            values[i][name] = event.target.value;
        }
        setFields(values);
    }

    function crearTicket() {
        let cont = 0;
        fields.some(function (x, i) {
            if (x.upc === null) {
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
                storeTicketPhotoRetrats(fields)
                    .then(response => {
                        result_function('success', response.data.message);
                        setTimeout(() => {
                            history.go(0);
                        }, 2000);
                    })
                    .catch(error => {
                        result_function('error', "Error al crear el ticket");
                    })
            }
        }
    }

    function removeTicket(id) {
        inactivatePhotoRetreats(id).then(response => {
            get_photo_retreats();
            result_function('success', response.data.message);
        })
            .catch(error => {
                result_function('error', 'Error al eliminar el ticket');
            })
    }

    function completarTicket(id) {
        completePhotoRetreats(id).then(response => {
            get_photo_retreats();
            result_function('success', response.data.message);
        })
            .catch(error => {
                result_function('error', 'Error al completar el ticket');
            })
    }

    function handleAdd() {
        const values = [...fields];
        if (fields.length <= 10) {
            values.push({ upc: null, alu: null, talla: null, factura: null });
            setFields(values);
        } else {
            result_function('warning', 'Alcanzaste el número maximo de alementos')
        }
    }

    function handleRemove(i) {
        if (i !== 0) {
            const values = [...fields];
            values.splice(i, 1);
            setFields(values);
        }
    }

    const value2 = { value: 'Quién lo retira', label: 'Quién lo retira' };
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = photoRetreats.slice(indexOfFirstPost, indexOfLastPost);
    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <Layaout>
            <br></br>
            <CardHeader title='RETIRO FOTOGRAFÍA' icon="ticket-alt">
                {fields.map((field, idx) => {
                    return (
                        <MDBRow id={idx} className="center-element" key={`${field}-${idx}`}>
                            <MDBCol md='2'>
                                <MDBInput label='UPC' type='text' validate onChange={e => handleChange(idx, e, "upc")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='ALU' type='text' validate onChange={e => handleChange(idx, e, "alu")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Talla' type='text' validate onChange={e => handleChange(idx, e, "size")} />
                            </MDBCol>
                            {idx === 0 && (
                                <MDBCol md='3'>
                                    <label>Persona que lo retira</label>
                                    <Select
                                        onChange={e => handleChange(idx, e, "caurier")}
                                        defaultValue={value2}
                                        options={caurierList}
                                    />
                                </MDBCol>
                            )}
                            {idx !== 0 && (
                                <MDBCol md='1' style={{ paddingLeft: "0px", paddingTop: "20px" }}>
                                    <MDBBtn size="sm" color='danger' onClick={() => handleRemove(idx)}>X</MDBBtn>
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
                        photoRetreats.length > 0 ? (
                            currentPosts.map((data) => {
                                if (data.store_created === my_store) {
                                    let orden = 0;
                                    return (
                                        <MDBCol key={data._id} md="6" style={{ marginBottom: "15px" }}>
                                            <MDBCard>
                                                <MDBCardBody style={{ Height: "300px" }}>
                                                    <MDBCardTitle><span><FaStoreAlt /> {data.store_asigned}</span>
                                                        <MDBBtn className="float-right" size="sm" color='danger' onClick={() => removeTicket(data._id)}><FaTimes style={{ fontSize: '15px' }} /></MDBBtn>
                                                        <MDBBtn className="float-right" size="sm" color='dark-green' onClick={() => completarTicket(data._id)}><FaCheck style={{ fontSize: '15px' }} /></MDBBtn>
                                                    </MDBCardTitle>
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
                            totalPosts={photoRetreats.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
            </MDBContainer>
        </Layaout>)
}

export default TicketsPhotoRetreats;