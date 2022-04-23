import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader';
import {
    storeTicketsSystemTransfer,
    getTicketsSystemTransferCreated,
    getTicketsSystemTransferAssigned,
    getStoreActives,
    inactivateTicket,
    completeTicket
} from '../../../functions/ticketFunction';
import Pagination from '../../../components/pagination';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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
    MDBTableHead,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter
} from 'mdbreact';
import { FaRegPaperPlane, FaStoreAlt, FaCheckDouble, FaBan } from 'react-icons/fa'
import Select from 'react-select';
import Swal from 'sweetalert2';

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


const TransferSystemPage = () => {
    const my_store = localStorage.getItem("store");
    const my_email = localStorage.getItem("email");
    const my_subs = localStorage.getItem("subsidiaria");
    const history = useHistory();
    const [value, setValue] = useState(0);
    const [dataTicketsCreated, setdataTicketsCreated] = useState([]);
    const [dataTicketsAssigned, setdataTicketsAssigned] = useState([]);
    const [dataStores, setdataStores] = useState([]);
    const [fields, setFields] = useState([{ upc: null, alu: null, size: null, bill: null, store_asigned: null, store_created: my_store, email: my_email }]);
    const [retailn, setRetailn] = useState([{ reatiln: null, email: my_email }]);
    const [idticket, setidticket] = useState(0);
    const [showModal, setshowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    useEffect(() => {
        function stores() {
            let storesList = [];
            getStoreActives().then((resp) => resp.map(x => {
                if (x.sbs === my_subs) {
                    storesList.push({ value: x.name, label: x.name })
                    return setdataStores(storesList)
                }
                return null;
            }));
        }

        function tickets_created() {
            getTicketsSystemTransferCreated()
                .then((res) => setdataTicketsCreated(res))
                .catch((error) => result_function('error', 'No se pueden cargar los datos'));
        }

        function tickets_asigned() {
            getTicketsSystemTransferAssigned()
                .then((res) => setdataTicketsAssigned(res))
                .catch((error) => result_function('error', 'No se pueden cargar los datos'));
        }

        stores();
        tickets_created();
        tickets_asigned();
    }, [my_subs])

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }

    function tickets_created() {
        getTicketsSystemTransferCreated()
            .then((res) => setdataTicketsCreated(res))
            .catch((error) => result_function('error', 'No se pueden cargar los datos'));
    }

    function tickets_asigned() {
        getTicketsSystemTransferAssigned()
            .then((res) => setdataTicketsAssigned(res))
            .catch((error) => result_function('error', 'No se pueden cargar los datos'));
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
            } else if (x.bill === null) {
                result_function('error', 'Ingresa un número de FACTURA');
                cont++;
                return true;
            } else {
                return false;
            }
        })

        if (fields[0]["store_asigned"] === null) {
            result_function('error', 'Debes seleccionar alguna tienda');
        } else {
            if (cont === 0) {
                storeTicketsSystemTransfer(fields)
                    .then((response) => {
                        result_function('success', response.data.message);
                        setTimeout(() => {
                            history.go(0);
                        }, 2000);
                    }).catch(err => {
                        alert("Error")
                    })
            }
        }
    }

    function removeTicket(id) {
        inactivateTicket(id).then((res) => {
            tickets_created();
            tickets_asigned();
            result_function('success', res.data.message);
        }).catch((err) => {
            result_function('error', 'Error al eliminar el ticket')
        })
    }

    function completarTicket(id) {
        completeTicket(id, retailn[0]).then((res) => {
            tickets_created();
            tickets_asigned();
            result_function('success', res.data.message);
            setshowModal(false);
        }).catch((err) => {
            result_function('error', 'Error al completar el ticket');
        })
    }

    function handleChange(i, event, name) {
        const values = [...fields];
        if (name === "store_asigned") {
            values[i][name] = event.value;
        } else if (event.target.value.length === 0) {
            values[i][name] = null;
        } else {
            values[i][name] = event.target.value;
        }
        setFields(values);
    }

    function handleChangeRetailn(e) {
        setRetailn([{ retailn: e.target.value }]);
    }

    function handleAdd() {
        const values = [...fields];
        if (fields.length <= 10) {
            values.push({ upc: null, alu: null, size: null });
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

    const handleChange2 = (event, newValue) => {
        setValue(newValue);
    };

    const value2 = { value: 'Selecciona una tienda', label: 'Selecciona una tienda' };
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataTicketsCreated.slice(indexOfFirstPost, indexOfLastPost);
    const currentPosts2 = dataTicketsAssigned.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    function toggle(id = 0) {
        let mostrar = !showModal;
        setidticket(id)
        setshowModal(mostrar);
    }

    return (
        <Layaout>
            <br></br>
            <CardHeader title="TRASLADO DE SISTEMA" icon="ticket-alt">
                {fields.map((field, idx) => {
                    return (
                        <MDBRow id={idx} className="center-element" key={`${field}-${idx}`}>
                            <MDBCol md='2'>
                                <MDBInput label='UPC' type='text' id='text' validate onChange={e => handleChange(idx, e, "upc")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='ALU' type='text' validate onChange={e => handleChange(idx, e, "alu")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Talla' type='text' validate onChange={e => handleChange(idx, e, "size")} />
                            </MDBCol>
                            {idx === 0 && (
                                <MDBCol md='2'>
                                    <MDBInput label='Factura' type='text' validate onChange={e => handleChange(idx, e, "bill")} />
                                </MDBCol>
                            )}
                            {idx === 0 && (
                                <MDBCol md='3' style={{ marginTop: "26px" }}>
                                    <Select
                                        onChange={e => handleChange(idx, e, "store_asigned")}
                                        defaultValue={value2}
                                        options={dataStores}
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
                    <Button variant="outlined" color='primary' onClick={() => handleAdd()}><MDBIcon icon="plus" />  Agregar</Button>
                    <Button variant="outlined" style={{ color: "#4caf50", marginLeft: "10px" }} onClick={() => crearTicket()}><span><MDBIcon icon='ticket-alt' />  Crear Ticket</span></Button>
                </MDBRow>
            </CardHeader>
            <br></br>

            <MDBContainer>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange2}
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
                            dataTicketsCreated.length > 0 ? (
                                currentPosts.map((data) => {
                                    if (data.store_created === my_store) {
                                        let orden = 0;
                                        return (
                                            <MDBCol key={data._id} md="6" style={{ marginBottom: "15px" }}>
                                                <MDBCard>
                                                    <MDBCardBody style={{ Height: "300px" }}>
                                                        <MDBCardTitle> <span><FaStoreAlt /> {data.store_asigned}</span>
                                                            <MDBBtn className="float-right" size="sm" color='danger' onClick={() => removeTicket(data._id)}>X</MDBBtn>
                                                        </MDBCardTitle>
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
                                                                    data.product.length > 0 && (
                                                                        data.product.map((prod) => {
                                                                            orden++;
                                                                            return (
                                                                                <tr key={prod._id}>
                                                                                    <td>{orden}</td>
                                                                                    <td>{prod.upc}</td>
                                                                                    <td>{prod.alu}</td>
                                                                                    <td>{prod.siz || prod.size}</td>
                                                                                    <td>{data.fact || prod.bill}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    )
                                                                }
                                                            </MDBTableBody>
                                                        </MDBTable>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            </MDBCol>
                                        )
                                    } else { return '' }
                                })
                            )
                                : (
                                    <MDBCol md='12'>
                                        <MDBCard color='grey' text='white' className='text-center'>
                                            <MDBCardBody>
                                                NO HAY DATOS
                                        </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>)
                        }

                    </MDBRow>
                    <MDBRow className="center-element">
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={dataTicketsCreated.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <MDBRow>
                        {
                            dataTicketsAssigned.length > 0 ? (
                                currentPosts2.map((data) => {
                                    if (data.store_asigned === my_store) {
                                        let orden = 0;
                                        return (
                                            <MDBCol key={data._id} md="6" style={{ marginBottom: "15px" }}>
                                                <MDBCard>
                                                    <MDBCardBody>
                                                        <MDBCardTitle><span><FaStoreAlt /> {data.store_created}</span>
                                                            <MDBBtn className="float-right" size="sm" color='dark-green' onClick={() => toggle(data._id)}>{/*completarTicket(data._id) */}
                                                                <FaRegPaperPlane style={{ fontSize: '15px' }} />
                                                            </MDBBtn>
                                                        </MDBCardTitle>
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
                                                                    data.product.length > 0 && (
                                                                        data.product.map((prod) => {
                                                                            orden++;
                                                                            return (
                                                                                <tr key={prod._id}>
                                                                                    <td>{orden}</td>
                                                                                    <td>{prod.upc}</td>
                                                                                    <td>{prod.alu}</td>
                                                                                    <td>{prod.siz || prod.size}</td>
                                                                                    <td>{data.fact || prod.bill}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    )}
                                                            </MDBTableBody>
                                                        </MDBTable>
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
                            totalPosts={dataTicketsAssigned.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
                </TabPanel>
                <MDBModal isOpen={showModal} toggle={toggle}>
                    <MDBModalHeader toggle={toggle}>Ingresar Retailn</MDBModalHeader>
                    <MDBModalBody>
                        <MDBCol md='12'>
                            <MDBInput label='Retailn' type='text' validate onChange={e => handleChangeRetailn(e)} />
                        </MDBCol>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <Button variant="outlined" color='secondary' onClick={() => toggle()}><span><FaBan />  Cancelar</span></Button>
                        <Button variant="outlined" style={{ color: "#4caf50", marginLeft: "10px" }} onClick={() => completarTicket(idticket)}><span><FaCheckDouble />  Completar</span></Button>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
            <br></br>
        </Layaout>
    )
}

export default TransferSystemPage;