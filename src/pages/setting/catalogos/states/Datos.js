import React, { useEffect, useState } from 'react';
import Layaout from '../../../parcials/Layaout';
import CardHeader from '../../../../components/CardHeader'
import { statesShow, statesCreate, statesUpdate } from '../../../../functions/settingsFunction'
import Loading from '../img/loading.gif'
import { useHistory } from "react-router-dom";
import {
    MDBBtn,
    MDBIcon,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBInput
} from 'mdbreact';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Tablebinnacle from './Table';
import Pagination from '../../../../components/pagination';
const DatosdeVenta = () => {
    const history = useHistory();
    const [dataSales, setdataSales] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(80);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);

    const [item, setItem] = useState(false);
    const [name, setName] = useState(false);
    const [status, setStatus] = useState(false);

    const toggleModal = (name, status, item) => {
        setItem(item);
        setName(name);
        setStatus(status);
        setModal(!modal);
    };

    const toggleModalCreate = () => {
        setModalCreate(!modalCreate);
    };

    const createEstatus = () => {

        if (name === false) {
            Swal.fire('Error', 'Falto ingresar nombre', 'error');
        }

        if (status === false) {
            Swal.fire('Error', 'Falto ingresar estatus', 'error');
        }

        const createItem = {
            name: name,
            status: status
        };
        if (status !== false && name !== false) {
            statesCreate(createItem).then(res => {
                Swal.fire('Éxito', 'Estado Ingresado', 'success');
                ReloadData();
                toggleModalCreate();
                falseData();
            }).catch(err => {
                Swal.fire('Error', 'Error al ingresar estados', 'error');
            })
        }
    };

    const updateEstatus = () => {

        if (name === false) {
            Swal.fire('Error', 'Falto ingresar nombre', 'error');
        }

        if (status === false) {
            Swal.fire('Error', 'Falto ingresar estatus', 'error');
        }

        const updateItem = {
            id: item,
            name: name,
            status: status
        };
        if (status !== false && name !== false) {
            statesUpdate(updateItem).then(res => {
                Swal.fire('Éxito', 'Estado Actualizado', 'success');
                ReloadData();
                toggleModal();
                falseData();
            }).catch(err => {
                Swal.fire('Error', 'Error al ingresar estados', 'error');
            });
        }

    };

    const state = [
        {
            label: "Activo",
            name: "Activo"
        },
        {
            label: "Inactivo",
            name: "Inactivo"
        }
    ];

    useEffect(() => {
        ReloadData();
    }, [])

    const ReloadData = () => {
        statesShow()
            .then((res) => {
                console.log(res)
                setdataSales(res);
                setLoading(false);
            }
            )
            .catch(err =>
                setLoading(true)
            )
    };

    const falseData = () => {
        setItem(false);
        setName(false);
        setStatus(false);
    };

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataSales.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const valueStatus = { value: status, label: status };
    if (localStorage.getItem('session') !== "true") {
        history.push(`/`);
    }
    return (
        <Layaout>
            { loading ?
                (<center><img
                    alt='Preload'
                    className='img-fluid'
                    src={Loading}
                /></center>)
                :
                <>
                    <br></br>
                    <CardHeader title="Estados" icon="ticket-alt">
                        <MDBBtn color='info' onClick={() => toggleModalCreate()}>
                            Agregar Estado
                        </MDBBtn>
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <Tablebinnacle posts={currentPosts} loading={loading} toggleModal={toggleModal} />
                            </MDBTableBody>
                            {dataSales.length < 1 ? (<tr><td colSpan="4"><center>No existen datos de venta</center></td></tr>) : ""}
                            <Pagination
                                postsPerPage={postsPerPage}
                                totalPosts={dataSales.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </MDBTable>
                    </CardHeader>
                </>}


            {/*-----Nuevo---------*/}
            <MDBModal
                isOpen={modalCreate}
                toggle={() => toggleModalCreate()}
                className='cascading-modal'
            >
                <div className='modal-header primary-color white-text'>
                    <h4 className='title'>
                        <MDBIcon icon='pencil-alt' /> Crear Estado
              </h4>
                    <button type='button' className='close' onClick={() => toggleModalCreate()}>
                        <span aria-hidden='true'>×</span>
                    </button>
                </div>
                <MDBModalBody>
                    <MDBInput
                        label='Nombre'
                        icon='user'
                        type='text'
                        error='wrong'
                        success='right'
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Select
                        onChange={e => setStatus(e.label)}
                        defaultValue={valueStatus}
                        options={state}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='primary' onClick={() => createEstatus()}>Crear</MDBBtn>
                    <MDBBtn color='secondary' onClick={() => toggleModalCreate()}>Cerrar</MDBBtn>

                </MDBModalFooter>
            </MDBModal>
            {/*-----Editar---------*/}
            <MDBModal
                isOpen={modal}
                toggle={() => toggleModal()}
                className='cascading-modal'
            >
                <div className='modal-header primary-color white-text'>
                    <h4 className='title'>
                        <MDBIcon icon='pencil-alt' /> Editar Estado
              </h4>
                    <button type='button' className='close' onClick={() => toggleModal()}>
                        <span aria-hidden='true'>×</span>
                    </button>
                </div>
                <MDBModalBody>
                    <MDBInput
                        label='Nombre'
                        icon='user'
                        type='text'
                        error='wrong'
                        success='right'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <Select
                        onChange={e => setStatus(e.label)}
                        defaultValue={status}
                        options={state}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='secondary' onClick={() => toggleModal()}>
                        x
              </MDBBtn>
                    <MDBBtn color='primary' onClick={() => updateEstatus()} >Actualizar</MDBBtn>
                </MDBModalFooter>
            </MDBModal>


        </Layaout>
    )

}
export default DatosdeVenta;