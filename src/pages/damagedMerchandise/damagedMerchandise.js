import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Layaout from '../parcials/Layaout';
import CardHeader from '../../components/CardHeader';
import {
    storeDamagedMerchandise,
    getDamagedMerchandise
} from '../../functions/damagedFunction';
import Pagination from '../../components/pagination';
import TableDamaged from './TableDamaged';
import Button from '@material-ui/core/Button';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBIcon,
    MDBContainer,
    MDBTable,
    MDBTableHead,
    MDBTableBody
} from 'mdbreact';
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

const DamagedMerchandise = () => {
    const my_store = localStorage.getItem("store");
    const my_email = localStorage.getItem("email");
    const history = useHistory();
    const [dataDamaged, setdataDamaged] = useState([]);
    const [fields, setFields] = useState([{ upc: null, alu: null, size: null, price: null, damaged: null, store_created: my_store, email: my_email }]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        damaged_merchandise();
    }, [])

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }

    function damaged_merchandise() {
        getDamagedMerchandise()
            .then(response => {
                setdataDamaged(response);
                setLoading(false);
            }).catch(error => {
                console.log(error)
            })
    }

    function store_damaged_merchandise() {
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
            } else if (x.price === null) {
                result_function('error', 'Ingresa el PRECIO del producto');
                cont++;
                return true;
            } else if (x.damaged === null) {
                result_function('error', 'Ingresa el daño de la mercadería');
                cont++;
                return true;
            } else {
                return false;
            }
        })
        if (cont === 0) {
            storeDamagedMerchandise(fields)
                .then(response => {
                    result_function('success', 'Registro almecenado exitosamente')
                    setTimeout(() => {
                        history.go(0);
                    }, 2000);
                }).catch(error => {
                    result_function('error', 'Algo salio mal')
                    console.log(error)
                })
        }
    }

    function handleChange(event, name) {
        const values = [...fields];
        if (event.target.value.length === 0) {
            values[0][name] = null;
        } else if (name === "image") {
            values[0][name] = event.target.files[0];
        } else {
            values[0][name] = event.target.value;
        }
        setFields(values);
    }

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataDamaged.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Layaout>
            <br></br>
            <CardHeader title="MERCADERIA DAÑADA" icon="ticket-alt">
                <MDBRow className="center-element">
                    <MDBCol md='3'>
                        <MDBInput label='UPC' type='text' value={fields[0].upc} validate onChange={e => handleChange(e, "upc")} />
                    </MDBCol>
                    <MDBCol md='3'>
                        <MDBInput label='ALU' type='text' value={fields[0].alu} validate onChange={e => handleChange(e, "alu")} />
                    </MDBCol>
                    <MDBCol md='3'>
                        <MDBInput label='Talla' type='text' value={fields[0].size} validate onChange={e => handleChange(e, "size")} />
                    </MDBCol>
                    <MDBCol md='3'>
                        <MDBInput label='Precio' type='text' value={fields[0].price} validate onChange={e => handleChange(e, "price")} />
                    </MDBCol>
                    <MDBCol md='8' style={{ marginTop: "26px" }}>
                        <MDBInput label='Daño de la prenda' type='text' value={fields[0].damaged} validate onChange={e => handleChange(e, "damaged")} />
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBInput type="file" accept="image/png, image/jpeg" validate onChange={e => handleChange(e, "image")} />
                    </MDBCol>

                </MDBRow>
                <MDBRow className="center-element">
                    <Button variant="outlined" style={{ color: "#4caf50" }} onClick={() => store_damaged_merchandise()}><span><MDBIcon icon='ticket-alt' />  Crear Registro</span></Button>
                </MDBRow>
            </CardHeader>
            <br></br>
            <MDBContainer>
                <MDBTable id="tableDamagedMerchandise">
                    <MDBTableHead>
                        <tr>
                            <th>DAÑO</th>
                            <th>UPC</th>
                            <th>ALU</th>
                            <th>TALLA</th>
                            <th>PRECIO</th>
                            <th>TIENDA</th>
                            <th>FECHA DE CREACIÓN</th>
                            <th>IMAGEN</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {
                            currentPosts.length > 0 ? (
                                <TableDamaged posts={currentPosts} loading={loading} />
                            ) : (
                                    <tr><td colSpan="12"><center>No hay datos</center></td></tr>
                                )
                        }
                    </MDBTableBody>
                </MDBTable>
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={dataDamaged.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </MDBContainer>
        </Layaout>
    )
}

export default DamagedMerchandise;