import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader'
import { salesShow } from '../../../functions/salesFunctions'
import Loading from './img/loading.gif'
import {
    MDBTable,
    MDBTableBody,
    MDBTableHead,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn
} from 'mdbreact';
import Tablebinnacle from './Tablebinnacle';
import Pagination from '../../../components/pagination';

const DatosdeVenta = () => {
    const history = useHistory();
    const [dataSales, setDataSales] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(20);
    const [loading, setLoading] = useState(true);

    const dateDefault = new Date();
    const formatDefault = dateDefault.getFullYear() + "-" + ((dateDefault.getMonth() + 1) > 9 ? (dateDefault.getMonth() + 1) : "0" + (dateDefault.getMonth() + 1)) + "-" + dateDefault.getDate();
    const [startDate, setStartDate] = useState(formatDefault);

    useEffect(() => {
        handleSearch();
    }, [])

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataSales.slice(indexOfFirstPost, indexOfLastPost);
    console.log(dataSales)
    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (localStorage.getItem('session') !== "true") {
        history.push(`/`);
    }

    const handleSearch = () => {
        console.log(startDate);
        let data = { store: localStorage.getItem('store'), type: localStorage.getItem('type'), dateStart: startDate }
        salesShow(data)
            .then((res) => {
                setLoading(false)
                setDataSales(res)
            }
            )
            .catch(err =>
                console.log(err)
            )
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
                    <CardHeader title="Datos de venta" icon="ticket-alt">
                        <center>
                            <MDBRow>
                                <MDBCol md='6' style={{ marginTop: "26px" }}>
                                    <MDBInput
                                        type='date'
                                        className="form-control"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                    />
                                </MDBCol>
                                <MDBCol md='6' style={{ marginTop: "26px" }}>
                                    <MDBBtn color="light-blue" onClick={() => handleSearch()}>Buscar</MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </center>
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Venta</th>
                                    <th>Meta</th>
                                    <th>Encargado</th>
                                    <th>Tienda</th>
                                    <th>Fecha</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <Tablebinnacle posts={currentPosts} loading={loading} />
                            </MDBTableBody>
                            {dataSales.length < 1 ? (<tr><td colspan="4"><center>No existen datos de venta</center></td></tr>) : ""}
                        </MDBTable>
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={dataSales.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </CardHeader>
                </>}
        </Layaout>
    )

}
export default DatosdeVenta;