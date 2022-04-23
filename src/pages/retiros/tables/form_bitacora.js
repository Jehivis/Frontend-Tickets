import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat'
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader';
import { retreatShowBinacleList, retreatUpdateRemove } from '../../../functions/retreatsFunction';
import Pagination from '../../../components/pagination';
import { getCollaboration } from '../../../functions/collaboratorFunction'
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBIcon,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from 'mdbreact';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NumericInput from 'react-numeric-input';
import Swal from 'sweetalert2'
import images from './img/load.gif'


const TableBitacoraList = () => {
    const history = useHistory();

    const [descount, setDescount] = useState(0);
    const [deuda, setDeuda] = useState(0);
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataRetreats, setDataRetreats] = useState([]);
    const [dataRetreatsHistory, setDataRetreatsHistory] = useState([]);
        
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
 
    function getRetreats() {
        if (localStorage.getItem('collaborator') !== null) {
            retreatShowBinacleList(localStorage.getItem('collaborator'))
                .then((response) => {
                    setDataRetreats(response.binnacle);
                    setDataRetreatsHistory(response.history);
                    setVendor(response.history[0].name);
                    setDeuda(response.history[0].total_debt);
                    setLoading(true);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    function crearRetreats(e) {
        e.preventDefault();

        if(descount > 0){
            if(descount < deuda ){
            var total = deuda - descount;
            
            const datos = {vendedor: vendor, deuda: total.toFixed(2), descuento: descount};

            retreatUpdateRemove(datos)
            .then( response => {
                Swal.fire(response.tittle, response.message, response.type);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch( err =>{
                Swal.fire('Error', 'El descuento no se pudo completar, intente de nuevo', 'error');
            })
        }else{
            Swal.fire('Error', 'El descuento no puede ser mayor a la deuda', 'error');
        }

        }else{
            Swal.fire('Error', 'El descuento debe ser mayor a 0', 'error');
        }
       
    }

    useEffect(() => {
        console.log(localStorage.getItem('collaborator'));
        getRetreats();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataRetreats.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    let collaborator = [];
    getCollaboration().then((res) => { res.map(resdata => collaborator.push({ name: resdata.name, label: resdata.name })) });

    if (localStorage.getItem('collaborator') === null){
        history.push('/retreats_bitacoras_list')
    }

    return (
        <Layaout>
            <br></br>
            <CardHeader title="Retiros De Mercaderia" icon="ticket-alt">
                <form>
                    <MDBRow className="center-element">
                        <MDBCol md='4'>
                            {loading === true ? (<MDBInput label='Colaborador' type="text" value={dataRetreatsHistory[0].name} validate disabled />): <img src={images} alt='loalding' width='85' height='85' /> }
                        </MDBCol>

                        <MDBCol md='4'>
                        {loading === true ? (<MDBInput label='Deuda' type="text" value={dataRetreatsHistory[0].total_debt} validate disabled />): <img src={images} alt='loalding' width='85' height='85'/>}
                        </MDBCol>

                        <MDBCol md='4'>
                            <Typography variant="body2">Descuento</Typography>
                            <NumericInput
                                className="form-control"
                                step={1}
                                precision={2}
                                size={2}
                                min={0}
                                max={100}
                                mobile
                                onChange={e => setDescount(e)}
                                value={descount}
                            />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="center-element">
                        <Button variant="outlined" style={{ color: "#4caf50", marginLeft: "10px" }} onClick={(e) => crearRetreats(e)}><span><MDBIcon icon='ticket-alt' /> Descontar</span></Button>
                    </MDBRow>
                </form>
            </CardHeader>
            <br></br>
            <MDBContainer>


                <CardHeader title="Bitacora de cobro" icon="ticket-alt">
                    <MDBTable>
                        <MDBTableHead>
                            <tr>
                                <th>Nombre</th>
                                <th>Debito</th>
                                <th>Descripcion</th>
                                <th>Fecha de Actualización</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {
                                dataRetreats.length > 0 ? (
                                    currentPosts.map((data, i) => {

                                        return (
                                            <tr key={i}>
                                                <td>{data.name}</td>
                                                <td>{data.debt}</td>
                                                <td>{data.type}</td>
                                                <td>{dateFormat(data.date_created, 'dd/mm/yyyy')}</td>
                                            </tr>
                                        )
                                    })
                                )
                                    :
                                    <tr>
                                        <td colSpan={4}>
                                    <MDBCard color='grey' text='white' className='text-center'>
                                        <MDBCardBody>
                                            NO HAY DATOS
                                        </MDBCardBody>
                                    </MDBCard>
                                    </td>
                                    </tr>
                            }
                            <tr>
                                <td colSpan={4}>
                                    
                                        <Pagination
                                            postsPerPage={postsPerPage}
                                            totalPosts={dataRetreats.length}
                                            paginate={paginate}
                                            currentPage={currentPage}
                                        />
                                </td>
                            </tr>
                        </MDBTableBody>
                    </MDBTable>
                </CardHeader>
            </MDBContainer>
        </Layaout>
    )
}

export default TableBitacoraList;