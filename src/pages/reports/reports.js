import React, { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import {
    MDBRow,
    MDBCol,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
    MDBInput,
} from 'mdbreact';
import { SiMicrosoftexcel } from "react-icons/si";
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import dateFormat from 'dateformat'
import ReactExport from "react-export-excel";
import { getDamagedMerchandiseReport } from "../../functions/damagedFunction"
import { getDataReportSales, getDataReportSalesPaymentMethods, getDataReportDailies } from "../../functions/salesFunctions"
import { getStoreActives, getDataReportTickets } from "../../functions/ticketFunction";
import { getDataReportCertificates } from "../../functions/certificateFunction";
import { getDataReportRetreats } from "../../functions/retreatsFunction";
import { userShow, CollaboratorShow } from "../../functions/settingsFunction";
import Layaout from '../parcials/Layaout';
import CardHeader from '../../components/CardHeader'
import Loading from './img/loading.gif'
import modules from './modules'
import Swal from 'sweetalert2';

const Reports = () => {
    const date = new Date();
    const my_store = localStorage.getItem("store");
    const my_role = localStorage.getItem("type");
    const my_name = localStorage.getItem("name");
    const session = localStorage.getItem("session");
    const date_split = date.toISOString().split("T");
    const date_init = date_split[0];
    const [dataStores, setDataStores] = useState([]);
    const [dataCollaborators, setDataCollaborators] = useState([]);
    const [dataUsers, setDataUsers] = useState([]);
    const [dataBinacleEjection, setDataBinacleEjection] = useState([]);
    const [dataBinacleSales, setDataBinacleSales] = useState([]);
    const [dataPaymentMethods, setDataPaymentMethods] = useState([]);
    const [dataTickets, setDataTickets] = useState([]);
    const [dataDamagedMerchandise, setDataDamagedMerchandise] = useState([]);
    const [dataCertificates, setDataCertificates] = useState([]);
    const [dataRetreats, setdataRetreats] = useState([]);
    const [data, setData] = useState([]);
    const [dateStart, setDateStart] = useState(date_init);
    const [dateEnd, setDateEnd] = useState(date_init);
    const [dataStore, setDataStore] = useState(my_role==='admin'?'Todas':my_store);
    const [dataRetrat, setDataRetreat] = useState('Todos');
    const [dataCollaborator, setDataCollaborator] = useState('Todos');
    const [dataTicket, setDataTicket] = useState('Todos');
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [showModal, setshowModal] = useState(false);
    const [model, setModel] = useState('');
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    const today = `${date.getDate()}_${(date.getMonth() + 1)}_${date.getFullYear()}`;
    const tickets = [
        { label: "Todos", value: "Todos" },
        { label: "Traslado Sistema", value: "traslado_sistema" },
        { label: "Entregas Inmediatas", value: "entregas_inmediatas" },
        { label: "Retiros Externo", value: "retiros_externos" },
        { label: "Tickets Fotografía", value: "tickets_fotografia" },
    ]
    const retiros = [
        { label: "Todos", value: "Todos" },
        { label: "Debitos Retiro", value: "debitos" },
        { label: "Retiros", value: "retiros" },
    ]
    let stores = [];
    let collaborators = [];

    useEffect(() => {
        function getData() {
            getStoreActives().then(res => {
                setDataStores(res);
            });
            CollaboratorShow().then(res => {
                setDataCollaborators(res);
            });
            userShow().then(res => {
                setDataUsers(res);
            });
            getDamagedMerchandiseReport(dateStart, dateEnd, my_store).then((res) => {
                if(res.data) setDataDamagedMerchandise(res.data.data);
            })
            getDataReportDailies(dateStart, dateEnd, my_store).then((res) => {
                if(res.data) setDataBinacleEjection(res.data.data);
            })
            getDataReportSales(dateStart, dateEnd, my_store).then((res) => {
                if(res.data) setDataTickets(res.data.data);
            })
            getDataReportTickets(dateStart, dateEnd, dataTicket, dataStore).then((res) => {
                if(res.data) setDataTickets(res.data.data);
            })
            getDataReportCertificates(dateStart, dateEnd).then((res) => {
                if(res.data) setDataCertificates(res.data.data);
            })
            getDataReportRetreats(dateStart, dateEnd, dataRetrat).then((res) => {
                if(res.data) setdataRetreats(res.data.data);
            })
            setLoading(false);
        }
        getData();
    }, [dateStart, dateEnd, my_store, dataTicket, dataStore, dataRetrat])


    const getData = () => {
        getStoreActives().then(res => {
            setDataStores(res);
        }).catch(err => console.log(err) );
        CollaboratorShow().then(res => {
            setDataCollaborators(res);
        }).catch(err => console.log(err) );
        userShow().then(res => {
            setDataUsers(res);
        }).catch(err => console.log(err) );
        getDamagedMerchandiseReport(dateStart, dateEnd, my_store).then((res) => {
            if(res.data) setDataDamagedMerchandise(res.data.data);
        }).catch(err => console.log(err) );
        getDataReportDailies(dateStart, dateEnd, my_store).then((res) => {
            if(res.data) setDataBinacleEjection(res.data.data);
        }).catch(err => console.log(err) );
        getDataReportSales(dateStart, dateEnd, my_store).then((res) => {
            if(res.data) setDataTickets(res.data.data);
        }).catch(err => console.log(err) );
        getDataReportSalesPaymentMethods(dateStart, dateEnd, my_store).then(res => {
            if(res.data) setDataPaymentMethods(res.data.data)
        }).catch(err => console.log(err) );
        getDataReportTickets(dateStart, dateEnd, dataTicket, dataStore).then((res) => {
            if(res.data) setDataTickets(res.data.data);
        }).catch(err => console.log(err) );
        getDataReportCertificates(dateStart, dateEnd).then((res) => {
            if(res.data) setDataCertificates(res.data.data);
        }).catch(err => console.log(err) );
        getDataReportRetreats(dateStart, dateEnd, dataRetrat).then((res) => {
            if(res.data) setdataRetreats(res.data.data);
        }).catch(err => console.log(err) );
        setLoading(false);
    }

    const toggle = (id = 0) => {
        let mostrar = !showModal;
        limpiar();
        setshowModal(mostrar);
    }

    const show_modal = (model) => {
        setModel(model);
        setshowModal(!showModal);
    }

    const limpiar = () => {
        setData([]);
        getData();
    }

    const reload_data = (model) => {
        let fecha_limite = new Date('2020-08-18');
        let fecha_inicial = new Date(dateStart);
        let fecha_final = new Date(dateEnd);

        if (fecha_inicial >= fecha_limite && fecha_final >= fecha_limite) {
            if (fecha_inicial <= fecha_final) {
                setLoadingButton(true);
                switch (model) {
                    case 'bitacora':
                        getDataReportDailies(dateStart, dateEnd, dataStore).then((res) => {
                            setDataBinacleEjection(res.data.data);
                            setData([{ export: true }]);
                            setLoadingButton(false);
                            if (res.data.data.length === 0) {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'No se encontraron datos'
                                })
                                setData([]);
                            }
                        })
                        break;
                    case 'venta_diaria':
                        getDataReportSales(dateStart, dateEnd, dataStore).then((res) => {
                            setDataBinacleSales(res.data.data);
                            setData([{ export: true }]);
                            setLoadingButton(false);
                            if (res.data.data.length === 0) {
                                console.log("DATA",res.data.data)
                                Swal.fire({
                                    icon: 'info',
                                    title: 'No se encontraron datos'
                                })
                                setData([]);
                            }
                        })
                        break;
                    case 'tickets':
                        getDataReportTickets(dateStart, dateEnd, dataTicket, dataStore).then((res) => {
                            setDataTickets(res.data.data);
                            setData([{ export: true }]);
                            setLoadingButton(false);
                            let traslado = res.data.data.traslado_sistema === null || res.data.data.traslado_sistema.length === 0 ? 0 : res.data.data.traslado_sistema.length;
                            let entregas = res.data.data.entrega_inmediata === null || res.data.data.entrega_inmediata.length === 0 ? 0 : res.data.data.entrega_inmediata.length;
                            let retiros = res.data.data.retiro_externo === null || res.data.data.retiro_externo.length === 0 ? 0 : res.data.data.retiro_externo.length;
                            let photos = res.data.data.tickets_fotografia === null || res.data.data.tickets_fotografia.length === 0 ? 0 : res.data.data.tickets_fotografia.length;

                            if (traslado === 0 && entregas === 0 && retiros === 0 && photos === 0) {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'No se encontraron datos'
                                })
                                setData([]);
                            }
                        })
                        break;
                    case 'mercaderia':
                        getDamagedMerchandiseReport(dateStart, dateEnd, dataStore).then((res) => {
                            setDataDamagedMerchandise(res.data.data);
                            setData([{ export: true }]);
                            setLoadingButton(false);
                            if (res.data.data.length === 0) {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'No se encontraron datos'
                                })
                                setData([]);
                            }
                        })
                        break;
                    case 'certificados':
                        getDataReportCertificates(dateStart, dateEnd).then((res) => {
                            setDataCertificates(res.data.data);
                            setData([{ export: true }]);
                            setLoadingButton(false);
                            if (res.data.data.length === 0) {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'No se encontraron datos'
                                })
                                setData([]);
                            }
                        })
                        break;
                    case 'retiros':
                        getDataReportRetreats(dateStart, dateEnd, dataRetrat, dataCollaborator).then((res) => {
                            setdataRetreats(res.data.data);
                            setData([{ export: true }]);
                            setLoadingButton(false);
                            let retiros = res.data.data.retiro === null || res.data.data.retiro.length === 0 ? 0 : res.data.data.retiro.length;
                            let debitos = res.data.data.retiro_debito === null || res.data.data.retiro_debito.length === 0 ? 0 : res.data.data.retiro_debito.length;
                            if (retiros === 0 && debitos === 0) {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'No se encontraron datos'
                                })
                                setData([]);
                            }
                        })
                        break;
                    case 'payment_methods':
                        getDataReportSalesPaymentMethods(dateStart, dateEnd, dataStore).then(res => {
                            setDataPaymentMethods(res.data.data);
                            setData([{ export: true }]);
                            setLoadingButton(false);
                            if (res.data.data.length === 0) {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'No se encontraron datos'
                                })
                                setData([]);
                            }
                        })
                        break;
                    default:
                        break;
                }
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Rango de fechas invalido',
                    text: 'Revise que el rango de fechas ingresado este bien'
                })
            }

        }else{
            Swal.fire({
                icon: 'info',
                title: 'La fecha es demasiado vieja',
                text: 'Porfavor vaya al reporte de PowerBI donde encontrara toda la información'
            })
        }
    }

    if (dataStores) {
        if (my_role === "admin") {
            if(model !== 'payment_methods'){
                stores.push({ value: 'Todas', label: 'Todas' })
            }
            dataStores.map(x => {
                stores.push({ value: x.name, label: x.name });
                return null;
            })
        } else {
            stores.push({ value: my_store, label: my_store })
        }
    }
    if (dataCollaborators) {
        if (my_role === "admin") {
            collaborators.push({ value: 'Todos', label: 'Todos' })
            dataCollaborators.map(x => {
                collaborators.push({ value: x.name, label: x.name });
                return null;
            })
        } else {
            collaborators.push({ value: my_name, label: my_name })
        }
    }

    if(!session){
        return <Redirect path="/" />
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
                <React.Fragment>
                    &nbsp;&nbsp;
                    <MDBRow>
                        <MDBCol md='8' className='mt-3 mx-auto'>
                            <CardHeader title="Reportería" icon="ticket-alt">
                                <MDBTable id="TableReportes">
                                    <MDBTableHead className="center-element">
                                        <tr>
                                            <th style={{ width: "10%" }}>ID</th>
                                            <th style={{ width: "60%" }}>Módulos</th>
                                            <th style={{ width: "30%" }}>Exportar a Excel</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {
                                            modules.modules.map(x => {
                                                if(x.view.includes(my_role)){
                                                    return (
                                                        <tr key={x._id}>
                                                            <td>{x._id}</td>
                                                            <td>{x.name}</td>
                                                            <td className="center-element">
                                                                {
                                                                    x.surname === 'colaboradores' ? (
                                                                        <ExcelFile element={<Button className="btn text-white green"><SiMicrosoftexcel /></Button>} filename={`Collaboradores_${today}`}>
                                                                            <ExcelSheet data={dataCollaborators} name={`Colabradores_${today}`}>
                                                                                <ExcelColumn label="Nombre" value="name" />
                                                                                <ExcelColumn label="TIENDA" value="store_asigned" />
                                                                                <ExcelColumn label="ESTADO" value="status" />
                                                                                <ExcelColumn label="FECHA CREACIÓN" value={row => dateFormat(row.timestamp, 'dd/mm/yyyy')} />
                                                                            </ExcelSheet>
                                                                        </ExcelFile>
                                                                    ) : x.surname === 'usuarios' ? (
                                                                        <ExcelFile element={<Button className="btn text-white green"><SiMicrosoftexcel /></Button>} filename={`Usuarios_${today}`}>
                                                                            <ExcelSheet data={dataUsers} name={`Usuarios_${today}`}>
                                                                                <ExcelColumn label="EMAIL" value="email" />
                                                                                <ExcelColumn label="NOMBRE" value="name" />
                                                                                <ExcelColumn label="TIPO USUARIO" value="type" />
                                                                                <ExcelColumn label="FECHA VARIABLE" value="change_date" />
                                                                                <ExcelColumn label="TIENDA" value="store" />
                                                                                <ExcelColumn label="ESTADO" value="status" />
                                                                                <ExcelColumn label="FECHA CREACIÓN" value={row => dateFormat(row.timestamp, 'dd/mm/yyyy')} />
                                                                            </ExcelSheet>
                                                                        </ExcelFile>
                                                                    ) : (
                                                                        <Button
                                                                            className="btn text-white green"
                                                                            onClick={() => show_modal(x.surname)}
                                                                        ><SiMicrosoftexcel /></Button>)
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }else{
                                                    return null;
                                                }
                                            })
                                        }
                                    </MDBTableBody>
                                </MDBTable>
                            </CardHeader>
                        </MDBCol>
                    </MDBRow>
                </React.Fragment>
            }
            <MDBModal isOpen={showModal} toggle={toggle}>
                <MDBModalHeader toggle={toggle}>Exportar a Excel</MDBModalHeader>
                <MDBModalBody>
                    <MDBRow>
                        <MDBCol md='6'>
                            <MDBInput
                                onChange={(e) => { setDateStart(e.target.value.replace("/", "-").replace("/", "-")) }}
                                label='Fecha Inicial'
                                type='date'
                                validate
                            />
                        </MDBCol>
                        <MDBCol md='6'>
                            <MDBInput
                                onChange={(e) => { setDateEnd(e.target.value.replace("/", "-").replace("/", "-")) }}
                                label='Fecha Final'
                                type='date'
                                validate
                            />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        {
                            model === 'tickets' ? (
                                <MDBCol md='6'>
                                    <label>Ticket</label>
                                    <Select
                                        onChange={e => setDataTicket(e.value)}
                                        defaultValue={tickets[0]}
                                        options={tickets}
                                    />
                                </MDBCol>
                            ) : ('')
                        }
                        {
                            model === 'retiros' ? (
                                <>
                                    <MDBCol md='6'>
                                        <label>Retiros</label>
                                        <Select
                                            onChange={e => setDataRetreat(e.value)}
                                            defaultValue={retiros[0]}
                                            options={retiros}
                                        />
                                    </MDBCol>
                                    <MDBCol md='6'>
                                        <label>Collaborador</label>
                                        <Select
                                            onChange={e => setDataCollaborator(e.value === 'Todos' ? false : e.value)}
                                            defaultValue={collaborators[0]}
                                            options={collaborators}
                                        />
                                    </MDBCol>
                                </>
                            ) : null
                        }
                        {
                            model !== 'certificados' && model !== 'retiros' ? (
                                <MDBCol md={model === 'tickets' ? '6' : '10'} className={model === 'tickets' ? 'offset-0' : 'offset-1'}>
                                    <label>Tienda</label>
                                    <Select
                                        onChange={e => setDataStore(e.value === 'Todas' ? null : e.value)}
                                        defaultValue={stores[0].label === 'Todas'? stores[0]:{label: my_store, value: my_store}}
                                        options={stores}
                                    />
                                </MDBCol>) : null
                        }
                    </MDBRow>
                </MDBModalBody>
                <MDBModalFooter>
                    <Button className="text-white red" onClick={() => toggle()}><span> Cancelar</span></Button>
                    {
                        data.length === 0 ? (
                            <Button className="text-white" style={{ marginLeft: "10px", backgroundColor: "#ffd500" }} onClick={() => reload_data(model)}>{loadingButton ? 'cargando...' : 'Obtener Data'}</Button>
                        ) : (
                            model === 'mercaderia' ? (
                                <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Mercadería_Dañada_${today}`}>
                                    <ExcelSheet data={dataDamagedMerchandise} name={`Mercadería_Dañada_${today}`}>
                                        <ExcelColumn label="Daño" value="damage" />
                                        <ExcelColumn label="UPC" value="upc" />
                                        <ExcelColumn label="ALU" value="alu" />
                                        <ExcelColumn label="TALLA" value="siz" />
                                        <ExcelColumn label="PREIO" value="price" />
                                        <ExcelColumn label="TIENDA" value="store_created" />
                                        <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                    </ExcelSheet>
                                </ExcelFile>
                            ) : model === 'bitacora' ? (
                                <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Bitacora_Ejecución_${today}`}>
                                    <ExcelSheet data={dataBinacleEjection} name={`Bitacora_Ejecución_${today}`}>
                                        <ExcelColumn label="TIENDA" value="store_created" />
                                        <ExcelColumn label="META" value="daily_goal" />
                                        <ExcelColumn label="AÑO ANTERIOR" value="year_before_sale" />
                                        <ExcelColumn label="VENDEDORES" value="vendor_number" />
                                        <ExcelColumn label="FECHA CREACIÓN" value="date_created" />
                                    </ExcelSheet>
                                </ExcelFile>
                            ) : model === 'venta_diaria' ? (
                                <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Venta_Diaria_${today}`}>
                                    <ExcelSheet data={dataBinacleSales} name={`Venta_Diaria_${today}`}>
                                        <ExcelColumn label="VENTA" value="ventas" />
                                        <ExcelColumn label="META" value="metas" />
                                        <ExcelColumn label="ENCARGADO" value="manager" />
                                        <ExcelColumn label="TIENDA" value="tienda" />
                                        <ExcelColumn label="FECHA CREACIÓN" value="fechaCreacion" />
                                    </ExcelSheet>
                                </ExcelFile>
                            ) : model === 'tickets' ? (
                                dataTickets.type !== 'Todos' ? (
                                    dataTickets.traslado_sistema !== null ? (
                                        <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Traslado_Sistema_${today}`}>
                                            <ExcelSheet data={dataTickets.traslado_sistema} name={`Traslado_Sistema_${today}`}>
                                                <ExcelColumn label="No. FACTURA" value="fact" />
                                                <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                                <ExcelColumn label="RETAILN" value="retailn" />
                                                <ExcelColumn label="ESTADO" value="status" />
                                                <ExcelColumn label="TIENDA CREADORA" value="store_created" />
                                                <ExcelColumn label="TIENDA RESEPTORA" value="store_asigned" />
                                                <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                            </ExcelSheet>
                                        </ExcelFile>
                                    ) : dataTickets.entrega_inmediata !== null ? (
                                        <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Entregas_Inmediatas_${today}`}>
                                            <ExcelSheet data={dataTickets.entrega_inmediata} name={`Entregas_Inmediatas_${today}`}>
                                                <ExcelColumn label="No. FACTURA" value="fact" />
                                                <ExcelColumn label="DESCRIPCION" value="desc" />
                                                <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                                <ExcelColumn label="ESTADO" value="status" />
                                                <ExcelColumn label="TIENDA CREADORA" value="store_created" />
                                                <ExcelColumn label="TIENDA RESEPTORA" value="store_asigned" />
                                                <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                            </ExcelSheet>
                                        </ExcelFile>
                                    ) : dataTickets.retiro_externo !== null ? (
                                        <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Reritos_Externos_${today}`}>
                                            <ExcelSheet data={dataTickets.retiro_externo} name={`Reritos_Externos_${today}`}>
                                                <ExcelColumn label="No. FACTURA" value="inv_val" />
                                                <ExcelColumn label="PERSONA QUE RETRIA" value="person_retreats" />
                                                <ExcelColumn label="PERSONA QUE AUTORIZA" value="person_authorizing" />
                                                <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                                <ExcelColumn label="ESTADO" value="status" />
                                                <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                            </ExcelSheet>
                                        </ExcelFile>
                                    ) : dataTickets.tickets_fotografia !== null ? (
                                        <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Tickets_Fotogrfía_${today}`}>
                                            <ExcelSheet data={dataTickets.tickets_fotografia} name={`Tickets_Fotogrfía_${today}`}>
                                                <ExcelColumn label="PERSONA QUE RETRIA" value="caurier" />
                                                <ExcelColumn label="TIENDA CREADORA" value="store_created" />
                                                <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                                <ExcelColumn label="ESTADO" value="status" />
                                                <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                            </ExcelSheet>
                                        </ExcelFile>
                                    ) : null
                                ) : (
                                    <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Tickets_${today}`}>
                                        <ExcelSheet data={dataTickets.traslado_sistema != null ? dataTickets.traslado_sistema : []} name={`Traslado_Sistema_${today}`}>
                                            <ExcelColumn label="No. FACTURA" value="fact" />
                                            <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                            <ExcelColumn label="RETAILN" value="retailn" />
                                            <ExcelColumn label="ESTADO" value="status" />
                                            <ExcelColumn label="TIENDA CREADORA" value="store_created" />
                                            <ExcelColumn label="TIENDA RESEPTORA" value="store_asigned" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                        </ExcelSheet>
                                        <ExcelSheet data={dataTickets.entrega_inmediata != null ? dataTickets.entrega_inmediata : []} name={`Entregas_Inmediatas_${today}`}>
                                            <ExcelColumn label="No. FACTURA" value="fact" />
                                            <ExcelColumn label="DESCRIPCION" value="desc" />
                                            <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                            <ExcelColumn label="ESTADO" value="status" />
                                            <ExcelColumn label="TIENDA CREADORA" value="store_created" />
                                            <ExcelColumn label="TIENDA RESEPTORA" value="store_asigned" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                        </ExcelSheet>
                                        <ExcelSheet data={dataTickets.retiro_externo != null ? dataTickets.retiro_externo : []} name={`Reritos_Externos_${today}`}>
                                            <ExcelColumn label="No. FACTURA" value="inv_val" />
                                            <ExcelColumn label="PERSONA QUE RETRIA" value="person_retreats" />
                                            <ExcelColumn label="PERSONA QUE AUTORIZA" value="person_authorizing" />
                                            <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                            <ExcelColumn label="ESTADO" value="status" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                        </ExcelSheet>
                                        <ExcelSheet data={dataTickets.tickets_fotografia != null ? dataTickets.tickets_fotografia : []} name={`Tickets_Fotogrfía_${today}`}>
                                            <ExcelColumn label="PERSONA QUE RETRIA" value="caurier" />
                                            <ExcelColumn label="TIENDA CREADORA" value="store_created" />
                                            <ExcelColumn label="PRODUCTO" value={row => `${row.product.map(x => `UPC:${x.upc} ALU:${x.alu} TALLA:${x.siz}`)}`} />
                                            <ExcelColumn label="ESTADO" value="status" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                        </ExcelSheet>
                                    </ExcelFile>
                                )
                            ) : model === 'certificados' ? (
                                <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Certificados_${today}`}>
                                    <ExcelSheet data={dataCertificates} name={`Certificados_${today}`}>
                                        <ExcelColumn label="No. CERTIFICADO" value="no_cer" />
                                        <ExcelColumn label="NOMBRE" value="name_cer" />
                                        <ExcelColumn label="VALOR" value="val_cer" />
                                        <ExcelColumn label="FECHA EMISIÓN" value="date_start_cer" />
                                        <ExcelColumn label="FECHA VENCIMIENTO" value="date_end_cer" />
                                        <ExcelColumn label="OBSERVACIONES" value="obs_cer" />
                                        <ExcelColumn label="MEATPACK" value="meatpack" />
                                        <ExcelColumn label="SPERRY" value="sperry" />
                                        <ExcelColumn label="QUIKSILVER" value="quiksilver" />
                                        <ExcelColumn label="GUESS" value="guess" />
                                        <ExcelColumn label="COLE HAAN" value="colehaan" />
                                        <ExcelColumn label="DIESEL" value="diesel" />
                                        <ExcelColumn label="FECHA CREACIÓN" value="timestamp" />
                                    </ExcelSheet>
                                </ExcelFile>
                            ) : model === 'retiros' ? (
                                dataRetreats.type === 'retiros' ? (
                                    <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Retiros_${dataCollaborator}_${today}`}>
                                        <ExcelSheet data={dataRetreats.retiro} name={`Retiros_${dataCollaborator}_${today}`}>
                                            <ExcelColumn label="NOMBRE" value="name" />
                                            <ExcelColumn label="PRECIO" value="price" />
                                            <ExcelColumn label="DESCUENTO" value="descount" />
                                            <ExcelColumn label="PRECIO FINAL" value="price_f" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="date_created" />
                                        </ExcelSheet>
                                    </ExcelFile>
                                ) : dataRetreats.type === 'debitos' ? (
                                    <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Debitos_Retiros_${dataCollaborator}_${today}`}>
                                        <ExcelSheet data={dataRetreats.retiro_debito} name={`Debitos_Retiros_${dataCollaborator}_${today}`}>
                                            <ExcelColumn label="NOMBRE" value="name" />
                                            <ExcelColumn label="DEUDA" value="total_debt" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="date_created" />
                                        </ExcelSheet>
                                    </ExcelFile>
                                ) : dataRetreats.type === 'Todos' ? (
                                    <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Retiros_${today}`}>
                                        <ExcelSheet data={dataRetreats.retiro} name={`Retiros_${dataCollaborator}_${today}`}>
                                            <ExcelColumn label="NOMBRE" value="name" />
                                            <ExcelColumn label="PRECIO" value="price" />
                                            <ExcelColumn label="DESCUENTO" value="descount" />
                                            <ExcelColumn label="PRECIO FINAL" value="price_f" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="date_created" />
                                        </ExcelSheet>
                                        <ExcelSheet data={dataRetreats.retiro_debito} name={`Debitos_Retiros_${dataCollaborator}_${today}`}>
                                            <ExcelColumn label="NOMBRE" value="name" />
                                            <ExcelColumn label="DEUDA" value="total_debt" />
                                            <ExcelColumn label="FECHA CREACIÓN" value="date_created" />
                                        </ExcelSheet>
                                    </ExcelFile>
                                ) : null
                            ) : model === 'payment_methods' ? (
                                <ExcelFile element={<Button className="btn text-white green" onClick={() => limpiar()}>Exportar a Excel</Button>} filename={`Metodos_Pago_${today}`}>
                                    <ExcelSheet data={dataPaymentMethods} name={`Metodos_Pago_${today}`}>
                                        <ExcelColumn label="VENTA DEL DÍA" value="sale_daily" />
                                        <ExcelColumn label="EFECTIVO EN QUETZALES" value="cash_quetzales" />
                                        <ExcelColumn label="EFECTIVO EN DOLARES (QUETZALES)" value="cash_dolares" />
                                        <ExcelColumn label="CREDOMATIC" value="credomatic" />
                                        <ExcelColumn label="VISA" value="visa" />
                                        <ExcelColumn label="VISA ONLINE" value="visaOnline" />
                                        <ExcelColumn label="VISA DOLARES" value="visaDolares" />
                                        <ExcelColumn label="MASTER CARD" value="masterCard" />
                                        <ExcelColumn label="CREDI CUOTAS" value="crediCuotas" />
                                        <ExcelColumn label="VISA CUOTAS" value="visaCuotas" />
                                        <ExcelColumn label="VALOR DE ENVÍO EFECTIVO" value="numb_send_cash_value" />
                                        <ExcelColumn label="LIFE MILES NÚMERO" value="lifeMilesNum" />
                                        <ExcelColumn label="LIFE MILES VALOR" value="lifeMilesVa" />
                                        <ExcelColumn label="EXTENCIÓN IVA" value="extIva" />
                                        <ExcelColumn label="LOYALTI" value="loyalty" />
                                        <ExcelColumn label="GASTOS AUTORIZADOS" value="Authorized_Expenditure_v" />
                                        <ExcelColumn label="RETIROS DE MERCADERÍA" value="retreats" />
                                        <ExcelColumn label="VENTA EN LINEA" value="total_on" />
                                        <ExcelColumn label="NOTA DE CREADITO" value="note_credit" />
                                        <ExcelColumn label="FALTANTE" value="diff" />
                                        <ExcelColumn label="CUADRE DE CAJA" value="box_square" />
                                        <ExcelColumn label="DIFERENCIA" value="diference" />
                                        <ExcelColumn label="VALOR CASHBACK" value="cashBackVa" />
                                        <ExcelColumn label="GIFTCARD" value="giftcard" />
                                        <ExcelColumn label="TIENDA" value="store_creat" />
                                        <ExcelColumn label="ENCARGADO" value="manager" />
                                        <ExcelColumn label="FECHA CREACIÓN" value="date_created" />
                                    </ExcelSheet>
                                </ExcelFile>
                            ) : null
                        )
                    }
                </MDBModalFooter>
            </MDBModal>
        </Layaout>
    )

}
export default Reports;