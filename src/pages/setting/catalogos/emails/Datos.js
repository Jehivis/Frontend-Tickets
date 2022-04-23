import React, { useEffect, useState } from 'react';
import Layaout from '../../../parcials/Layaout';
import CardHeader from '../../../../components/CardHeader';
import { emailTemplateShow, emailTemplateCreate, emailTemplateUpdate, templateAsignedEmailShow } from '../../../../functions/settingsFunction';
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
    const [dataEmailTemplate, setdataEmailTemplate] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);

    const [item, setItem] = useState(false);
    const [email, setEmail] = useState(false);
    const [template, setTemplate] = useState(false);
    const [status, setStatus] = useState(false);
    const [dataTemplate, setdataTemplate] = useState([]);

    const toggleModal = (item, email, template, status) => {
        setItem(item);
        setStatus({ value: status, label: status });
        setEmail(email);
        setTemplate({ value: template, label: template });
        setModal(!modal);
    };

    const toggleModalCreate = () => {
        setModalCreate(!modalCreate);
    };

    const createUser = () => {

        if (email === false) {
            Swal.fire('Error', 'Falto ingresar email', 'error');
        }

        if (template === false) {
            Swal.fire('Error', 'Falto ingresar template', 'error');
        }

        if (status === false) {
            Swal.fire('Error', 'Falto ingresar estatus', 'error');
        }

        const createItem = {
            email: email,
            template: template,
            status: status,
            date_at: new Date(),
            date_update: new Date()
        };

        if (email !== false && template !== false && status !== false) {
            emailTemplateCreate(createItem).then(res => {
                Swal.fire('Éxito', 'Email Ingresado', 'success');
                ReloadData();
                toggleModalCreate();
                falseData();
            }).catch(err => {
                Swal.fire('Error', 'Error al ingresar usuario', 'error');
            })
        }
        falseData();
    };

    const updateUser = () => {
        if (email === false) {
            Swal.fire('Error', 'Falto ingresar email', 'error');
        }

        if (template === false) {
            Swal.fire('Error', 'Falto ingresar template', 'error');
        }

        if (status === false) {
            Swal.fire('Error', 'Falto ingresar estatus', 'error');
        }

        const updateItem = {
            id: item,
            email: email,
            template: template,
            status: status,
            date_update: new Date()
        };
        if (email !== false && template !== false && status !== false) {
            emailTemplateUpdate(updateItem).then(res => {
                Swal.fire('Éxito', 'Usuario Actualizado', 'success');
                ReloadData();
                toggleModal();
                falseData();
            }).catch(err => {
                Swal.fire('Error', 'Error al ingresar usuario', 'error');
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
        emailTemplateShow()
            .then((res) => {
                setdataEmailTemplate(res);
                setLoading(false);
            }
            )
            .catch(err =>
                setLoading(true)
            )

        templateAsignedEmailShow()
            .then((res) => {
                var templateData = [];
                res.map(store => {
                    return templateData.push({ label: store.name, name: store.name });
                });
                setdataTemplate(templateData);
                setLoading(false);
            }
            )
            .catch(err =>
                setLoading(true)
            )
    };

    const falseData = () => {
        setItem(false);
        setStatus(false);
        setEmail(false);
    };
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = dataEmailTemplate ? dataEmailTemplate.slice(indexOfFirstPost, indexOfLastPost) : [];

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
                    <CardHeader title="Asignacion de email a plantillas" icon="ticket-alt">
                        <MDBBtn color='info' onClick={() => toggleModalCreate()}>
                            Agregar Email
                        </MDBBtn>
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Email</th>
                                    <th>Template</th>
                                    <th>Estatus</th>
                                    <th>Fecha Creación</th>
                                    <th>Fecha Actualización</th>
                                    <th>Acciones</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <Tablebinnacle posts={currentPosts} loading={loading} toggleModal={toggleModal} />
                            </MDBTableBody>

                            {
                                dataEmailTemplate === undefined ? (
                                    <tr><td colSpan="6"><center>No existen datos</center></td></tr>
                                ) :
                                    (
                                        <Pagination
                                            postsPerPage={postsPerPage}
                                            totalPosts={dataEmailTemplate.length}
                                            paginate={paginate}
                                            currentPage={currentPage}
                                        />
                                    )
                            }

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
                        <MDBIcon icon='pencil-alt' /> Crear Email
              </h4>
                    <button type='button' className='close' onClick={() => toggleModalCreate()}>
                        <span aria-hidden='true'>×</span>
                    </button>
                </div>
                <MDBModalBody>
                    <MDBInput
                        label='Correo'
                        icon='address-book'
                        type='email'
                        error='wrong'
                        success='right'
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label> Template</label>
                    <Select
                        onChange={e => setTemplate(e.name)}
                        options={dataTemplate}
                    />

                    <label> Estados</label>
                    <Select
                        onChange={e => setStatus(e.name)}
                        options={state}
                    />

                    <br />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='primary' onClick={() => createUser()}>Crear</MDBBtn>
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
                        <MDBIcon icon='pencil-alt' /> Editar Email
              </h4>
                    <button type='button' className='close' onClick={() => toggleModal()}>
                        <span aria-hidden='true'>×</span>
                    </button>
                </div>
                <MDBModalBody>
                    <MDBInput
                        label='Correo'
                        icon='address-book'
                        type='email'
                        error='wrong'
                        success='right'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label> Template</label>
                    <Select
                        onChange={e => setTemplate(e.name)}
                        defaultValue={template}
                        options={dataTemplate}
                    />
                    <label> Estados</label>
                    <Select
                        onChange={e => setStatus(e.name)}
                        defaultValue={status}
                        options={state}
                    />
                    <br />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='secondary' onClick={() => toggleModal()}>
                        x
              </MDBBtn>
                    <MDBBtn color='primary' onClick={() => updateUser()} >Actualizar</MDBBtn>
                </MDBModalFooter>
            </MDBModal>


        </Layaout>
    )

}
export default DatosdeVenta;