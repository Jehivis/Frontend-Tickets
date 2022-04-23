import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom";
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader'
import { binacleEjectionShow, createBinacleEjection } from '../../../functions/salesFunctions'
import Tablebinnacle from './Tablebinnacle';
import Pagination from '../../../components/pagination';
import Loading from './img/loading.gif';
import {
    MDBRow,
    MDBCol,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
    MDBInput,
} from 'mdbreact';
import Button from '@material-ui/core/Button';


const DatosEjecucion = () => {
    const history = useHistory();
    const [dataDailies, setdataDailies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [loading] = useState(false);
    const [dataBinacle, setdataBinacle] = useState([{
     hamachi: null,
     recepTrans: null,
     processIn: null,
     processOut: null,
     sendReceived: null,
     meta:null,
     beforesales:null,
     vendorsCount:null
    }]);

    useEffect(() => {
        dataShow()
    }, [])

    const dataShow = () =>{
        binacleEjectionShow(localStorage.getItem('store'))
        .then(res => 
            setdataDailies(res)    
        )
        .catch(err => {})
    }

    const handleCreated = () =>{
        if(dataBinacle[0].hamachi === null || dataBinacle[0].recepTrans === null || dataBinacle[0].processIn === null || dataBinacle[0].processOut === null ||
            dataBinacle[0].sendReceived === null ||dataBinacle[0].meta === null ||dataBinacle[0].beforesales === null ||dataBinacle[0].vendorsCount === null ){

                Swal.fire('Error', 'No puedes dejar vacio ningun campo', 'error');

        }else{
            createBinacleEjection(dataBinacle).then((res) =>
            dataShow(),
            history.go(0)
            ).catch((err) => {
            Swal.fire('Error', 'No se pudo crear bitacora', 'error');
        })
        }
    }
    function handleChangeData(event, name, type) {
        const values = [...dataBinacle];
        if(type === 1){
            values[0][name] = event.target.checked
        }else{
            values[0][name] = event.target.value
        }
        setdataBinacle(values);
        
    }
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataDailies.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
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
                <MDBRow className='d-flex justify-content-center'>
                    <MDBCol md='5'>
                        <CardHeader title="Bitacora" icon="ticket-alt">
                            <MDBRow style={{ display: "flex" }}>
                                <MDBCol md='4' className='mb-3'>
                                    <div className='custom-control custom-checkbox pl-3'>
                                        <input
                                        className='custom-control-input'
                                        type='checkbox'
                                        value=''
                                        id='hamachi'
                                        onClick ={(e) => handleChangeData(e,"hamachi", 1)}
                                        />
                                        <label className='custom-control-label' htmlFor='hamachi'>
                                            Hamachi Encendido
                                        </label>
                                    </div>
                                </MDBCol>
                                <MDBCol md='4' className='mb-3'>
                                    <div className='custom-control custom-checkbox pl-3'>
                                        <input
                                        className='custom-control-input'
                                        type='checkbox'
                                        value=''
                                        id='recepTrans'
                                        onClick ={(e) => handleChangeData(e,"recepTrans", 1)}
                                        />
                                        <label className='custom-control-label' htmlFor='recepTrans'>
                                            Recepción de Traslados 
                                        </label>
                                    </div>
                                </MDBCol>
                                <MDBCol md='4' className='mb-3'>
                                    <div className='custom-control custom-checkbox pl-3'>
                                        <input
                                        className='custom-control-input'
                                        type='checkbox'
                                        value=''
                                        id='processIn'
                                        onClick ={(e) => handleChangeData(e,"processIn", 1)}
                                        />
                                        <label className='custom-control-label' htmlFor='processIn'>
                                            Process In 
                                        </label>
                                    </div>
                                </MDBCol>
                                <MDBCol md='4' className='mb-3'>
                                    <div className='custom-control custom-checkbox pl-3'>
                                        <input
                                        className='custom-control-input'
                                        type='checkbox'
                                        value=''
                                        id='processOut'
                                        onClick ={(e) => handleChangeData(e,"processOut", 1)}
                                        />
                                        <label className='custom-control-label' htmlFor='processOut'>
                                            Process Out 
                                        </label>
                                    </div>
                                </MDBCol>
                                <MDBCol md='4' className='mb-3'>
                                    <div className='custom-control custom-checkbox pl-3'>
                                        <input
                                        className='custom-control-input'
                                        type='checkbox'
                                        value=''
                                        id='sendReceived'
                                        onClick ={(e) => handleChangeData(e,"sendReceived", 1)}
                                        />
                                        <label className='custom-control-label' htmlFor='sendReceived'>
                                            Send/Received 
                                        </label>
                                    </div>
                                </MDBCol>
                                <MDBCol md='5'>
                                    <MDBInput label='Meta Diaria' type='text' onChange ={(e) => handleChangeData(e,"meta")}/>
                                </MDBCol>
                                <MDBCol md='5'>
                                    <MDBInput label='Venta Año Anterior' type='text' onChange ={(e) => handleChangeData(e,"beforesales")}/>
                                </MDBCol>
                                <MDBCol md='5'>
                                    <MDBInput label='Cantidad de vendedores' type='text' onChange ={(e) => handleChangeData(e,"vendorsCount")}/>
                                </MDBCol>
                            </MDBRow>
                            <Button variant="contained" color="primary" onClick={() => handleCreated()}>
                                Ingresar
                            </Button>
                        </CardHeader>
                    </MDBCol>

                    <MDBCol md='7'>
                        <CardHeader title="Bitacoras De Ejecución" icon="ticket-alt">
                            <MDBTable>
                                <MDBTableHead>
                                    <tr>
                                        <th>Meta</th>
                                        <th>Año anterior</th>
                                        <th>Vendedores</th>
                                        <th>Fecha</th>
                                    </tr>
                                </MDBTableHead>
                               <MDBTableBody>
                                <Tablebinnacle posts={currentPosts} loading={loading} />
                                </MDBTableBody>
                                {dataDailies.length < 1 ? (<tr><td colSpan="4"><center>No existen datos de venta</center></td></tr>):""}
                                <Pagination
                                    postsPerPage={postsPerPage}
                                    totalPosts={dataDailies.length}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                />
                            </MDBTable>
                        </CardHeader>
                    </MDBCol>
                </MDBRow>
                </>}
        </Layaout>
    )

}
export default DatosEjecucion;