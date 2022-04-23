import React, { useEffect, useState } from 'react';
import Layaout from '../../../parcials/Layaout';
import CardHeader from '../../../../components/CardHeader'
import { getSubsidiariaActives, storeCreate, storeUpdate } from '../../../../functions/settingsFunction'
import { getStore } from '../../../../functions/ticketFunction'
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
import TableStores from './Table';
import Pagination from '../../../../components/pagination';

const StoreList = () => {
    const history = useHistory();
    const [dataStore, setdataStore] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(80);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);


    //const [item,setItem] = useState(false);
    const [name, setName] = useState(false);
    const [subsidiaria, setSubsidiaria] = useState(false);
    const [status, setStatus] = useState(false);
    const [id, setId] = useState(false);

    const [subsidiarias, setSubsidiarias] = useState([]);

    const toggleModal = (id, name, subsidiaria, status) => {
        setId(id);
        setName(name);
        setSubsidiaria({ value: subsidiaria, label: subsidiaria });
        setStatus({ value: status, label: status });
        setModal(!modal);
    };

    const toggleModalCreate = () => {
        setModalCreate(!modalCreate);
    };

    const createStore = () => {

        if (name === false) {
            return Swal.fire('Error', 'Falto ingresar nombre', 'error');
        }

        if (subsidiaria === false) {
            return Swal.fire('Error', 'Falto ingresar la subsidiaria', 'error');
        }

        if (status === false) {
            return Swal.fire('Error', 'Falto ingresar estatus', 'error');
        }

        const createItem = {
            name: name,
            sbs: subsidiaria,
            status: status
        };

        storeCreate(createItem).then(res => {
            ReloadData();
            Swal.fire('Éxito', 'Tienda Ingresada', 'success');
            toggleModalCreate();
        }).catch(err => {
            Swal.fire('Error', 'Error al ingresar tienda', 'error');
        })
    };

    const updateStore = () => {
        falseData();
        const createItem = {
            id: id,
            name: name,
            sbs: subsidiaria.value,
            status: status.value
        };

        storeUpdate(createItem).then(res => {
            ReloadData();
            Swal.fire('Éxito', 'Tienda Actualizada', 'success');
            toggleModal();
        }).catch(err => {
            Swal.fire('Error', 'Error al actualizar la tienda', 'error');
        })
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
        getSubsidiarias();
        getStore().then((res) => {
            setdataStore(res)
            setLoading(false);
        })
            .catch(error => console.log(error))
    }, [])

    const ReloadData = () => {
        getSubsidiarias();
        getStore().then((res) => {
            setdataStore(res)
            setLoading(false);
        })
            .catch(error => console.log(error))
    };

    const getSubsidiarias = () => {
        getSubsidiariaActives()
            .then((response) => {
                let data = []
                response.map(sub => {
                    return data.push({ value: sub.name, label: sub.name })
                })
                setSubsidiarias(data);
            }
            )
            .catch(err =>
                setLoading(true)
            )
    }

    const falseData = () => {
        //setItem(false);
        setId(false);
        setName(false);
        setSubsidiaria(false);
        setStatus(false);
    };

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataStore.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
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
                    <CardHeader title="Tiendas" icon="ticket-alt">
                        <MDBBtn color='info' onClick={() => toggleModalCreate()}>
                            +
                    </MDBBtn>
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Subsidiaria</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <TableStores posts={currentPosts} loading={loading} toggleModal={toggleModal} />
                            </MDBTableBody>
                            {dataStore.length < 1 ? (<tr><td colSpan="4"><center>No existen datos de venta</center></td></tr>) : ""}
                        </MDBTable>
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={dataStore.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
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
                        <MDBIcon icon='pencil-alt' /> Crear Tienda
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
                        onChange={e => setSubsidiaria(e.label)}
                        defaultValue={{ value: false, label: 'Selecciona una subsidiaria' }}
                        options={subsidiarias}
                    /><br />
                    <Select
                        onChange={e => setStatus(e.label)}
                        defaultValue={{ value: false, label: 'Selecciona el estado' }}
                        options={state}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='primary' onClick={() => createStore()}>Crear</MDBBtn>
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
                        onChange={e => setSubsidiaria({ value: e.label })}
                        defaultValue={subsidiaria}
                        options={subsidiarias}
                    /><br />
                    <Select
                        onChange={e => setStatus({ value: e.label })}
                        defaultValue={status}
                        options={state}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='primary' onClick={() => updateStore()}>Actualizar</MDBBtn>
                    <MDBBtn color='secondary' onClick={() => toggleModal()}>Close</MDBBtn>
                </MDBModalFooter>
            </MDBModal>


        </Layaout>
    )

}
export default StoreList;