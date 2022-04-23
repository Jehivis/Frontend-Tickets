import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader';
import { retreatShow, retreatCreated, retreatUpdate } from '../../../functions/retreatsFunction';
import Pagination from '../../../components/pagination';
import { getCollaboration } from '../../../functions/collaboratorFunction'
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
    MDBCardText
} from 'mdbreact';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NumericInput from 'react-numeric-input';
import Moment from 'react-moment';
import { FaStoreAlt, FaCheck, FaTimes, FaRegCalendar } from 'react-icons/fa'
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

const ImmediateDelivery = () => {
    const history = useHistory();
    const my_store = localStorage.getItem("store");
    const my_type = localStorage.getItem("type");
    const my_email = localStorage.getItem("email");
    const [dataRetreats, setDataRetreats] = useState([]);
    const [vendor, setVendor] = useState(null);
    const [fields, setFields] = useState([
        {
            colaborador: null,
            precio: null,
            descuento: null,
            precioFinal: null,
            descripcion: null,
            upc: null,
            alu: null,
            talla: null,
            image: null,
            store: my_store
        }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }

    function getRetreats() {
        retreatShow(my_store, my_type, my_email)
            .then((response) => {
                setDataRetreats(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function crearRetreats(e) {
        e.preventDefault();
        let cont = 0;

        if (vendor === null) {
            result_function('error', 'Debe seleccionar un colaborador');
        } else {
            if (fields[0]["precio"] === null) {
                result_function('error', 'ingresar un precio');
            } else if (fields[0]["descuento"] === null) {
                result_function('error', 'ingresar un descuento');
            } else if (fields[0]["descripcion"] === null) {
                result_function('error', 'ingresar una descripción');
            } else if (fields[0]["upc"] === null) {
                result_function('error', 'ingresar un upc');
            } else if (fields[0]["alu"] === null) {
                result_function('error', 'ingresar un alu');
            } else if (fields[0]["talla"] === null) {
                result_function('error', 'ingresar un talla');
            } else if (fields[0]["image"] === null) {
                result_function('error', 'ingresar una imagen');
            }
            else {
                if (cont === 0) {

                    //let timerInterval
                    Swal.fire({
                        title: 'Cargando!',
                        html: 'Estamos creando tu retiro, espera un momento',
                        timer: 10000,
                        timerProgressBar: true,
                        willOpen: () => {
                        },
                        willClose: () => {
                        }
                    })

                    let datasend = { ...fields[0], vendor: vendor };
                    retreatCreated(datasend)
                        .then(res => {
                            getRetreats();
                            Swal.fire(res.data[0].type, res.data[0].message, res.data[0].status);
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);

                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            }
        }
    }

    function updateRetreats(id, action) {
        retreatUpdate(id, action)
            .then(res => {
                getRetreats();
                Swal.fire(res.action, 'Retiro Actualizado', 'success');
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function handleChangeData(event, name, type) {
        const values = [...fields];
        if (type !== "number") {
            if (name === "colaborador") {
                values[0][name] = event.label;
            } else if (name === "image") {
                values[0][name] = event.target.files[0];
            } else if (event.target.value === "") {
                values[0][name] = null;
            } else {
                values[0][name] = event.target.value;
            }

            setFields(values);

        } else {
            if (event === null) {
                Swal.fire('Error', 'No puedes dejar el valor en blanco', 'info');
                values[0][name] = 0
            } else {
                values[0][name] = event
                changeValueCalcule();
            }
        }
    }

    useEffect(() => {
        function getRetreats() {
            retreatShow(my_store, my_type, my_email)
                .then((response) => {
                    setDataRetreats(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getRetreats();
    }, [my_email, my_store, my_type]);

    const changeValueCalcule = () => {
        const values = [...fields];
        let price = fields[0].precio !== null ? fields[0].precio : 1;
        let descount = fields[0].descuento !== null ? fields[0].descuento : 1;

        let totaldescount = (price * descount) / 100;

        let priceFinal = fields[0].descuento !== null ? price - totaldescount : price;

        values[0]["precioFinal"] = priceFinal;
        setFields(values);
    }

    const default_store = { value: '', label: 'Selecciona un colaborador' };
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataRetreats.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    let collaborator = [];
    getCollaboration().then((res) => { res.map(resdata => collaborator.push({ name: resdata.name, label: resdata.name })) });
    if (localStorage.getItem('session') !== "true") {
        history.push(`/`);
    }
    return (
        <Layaout>
            {
                localStorage.getItem('type') !== 'admin' ? (
                    <>
                        <br></br>
                        <CardHeader title="Retiros De Mercaderia" icon="ticket-alt">
                            <form>
                                <MDBRow className="center-element">
                                    <MDBCol md='3' >
                                        <label>Colaboradores</label>
                                        {collaborator ? (
                                            <Select
                                                onChange={e => setVendor(e.label)}
                                                defaultValue={default_store}
                                                options={collaborator}
                                            />
                                        ) : (
                                                <div className='spinner-border text-info' role='status'>
                                                    <span className='sr-only'>Loading...</span>
                                                </div>
                                            )}


                                    </MDBCol>
                                    <MDBCol md='3'>
                                        <Typography variant="body2">Precio</Typography>
                                        <NumericInput
                                            className="form-control"
                                            step={1}
                                            precision={2}
                                            size={2}
                                            min={0}
                                            max={100}
                                            mobile
                                            onChange={e => handleChangeData(e, "precio", "number")}
                                        />
                                    </MDBCol>
                                    <MDBCol md='3'>
                                        <Typography variant="body2">Descuento</Typography>
                                        <NumericInput
                                            className="form-control"
                                            step={1}
                                            precision={2}
                                            size={2}
                                            min={0}
                                            max={100}
                                            mobile
                                            onChange={e => handleChangeData(e, "descuento", "number")}
                                        />
                                    </MDBCol>
                                    <MDBCol md='3'>
                                        <Typography variant="body2">Precio Final</Typography>
                                        <NumericInput
                                            className="form-control"
                                            step={1}
                                            precision={2}
                                            size={2}
                                            mobile
                                            value={fields[0].precioFinal}
                                            onChange={e => handleChangeData(e, "precioFinal", "number")}
                                            readOnly
                                        />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol md='3'>
                                        <MDBInput label='UPC' type="text" validate onChange={e => handleChangeData(e, "upc")} />
                                    </MDBCol>
                                    <MDBCol md='3'>
                                        <MDBInput label='ALU' type="text" validate onChange={e => handleChangeData(e, "alu")} />
                                    </MDBCol>
                                    <MDBCol md='3'>
                                        <MDBInput label='TALLA' type="text" validate onChange={e => handleChangeData(e, "talla")} />
                                    </MDBCol>
                                    <MDBCol md='3'>
                                        <MDBInput type="file" accept="image/png, image/jpeg" validate onChange={e => handleChangeData(e, "image")} />
                                    </MDBCol>
                                    <MDBCol md='12'>
                                        <MDBInput
                                            type='textarea'
                                            rows='3'
                                            label='Descripción'
                                            onChange={e => handleChangeData(e, "descripcion")}
                                        />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className="center-element">
                                    <Button variant="outlined" style={{ color: "#4caf50", marginLeft: "10px" }} onClick={(e) => crearRetreats(e)}><span><MDBIcon icon='ticket-alt' />  Crear Retiro</span></Button>
                                </MDBRow>
                            </form>
                        </CardHeader>
                        <br></br>
                    </>
                ) :
                    <center><h1>Solicitud De Retiros</h1></center>
            }


            <MDBContainer>

                <MDBRow>
                    {
                        dataRetreats.length > 0 ? (
                            currentPosts.map((data) => {

                                return (
                                    <MDBCol key={data._id} md="6" style={{ marginBottom: "15px" }}>
                                        <MDBCard>
                                            <MDBCardBody style={{ Height: "300px" }}>
                                                <MDBCardTitle> <span><FaStoreAlt /> {data.store}</span>
                                                    {localStorage.getItem('type') === 'admin' ?
                                                        <>
                                                            <MDBBtn className="float-right" size="sm" color='dark-green' onClick={() => updateRetreats(data._id, "Aprobado")}><FaCheck style={{ fontSize: '15px' }} /></MDBBtn>
                                                            <MDBBtn className="float-right" size="sm" color='danger' onClick={() => updateRetreats(data._id, "Denegado")}><FaTimes style={{ fontSize: '15px' }} /></MDBBtn>
                                                        </>
                                                        :
                                                        <MDBBtn className="float-right" size="sm" color='warning' onClick={() => updateRetreats(data._id, "Cancelado")}><FaTimes style={{ fontSize: '15px' }} /></MDBBtn>
                                                    }
                                                </MDBCardTitle>
                                                <MDBCardText>
                                                    <b>Persona:</b> {data.name}
                                                    <br />
                                                    <b>Alu:</b> {data.alu}
                                                    <br />
                                                    <b>Upc:</b> {data.upc}
                                                    <br />
                                                    <b>Talla:</b> {data.size}
                                                    <br />
                                                    <b>Precio:</b> Q{data.price}
                                                    <br />
                                                    <b>Descuento:</b> {data.descount}%
                                                                <br />
                                                    <b>Precio Final:</b> Q{data.price_f}
                                                    <br />
                                                </MDBCardText>

                                                <span><FaRegCalendar />  <Moment format="DD/MM/YYYY">{data.date_created}</Moment></span>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                )
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
                        totalPosts={dataRetreats.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </MDBRow>
            </MDBContainer>
        </Layaout>
    )
}

export default ImmediateDelivery;