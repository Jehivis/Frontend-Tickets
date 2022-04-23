import React, { useEffect, useState } from 'react';
import Layaout from '../../../parcials/Layaout';
import CardHeader from '../../../../components/CardHeader'
import { SubsidiariasShow, subsidiariaCreate, subsidiariaUpdate } from '../../../../functions/settingsFunction'
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
const SubsidiariasList = () => {
    const history = useHistory();
    const [dataSales, setdataSales] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(80);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);

    const [name, setName] = useState(false);
    const [status, setStatus] = useState(false);
    const [id, setId] = useState(false);

    const toggleModal = (name = false, xid = false, status = false) => {
        setId(xid);
        setName(name);
        setStatus({ value: status, label: status });
        setModal(!modal);
    };

    const toggleModalCreate = () => {
        setModalCreate(!modalCreate);
    };

    const createSubsidiaria = () => {

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

        subsidiariaCreate(createItem).then(res => {
            ReloadData();
            Swal.fire('Éxito', 'Subsidiaria Ingresada', 'success');
            toggleModalCreate();
        }).catch(err => {
            Swal.fire('Error', 'Error al ingresar estados', 'error');
        })
    };

    const updateSubsidiaria = () => {
        const createItem = {
            id: id,
            name: name,
            status: status.value
        };

        subsidiariaUpdate(createItem).then(res => {
            ReloadData();
            Swal.fire('Éxito', 'Subsidiaria Actualizada', 'success');
            toggleModal(false, false, false);
        }).catch(err => {
            Swal.fire('Error', 'Error al ingresar estados', 'error');
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
        ReloadData();
    }, [])

    const ReloadData = () => {
        SubsidiariasShow()
            .then((res) => {
                setdataSales(res);
                setLoading(false);
            }
            )
            .catch(err =>
                setLoading(true)
            )
    };

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataSales.slice(indexOfFirstPost, indexOfLastPost);

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
                    <CardHeader title="Subsidiarias" icon="ticket-alt">
                        <MDBBtn color='info' onClick={() => toggleModalCreate()}>
                            +
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
                        </MDBTable>
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={dataSales.length}
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
                        defaultValue={{ value: '', label: 'Selecciona el estado' }}
                        options={state}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='primary' onClick={() => createSubsidiaria()}>Crear</MDBBtn>
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
                        onChange={e => setStatus({ value: e.label })}
                        defaultValue={status}
                        options={state}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='primary' onClick={() => updateSubsidiaria()}>Actualizar</MDBBtn>
                    <MDBBtn color='secondary' onClick={() => toggleModal()}>Close</MDBBtn>
                </MDBModalFooter>
            </MDBModal>


        </Layaout>
    )

}
export default SubsidiariasList;