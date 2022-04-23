import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader'
import { retreatShowListHistory } from '../../../functions/retreatsFunction'
import Loading from './img/loading.gif'
import {
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from 'mdbreact';
import Tablebinnacle from './listDebt';
import Pagination from '../../../components/pagination';

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

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

const DatosdeVenta = () => {
    const history = useHistory();
    const [dataRetreatsAccepted, setdataRetreatsAccepted] = useState([]);
    const [dataRetreatsCancel, setdataRetreatsCancel] = useState([]);
    const [dataRetreatsDeneged, setdataRetreatsDeneged] = useState([]);
    const [currentPageAccepted, setCurrentPageAccepted] = useState(1);
    const [postsPerPageAccepted] = useState(80);
    const [currentPageCancel, setCurrentPageCancel] = useState(1);
    const [postsPerPageCancel] = useState(80);
    const [currentPageDeneged, setCurrentPageDeneged] = useState(1);
    const [postsPerPageDeneged] = useState(80);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);

    const handleChangeSteps = (event, newValue) => {
        setStep(newValue);
    };

    useEffect(() => {
        retreatShowListHistory(localStorage.getItem("store"),localStorage.getItem('type'))
            .then((res) =>{
            dataAsigned(res)
            setLoading(false)
            })
            .catch(err =>
                setLoading(true)
            )
    }, [])

    const dataAsigned = (data) => {
         setdataRetreatsAccepted(data.acepted)
         setdataRetreatsCancel(data.cancel)
         setdataRetreatsDeneged(data.deneged)
    };

    // Get current posts
    const indexOfLastPostAccepted = currentPageAccepted * postsPerPageAccepted;
    const indexOfFirstPostAccepted = indexOfLastPostAccepted - postsPerPageAccepted;
    const currentPostsAccepted = dataRetreatsAccepted.slice(indexOfFirstPostAccepted, indexOfLastPostAccepted);
    const paginateAccepted = pageNumberAccepted => setCurrentPageAccepted(pageNumberAccepted);

    // Get current posts
    const indexOfLastPostCancel = currentPageCancel * postsPerPageCancel;
    const indexOfFirstPostCancel = indexOfLastPostCancel - postsPerPageCancel;
    const currentPostsCancel = dataRetreatsCancel.slice(indexOfFirstPostCancel, indexOfLastPostCancel);
    const paginateCancel = pageNumber => setCurrentPageCancel(pageNumber);

    // Get current posts
    const indexOfLastPostDeneged = currentPageDeneged * postsPerPageDeneged;
    const indexOfFirstPostDeneged = indexOfLastPostDeneged - postsPerPageDeneged;
    const currentPostsDeneged = dataRetreatsDeneged.slice(indexOfFirstPostDeneged, indexOfLastPostDeneged);
    const paginateDeneged = pageNumber => setCurrentPageDeneged(pageNumber);
    if (localStorage.getItem('session') !== "true") {
        history.push(`/`);
    }

    return (
        <Layaout>
            { loading ?
                (<center> <img
                    alt='Preload'
                    className='img-fluid'
                    src={Loading}
                /></center>)
                : 
                <>
                <br></br>

                <AppBar position="static" color="default">
                    <Tabs
                        value={step}
                        onChange={handleChangeSteps}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Retiros Aceptados" {...a11yProps(0)} />
                        <Tab label="Retiros Denegados" {...a11yProps(1)} />
                        <Tab label="Retiros Cancelados" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>

                <TabPanel value={step} index={0}>
                    <CardHeader title="Historial Aceptados" icon="ticket-alt">
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Descuento</th>
                                    <th>Prefio final</th>
                                    <th>Fecha de Creación</th>
                                    <th>Fecha de Actualización</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <Tablebinnacle posts={currentPostsAccepted} loading={loading} />
                            </MDBTableBody>
                            {dataRetreatsAccepted.length < 1 ? (<tr><td colSpan="4"><center>No existen datos de venta</center></td></tr>):""}
                            <Pagination
                                postsPerPage={currentPostsAccepted}
                                totalPosts={dataRetreatsAccepted.length}
                                paginate={paginateAccepted}
                                currentPage={currentPageAccepted}
                            />
                        </MDBTable>
                    </CardHeader>
                </TabPanel>
                <TabPanel value={step} index={1}>
                    <CardHeader title="Historial Denegados" icon="ticket-alt">
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Descuento</th>
                                    <th>Prefio final</th>
                                    <th>Fecha de Creación</th>
                                    <th>Fecha de Actualización</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <Tablebinnacle posts={currentPostsDeneged} loading={loading} />
                            </MDBTableBody>
                            {dataRetreatsDeneged.length < 1 ? (<tr><td colSpan="4"><center>No existen datos de venta</center></td></tr>):""}
                            <Pagination
                                postsPerPage={postsPerPageDeneged}
                                totalPosts={dataRetreatsDeneged.length}
                                paginate={paginateDeneged}
                                currentPage={currentPageDeneged}
                            />
                        </MDBTable>
                    </CardHeader>
                </TabPanel>
                <TabPanel value={step} index={2}>
                    <CardHeader title="Historial Cancelados" icon="ticket-alt">
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Descuento</th>
                                    <th>Precio final</th>
                                    <th>Fecha de Creación</th>
                                    <th>Fecha de Actualización</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <Tablebinnacle posts={currentPostsCancel} loading={loading} />
                            </MDBTableBody>
                            {dataRetreatsCancel.length < 1 ? (<tr><td colSpan="4"><center>No existen datos de venta</center></td></tr>):""}
                            <Pagination
                                postsPerPage={postsPerPageCancel}
                                totalPosts={dataRetreatsCancel.length}
                                paginate={paginateCancel}
                                currentPage={currentPageCancel}
                            />
                        </MDBTable>
                    </CardHeader>
                </TabPanel>
                </>}
        </Layaout>
    )

}
export default DatosdeVenta;