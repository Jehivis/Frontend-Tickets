import React, { useEffect, useState } from 'react';
import Layaout from '../../../parcials/Layaout';
import CardHeader from '../../../../components/CardHeader';
import { userShow, userCreate, userUpdate } from '../../../../functions/settingsFunction';
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
import Tablebinnacle from './Table';
import Pagination from '../../../../components/pagination';
const DatosdeVenta = () => {
    const history = useHistory();
    const [dataStore, setdataStore] = useState([]);
    const [dataSales, setdataSales] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);

    const [item, setItem] = useState(false);
    const [name, setName] = useState(false);
    const [email, setEmail] = useState(false);
    const [status, setStatus] = useState(false);
    const [store, setStore] = useState(false);
    const [typeUser, setTypeUser] = useState(false);
    const [password, setPassword] = useState(false);
    const [passwordC, setPasswordC] = useState(false);
    const [checkVal, setCheck] = useState(false);

    const toggleModal = (email, name, type, change_date, store, status, item, password) => {
        setItem(item);
        setName(name);
        setStatus(status);
        setEmail(email);
        setStore(store);
        setTypeUser(type);
        setPassword(password);
        setCheck(change_date);
        setPasswordC(password);
        setModal(!modal);
    };

    const toggleModalCreate = () => {
        setModalCreate(!modalCreate);
    };

    const createUser = () => {

        if (name === false) {
            Swal.fire('Error', 'Falto ingresar nombre', 'error');
        }

        if (status === false) {
            Swal.fire('Error', 'Falto ingresar estatus', 'error');
        }

        if (store === false) {
            Swal.fire('Error', 'Falto ingresar tienda', 'error');
        }

        if (typeUser === false) {
            Swal.fire('Error', 'Falto ingresar tipo', 'error');
        }

        if (email === false) {
            Swal.fire('Error', 'Falto ingresar email', 'error');
        }

        if (password === false) {
            Swal.fire('Error', 'Falto ingresar contraseña', 'error');
        }

        const createItem = {
            name: name,
            status: status,
            email: email,
            store: store,
            typeUser: typeUser,
            change_date: checkVal,
            password: password
        };

        if (name !== false && status !== false && email !== false && store !== false && typeUser !== false) {
            userCreate(createItem).then(res => {
                Swal.fire('Éxito', 'Usuario Ingresado', 'success');
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

        if (name === false) {
            Swal.fire('Error', 'Falto ingresar nombre', 'error');
        }

        if (status === false) {
            Swal.fire('Error', 'Falto ingresar estatus', 'error');
        }

        if (store === false) {
            Swal.fire('Error', 'Falto ingresar tienda', 'error');
        }

        if (typeUser === false) {
            Swal.fire('Error', 'Falto ingresar tipo', 'error');
        }

        if (email === false) {
            Swal.fire('Error', 'Falto ingresar email', 'error');
        }

        if (password === false) {
            Swal.fire('Error', 'Falto ingresar contraseña', 'error');
        }

        const updateItem = {
            id: item,
            name: name,
            status: status,
            email: email,
            store: store,
            typeUser: typeUser,
            change_date: checkVal,
            password: password,
            passwordC: passwordC
        };

        if (name !== false && status !== false && email !== false && store !== false && typeUser !== false) {
            userUpdate(updateItem).then(res => {
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

    const typeUserList = [
        {
            label: "Administrador",
            name: "admin"
        },
        {
            label: "Usuario",
            name: "user"
        }
    ];


    useEffect(() => {
        ReloadData();
    }, [])

    const ReloadData = () => {
        userShow()
            .then((res) => {
                setdataSales(res);
                setLoading(false);
            }
            )
            .catch(err =>
                setLoading(true)
            )

        getStore().then((res) => {
            var storeData = [];
            res.map(store => {
                return storeData.push({ label: store.name, name: store.name });
            });
            setdataStore(storeData);
            setLoading(false);
        })
            .catch(error => console.log(error))
    };

    const falseData = () => {
        setItem(false);
        setName(false);
        setStatus(false);
        setEmail(false);
        setStore(false);
        setTypeUser(false);
        setPassword(false);
        setCheck(false);
        setPasswordC(false);
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
                    <CardHeader title="Usuarios" icon="ticket-alt">
                        <MDBBtn color='info' onClick={() => toggleModalCreate()}>
                            Agregar Usuario
                        </MDBBtn>
                        <MDBTable>
                            <MDBTableHead>
                                <tr>
                                    <th>Email</th>
                                    <th>Nombre</th>
                                    <th>Tipo Usuario</th>
                                    <th>Fecha variable</th>
                                    <th>Tienda</th>
                                    <th>Estado</th>
                                    <th>Fecha Creacion</th>
                                    <th>Acciones</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <Tablebinnacle posts={currentPosts} loading={loading} toggleModal={toggleModal} />
                            </MDBTableBody>
                            {dataSales.length < 1 ? (<tr><td colSpan="4"><center>No existen datos</center></td></tr>) : ""}
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
                        <MDBIcon icon='pencil-alt' /> Crear Usuario
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

                    <MDBInput
                        label='Correo'
                        icon='address-book'
                        type='email'
                        error='wrong'
                        success='right'
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <MDBInput
                        label='Contraseña'
                        icon='user'
                        type='password'
                        error='wrong'
                        success='right'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Tiendas</label>
                    <Select
                        onChange={e => setStore(e.label)}
                        options={dataStore}
                    />
                    <label> Tipo</label>
                    <Select
                        onChange={e => setTypeUser(e.name)}
                        options={typeUserList}
                    />
                    <label> Estados</label>
                    <Select
                        onChange={e => setStatus(e.label)}
                        options={state}
                    />
                    <br />
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="defaultUnchecked" onClick={() => setCheck(!checkVal)} />
                        <label className="custom-control-label" htmlFor="defaultUnchecked">Fecha por defecto</label>
                    </div>

                    <br />
                    <br />
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <MDBInput
                        label='Correo'
                        icon='address-book'
                        type='email'
                        error='wrong'
                        success='right'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <MDBInput
                        label='Contraseña'
                        icon='user'
                        type='password'
                        error='wrong'
                        success='right'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Tiendas</label>
                    <Select
                        onChange={e => setStore(e.label)}
                        defaultValue={store}
                        options={dataStore}
                    />
                    <label> Tipo</label>
                    <Select
                        onChange={e => setTypeUser(e.name)}
                        defaultValue={typeUser}
                        options={typeUserList}
                    />
                    <label> Estados</label>
                    <Select
                        onChange={e => setStatus(e.label)}
                        defaultValue={status}
                        options={state}
                    />
                    <br />
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="defaultUnchecked" onClick={() => setCheck(!checkVal)} checked={checkVal ? "checked" : ""} />
                        <label className="custom-control-label" htmlFor="defaultUnchecked">Fecha por defecto</label>
                    </div>
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