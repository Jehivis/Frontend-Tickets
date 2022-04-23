import React, { useState, useEffect } from 'react';
import {
    getAllCertificates,
    exchangeCertificate
} from '../../functions/certificateFunction';
import Layaout from '../parcials/Layaout';
import CardHeader from '../../components/CardHeader';
import Pagination from '../../components/pagination';
import TableCertificates from './TableCertificates'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBIcon,
    MDBContainer,
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from 'mdbreact';
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


const RedeemCertificate = () => {
    const [loading, setLoading] = useState(0);
    const [dataCertificatesActives, setDataCertificatesActives] = useState([]);
    const [dataCertificatesInactives, setDataCertificatesInactives] = useState([]);
    const [selectData, setSelectData] = useState();
    const [dataCertificate, setDataCertificate] = useState([{
        id: null,
        num_fact: null,
        val_fact: null,
    }])
    const [value, setValue] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    useEffect(() => {
        getAllData();
    }, [])

    const getAllData = () => {
        let store = localStorage.getItem("store");
        getAllCertificates(store)
            .then((response) => {
                let data = []
                response.data.activos.map(certif => {
                    return data.push({ value: `${certif._id}|${certif.val_cer}`, label: `${certif.no_cer}-${certif.name_cer}-Q${certif.val_cer}` })
                })
                setSelectData(data);
                setDataCertificatesActives(response.data.activos);
                setDataCertificatesInactives(response.data.canjeados);
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
            })
            .catch(err => console.log(err))
    }

    function result_function(icon, text) {
        Toast.fire({
            icon: icon,
            title: text
        })
    }

    const handleChange = (e, name) => {
        const values = [...dataCertificate];
        if(name === 'store'){
            values[0]['id'] = e.value;
        }else if(name === 'num_fact'){
            values[0][name] = e.target.value;
        }else if(name === 'val_fact'){
            values[0][name] = e.target.value;
        }

        setDataCertificate(values)
    }

    const handleChange2 = (event, newValue) => {
        setValue(newValue);
    };

    const handleClickCanjear = () => {
        let value = dataCertificate[0].id || "0|0";
        let array_data = value.split("|");
        let id = array_data[0];
        let valor_factura = array_data[1];
        if(dataCertificate[0].val_fact === 0){
            result_function('error','El valor de la factura no puede ser "0"')
        } else if(dataCertificate[0].num_fact === null){
            result_function('error','Ingrese un número de factura')
        } else if(dataCertificate[0].id === null){
            result_function('error','Debe seleccionar un certificado')
        } else if(dataCertificate[0].val_fact === null){
            result_function('error','Debe ingresar el valor de la factura')
        } else if(parseFloat(dataCertificate[0].val_fact) > parseFloat(valor_factura)){
            result_function('error','El valor de la factura es mayor al valor del certificado')
        }else{
            exchangeCertificate(id, dataCertificate[0])
                .then(response => { result_function('success',response.data.message); getAllData(); })
                .catch(error => { result_function('error','Algo salio mal'); console.log(error) })
        }
    }

    const value2 = { value: '', label: 'Selecciona un certificado' };
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataCertificatesActives.slice(indexOfFirstPost, indexOfLastPost);
    const currentPosts2 = dataCertificatesInactives.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Layaout>
            <br></br>
            <CardHeader title="CAMBIO DE CERTIFICADO" icon="ticket-alt">
                <MDBRow className="center-element">
                    <MDBCol md='4'>
                        <label className="text-muted">CARTIFICADOS ACTIVOS</label>
                        <Select
                            onChange={e => handleChange(e, "store")}
                            defaultValue={value2}
                            options={selectData}
                        />
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBInput
                            onChange={(e) => handleChange(e, 'num_fact')}
                            label='NÚMERO DE FACTURA'
                            type='text'
                            validate />
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBInput
                            onChange={(e) => handleChange(e, 'val_fact')}
                            label='VALOR DE FACTURA'
                            type='number'
                            min='0'
                            validate />
                    </MDBCol>
                </MDBRow>

                <MDBRow className="center-element">
                    <Button
                        onClick={() => handleClickCanjear()}
                        variant="outlined"
                        style={{ color: "#4caf50", marginLeft: "10px" }}>
                            <span>
                                <MDBIcon icon='ticket-alt' />  Canjear Certificado
                            </span>
                    </Button>
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
                        <Tab label="Certificados Canjeables" {...a11yProps(0)} />
                        <Tab label="Certificados Canjeados" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>

                <TabPanel value={value} index={0}>
                    <MDBRow>
                        <MDBCol md="6" style={{ marginBottom: "15px" }}>
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
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="center-element">
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={dataCertificatesActives.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <MDBRow>
                    <MDBCol md="6" style={{ marginBottom: "15px" }}>
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
                                    <TableCertificates posts={currentPosts2} loading={loading} />
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="center-element">
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={dataCertificatesInactives.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </MDBRow>
                </TabPanel>
            </MDBContainer>
            <br></br>
        </Layaout>
    )
}

export default RedeemCertificate;