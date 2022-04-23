import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {
    storeCertificate,
    getCertificates
} from '../../functions/certificateFunction';
import TableCertificates from './TableCertificates'
import Layaout from '../parcials/Layaout';
import CardHeader from '../../components/CardHeader';
import Pagination from '../../components/pagination';
import Button from '@material-ui/core/Button';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBIcon,
    MDBContainer,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
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

const NewCertificate = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [dataCertificates, setDataCertificates] = useState([]);

    const [fields, setFields] = useState([{
        no_cer: null,
        name_cer: null,
        val_cer: null,
        date_start_cer: null,
        date_end_cer: null,
        obs_cer: null,
        meatpack: null,
        sperry: null,
        quiksilver: null,
        guess: null,
        colehaan: null,
        diesel: null,
    }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }

    function crearCertificate() {
        let cont = 0;
        fields.some(function (x, i) {
            if (x.no_cer === null) {
                result_function('error', 'Ingresa el número de certificado');
                cont++;
                return true;
            } else if (x.name_cer === null) {
                result_function('error', 'Ingresa el nombre del certidicado');
                cont++;
                return true;
            } else if (x.val_cer === null) {
                result_function('error', 'Ingresa el valor del certificado');
                cont++;
                return true;
            } else if (x.date_start_cer === null) {
                result_function('error', 'Ingresa la fecha inicial del certificado');
                cont++;
                return true;
            } else if (x.date_end_cer === null) {
                result_function('error', 'Ingresa la fecha final del certificado');
                cont++;
                return true;
            } else {
                return false;
            }
        })

        if (fields[0]["meatpack"] === null &&
            fields[0]["sperry"] === null &&
            fields[0]["quiksilver"] === null &&
            fields[0]["guess"] === null &&
            fields[0]["colehaan"] === null &&
            fields[0]["diesel"] === null
        ) {
            result_function('error', 'Debes seleccionar alguna subsidiaria');
        } else {
            if (cont === 0) {
                storeCertificate(fields)
                    .then((response) => {
                        result_function('success', response.data.message);
                        setTimeout(() => {
                            history.go(0);
                        }, 3000);
                    }).catch(err => {
                        result_function('error', "Algo salio mal");
                    })
            }
        }
    }
    function handleChange(event, name) {
        const values = [...fields];
        if (event.target.value.length === 0) {
            values[0][name] = null;
        } else {
            values[0][name] = event.target.value;
        }
        setFields(values);
    }
    let array_null = [];
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataCertificates ? dataCertificates.slice(indexOfFirstPost, indexOfLastPost) : array_null.slice(indexOfFirstPost, indexOfLastPost);

    useEffect(() => {
        getCertificates().then((response) => {
            if (response.data) {
                setDataCertificates(response.data.certificados)
                setLoading(false)
            } else {
                result_function('error', 'No se puedo obtener una respuesta del servidor')
            }
        }).catch(err => console.log(err));
    }, [])

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Layaout>
            <br></br>
            <CardHeader title="NUEVO CERTIFICADO" icon="ticket-alt">
                <MDBRow className="center-element">
                    <MDBCol md='2'>
                        <MDBInput label='NO. CERTIFICADO' type='number' min="0" validate onChange={e => handleChange(e, "no_cer")} />
                    </MDBCol>
                    <MDBCol md='2'>
                        <MDBInput label='NOMBRE' type='text' validate onChange={e => handleChange(e, "name_cer")} />
                    </MDBCol>
                    <MDBCol md='2'>
                        <MDBInput label='VALOR' type='text' validate onChange={e => handleChange(e, "val_cer")} />
                    </MDBCol>
                    <MDBCol md='2'>
                        <MDBInput label='FECHA EMISIÓN' type='date' validate onChange={e => handleChange(e, "date_start_cer")} />
                    </MDBCol>
                    <MDBCol md='2'>
                        <MDBInput label='FECHA DE VANCIMIENTO' type='date' validate onChange={e => handleChange(e, "date_end_cer")} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className="center-element">
                    <MDBCol md='10'>
                        <MDBInput label='OBSERVACIONES' type="textarea" validate onChange={e => handleChange(e, "obs_cer")} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className="center-element">
                    <div className="row col-md-10">
                        <div className="col-md-12">
                            <label>Seleccione Subsidiarias</label>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Verificado"
                                        onChange={e => handleChange(e, "meatpack")}
                                        data-enpassusermodified="yes"
                                        name="meatpack" /> Meat Pack
                                    <span className="form-check-sign">
                                        <span className="check"></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Verificado"
                                        onChange={e => handleChange(e, "sperry")}
                                        data-enpassusermodified="yes"
                                        name="sperry" />
                                    Sperry
                                    <span className="form-check-sign">
                                        <span className="check"></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Verificado"
                                        data-enpassusermodified="yes"
                                        onChange={e => handleChange(e, "quiksilver")}
                                        name="quiksilver" /> Quiksilver
                                    <span className="form-check-sign">
                                        <span className="check"></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Verificado"
                                        onChange={e => handleChange(e, "guess")}
                                        data-enpassusermodified="yes"
                                        name="guess" />
                                    Guess
                                    <span className="form-check-sign">
                                        <span className="check"></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Verificado"
                                        onChange={e => handleChange(e, "colehaan")}
                                        data-enpassusermodified="yes" name="colehaan" />
                                    Cole Haan
                                    <span className="form-check-sign">
                                        <span className="check"></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Verificado"
                                        onChange={e => handleChange(e, "diesel")}
                                        data-enpassusermodified="yes"
                                        name="diesel" />
                                    Diesel
                                    <span className="form-check-sign">
                                        <span className="check"></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </MDBRow>
                <br></br>
                <MDBRow className="center-element">
                    <Button variant="outlined" style={{ color: "#4caf50", marginLeft: "10px" }} onClick={() => crearCertificate()}><span><MDBIcon icon='ticket-alt' />  Crear Certificado</span></Button>
                </MDBRow>
            </CardHeader>
            <br></br>

            <MDBContainer>
                <MDBTable>
                    <MDBTableHead>
                        <tr>
                            <th>No. Certificado</th>
                            <th>Nombre</th>
                            <th>Valor</th>
                            <th>Fecha de Emisión</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Observaciones</th>
                            <th>Meatpack</th>
                            <th>Sperry</th>
                            <th>Quiksilver</th>
                            <th>Guess</th>
                            <th>Cole Haan</th>
                            <th>Diesel</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <TableCertificates posts={currentPosts} loading={loading} />
                    </MDBTableBody>
                </MDBTable>
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={dataCertificates !== undefined ? dataCertificates.length : 0}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </MDBContainer>
            <br></br>
        </Layaout>
    )
}

export default NewCertificate;