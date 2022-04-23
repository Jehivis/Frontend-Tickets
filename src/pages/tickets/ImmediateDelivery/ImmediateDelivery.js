import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader';
import {
    storeTicketInmediates,
    getTicketsImmediatesDeliveriesCreated,
    getTicketsImmediatesDeliveriesAssigned,
    completeTicketInmediates,
    inactivateTicketInmediates,
    getStoreActives,
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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const ImmediateDelivery = () => {
    const my_store = localStorage.getItem("store");
    const my_email = localStorage.getItem("email");
    const my_subs = localStorage.getItem("subsidiaria");
    const history = useHistory();
    const [value, setValue] = useState(0);
    const [dataStores, setdataStores] = useState([]);
    const [dataTicketsImmediatesCreated, setdataTicketsImmeditaesCreated] = useState([]);
    const [dataTicketsImmediatesAssigned, setdataTicketsImmeditaesAssigned] = useState([]);
    const [fields, setFields] = useState([
        {
            store_asigned: null,
            store_created: my_store,
            encargado: 'lourdes@corpinto.com',
            client: null,
            bill: null,
            address: null,
            phone1: null,
            phone2: null,
            hours: null,
            total: null,
            image: null,
            upc: null,
            alu: null,
            size: null,
            email: my_email,
        }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    useEffect(() => {
        function stores() {
            let storesList = [];
            getStoreActives().then((resp) =>
                resp.map(x => {
                    if (x.sbs === my_subs) {
                        storesList.push({ value: x.name, label: x.name })
                        return setdataStores(storesList);
                    }
                    return null;
                })
            );
        }

        function getTicketsCreated() {
            getTicketsImmediatesDeliveriesCreated()
                .then((response) => {
                    setdataTicketsImmeditaesCreated(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        function getTicketsAssigned() {
            getTicketsImmediatesDeliveriesAssigned()
                .then((response) => {
                    setdataTicketsImmeditaesAssigned(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        stores();
        getTicketsAssigned();
        getTicketsCreated();
    }, [my_subs]);

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }



    function getTicketsCreated() {
        getTicketsImmediatesDeliveriesCreated()
            .then((response) => {
                setdataTicketsImmeditaesCreated(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getTicketsAssigned() {
        getTicketsImmediatesDeliveriesAssigned()
            .then((response) => {
                setdataTicketsImmeditaesAssigned(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function crearTicket(e) {
        e.preventDefault();
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
            } else {
                return false;
            }
        })

        if (fields[0]["store_asigned"] === null) {
            result_function('error', 'Debes seleccionar alguna tienda');
        } else if (fields[0]["client"] === null) {
            result_function('error', 'Debes ingresar el nombre del cliente');
        } else if (fields[0]["bill"] === null) {
            result_function('error', 'El número de la factura está vacío');
        } else if (fields[0]["address"] === null) {
            result_function('error', 'Debes ingresar la dirección destino');
        } else if (fields[0]["phone1"] === null) {
            result_function('error', 'Ingresa un número de telefono');
        } else if (fields[0]["phone2"] === null) {
            result_function('error', 'Ingresa un número de telefono');
        } else if (fields[0]["hours"] === null) {
            result_function('error', 'Debes ingresar el horario');
        } else if (fields[0]["total"] === null) {
            result_function('error', 'Ingresa el total de la venta');
        } else if (fields[0]["image"] === null) {
            result_function('error', 'Selecciona una imagen');
        } else {
            if (cont === 0) {
                storeTicketInmediates(fields)
                    .then((response) => {
                        result_function('success', response.data.message);
                        setTimeout(() => {
                            history.go(0);
                        }, 2000);
                    }).catch(err => {
                        result_function('error', 'Error al crear el ticket');
                    })
            }
        }
    }

    function completeTicket(id) {
        completeTicketInmediates(id)
            .then(response => {
                getTicketsCreated();
                getTicketsAssigned();
                result_function('success', response.data.message);
            })
            .catch(error => {
                result_function('error', 'No se pudo completar el ticket');
            })
    }

    function removeTicket(id) {
        inactivateTicketInmediates(id)
            .then(response => {
                getTicketsCreated();
                getTicketsAssigned();
                result_function('success', response.data.message);
            })
            .catch(error => {
                result_function('error', 'No se pudo eliminar el ticket');
            })
    }

    function handleChange1(event, name) {
        const values = [...fields];
        if (name === "store_asigned") {
            values[0][name] = event.value;
        } else if (name === "image") {
            values[0][name] = event.target.files[0];
        } else {
            values[0][name] = event.target.value;
        }
        setFields(values);
    }


    function handleChange2(i, event, name) {
        const values = [...fields];
        if (event.target.value.length === 0) {
            values[i][name] = null;
        } else {
            values[i][name] = event.target.value;
        }
        setFields(values);
    }

    /* Crea los nuevs inputs */
    function handleAdd(e) {
        e.preventDefault();
        const values = [...fields];
        if (fields.length <= 10) {
            values.push({ upc: null, alu: null, size: null });
            setFields(values);
        } else {
            result_function('warning', 'Alcanzaste el número maximo de alementos')
        }
    }

    /* Eliminar inputs */
    function handleRemove(i) {
        if (i !== 0) {
            const values = [...fields];
            values.splice(i, 1);
            setFields(values);
        }
    }

    const handleChange3 = (event, newValue) => {
        setValue(newValue);
    };

    const default_store = { value: 'Selecciona una tienda', label: 'Selecciona una tienda' };
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataTicketsImmediatesCreated.slice(indexOfFirstPost, indexOfLastPost);
    const currentPosts2 = dataTicketsImmediatesAssigned.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Layaout>
            <br></br>
            <CardHeader title="Entregas Inmediatas" icon="ticket-alt">
                <form>
                    <MDBRow className="center-element">
                        <MDBCol md='3' >
                            <label>Tienda</label>
                            <Select
                                onChange={e => handleChange1(e, "store_asigned")}
                                defaultValue={default_store}
                                options={dataStores}
                            />
                        </MDBCol>
                        <MDBCol md='3'>
                            <MDBInput label='Cliente' type='text' validate onChange={e => handleChange1(e, "client")} />
                        </MDBCol>
                        <MDBCol md='3'>
                            <MDBInput label='Factura' type='text' validate onChange={e => handleChange1(e, "bill")} />
                        </MDBCol>
                        <MDBCol md='3'>
                            <MDBInput label='Direccion' type='text' validate onChange={e => handleChange1(e, "address")} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md='2'>
                            <MDBInput label='Celular 1' type="text" validate onChange={e => handleChange1(e, "phone1")} />
                        </MDBCol>
                        <MDBCol md='2'>
                            <MDBInput label='Celular 2' type="text" validate onChange={e => handleChange1(e, "phone2")} />
                        </MDBCol>
                        <MDBCol md='2'>
                            <MDBInput label='Horario' type="text" validate onChange={e => handleChange1(e, "hours")} />
                        </MDBCol>
                        <MDBCol md='2'>
                            <MDBInput label='Total a Pagar' type="text" validate onChange={e => handleChange1(e, "total")} />
                        </MDBCol>
                        <MDBCol md='4'>
                            <MDBInput type="file" accept="image/png, image/jpeg" validate onChange={e => handleChange1(e, "image")} />
                        </MDBCol>
                    </MDBRow>
                    {fields.map((field, idx) => {
                        return (
                            <MDBRow className="center-element" key={`${field}-${idx}`}>
                                <MDBCol md='3'>
                                    <MDBInput label='UPC' type="text" validate onChange={e => handleChange2(idx, e, "upc")} />
                                </MDBCol>
                                <MDBCol md='3'>
                                    <MDBInput label='ALU' type="text" validate onChange={e => handleChange2(idx, e, "alu")} />
                                </MDBCol>
                                <MDBCol md='3'>
                                    <MDBInput label='TALLA' type="text" validate onChange={e => handleChange2(idx, e, "size")} />
                                </MDBCol>
                                <MDBCol md='1' style={{ paddingLeft: "0px", paddingTop: "20px" }}>
                                    {idx !== 0 && (<MDBBtn size="sm" color='danger' onClick={() => handleRemove(idx)}>X</MDBBtn>)}
                                </MDBCol>
                            </MDBRow>
                        )
                    })}
                    <MDBRow className="center-element">
                        <Button variant="outlined" color='primary' onClick={(e) => handleAdd(e)}><span><MDBIcon icon="plus" /> Agregar</span></Button>
                        <Button variant="outlined" style={{ color: "#4caf50", marginLeft: "10px" }} onClick={(e) => crearTicket(e)}><span><MDBIcon icon='ticket-alt' />  Crear Ticket</span></Button>
                    </MDBRow>
                </form>
            </CardHeader>
            <br></br>
            <MDBContainer>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange3}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Tickets Creados" {...a11yProps(0)} />
                        <Tab label="Tickets Asignados" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>

                <TabPanel value={value} index={0}>
                    <MDBRow>
                        {
                            dataTicketsImmediatesCreated.length > 0 ? (
                                currentPosts.map((data) => {
                                    if (data.store_created === my_store) {
                                        let orden = 0;
                                        return (
                                            <MDBCol key={data._id} md="6" style={{ marginBottom: "15px" }}>
                                                <MDBCard>
                                                    <MDBCardBody style={{ Height: "300px" }}>
                                                        <MDBCardTitle> <span><FaStoreAlt /> {data.store_asigned}</span>
                                                            <MDBBtn className="float-right" size="sm" color='danger' onClick={() => removeTicket(data._id)}><FaTimes style={{ fontSize: '15px' }} /></MDBBtn>
                                                            <MDBBtn className="float-right" size="sm" color='dark-green' onClick={() => completeTicket(data._id)}><FaCheck style={{ fontSize: '15px' }} /></MDBBtn>
                                                        </MDBCardTitle>
                                                        <MDBCardText>
                                                            <b>Información Destino:</b> {data.desc}
                                                        </MDBCardText>
                                                        <MDBTable small>
                                                            <MDBTableHead>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>UPC</th>
                                                                    <th>ALU</th>
                                                                    <th>TALLA</th>
                                                                    <th>FACTURA</th>
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
                                                        <span><FaRegCalendar />  <Moment format="DD/MM/YYYY">{data.timestamp}</Moment></span>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            </MDBCol>
                                        )
                                    } else { return '' }
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
                            totalPosts={dataTicketsImmediatesCreated.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <MDBRow>
                        {
                            dataTicketsImmediatesAssigned.length > 0 ? (
                                currentPosts2.map((data) => {
                                    if (data.store_asigned === my_store) {
                                        let orden = 0;
                                        return (
                                            <MDBCol key={data._id} md="6" style={{ marginBottom: "15px" }}>
                                                <MDBCard>
                                                    <MDBCardBody>
                                                        <MDBCardTitle><span><FaStoreAlt /> {data.store_created}</span>
                                                        </MDBCardTitle>
                                                        <MDBCardText>
                                                            <b>Información Destino:</b> {data.desc}
                                                        </MDBCardText>
                                                        <MDBTable small>
                                                            <MDBTableHead>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>UPC</th>
                                                                    <th>ALU</th>
                                                                    <th>TALLA</th>
                                                                    <th>FACTURA</th>
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
                                                        <span><FaRegCalendar />  <Moment format="DD/MM/YYYY">{data.timestamp}</Moment></span>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            </MDBCol>
                                        )
                                    } else { return '' }
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
                            totalPosts={dataTicketsImmediatesAssigned.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
                </TabPanel>
            </MDBContainer>
        </Layaout>
    )
}

export default ImmediateDelivery;