import React, { useEffect, useState } from 'react';
import NumericInput from 'react-numeric-input';
import { useHistory } from "react-router-dom";
//Librerias de diseño
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "react-datepicker/dist/react-datepicker.css";

import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBIcon,
    MDBCard,
    MDBCardBody
} from 'mdbreact';

//componentes
import Layaout from '../../parcials/Layaout';
import CardHeader from '../../../components/CardHeader'
import { getCollaboration } from '../../../functions/collaboratorFunction'
import Select from 'react-select';
import Swal from 'sweetalert2'
import Loading from './img/loading.gif'
//Funciones
import { confirmdataVendors, confirmdataInvoice, confirmdataMethodPayment, updateDataSales, validDataSales } from '../../../functions/salesFunctions'
import { getStore } from '../../../functions/ticketFunction'
import { salesShowById } from '../../../functions/salesFunctions'


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Datos de venta', 'Datos de vendedores', 'Facturación', 'Métodos de pago', 'Observaciones'];
}

const DatosdeventaUpdate = () => {
    const history = useHistory();
    //Stepper
    const [activeStep, setActiveStep] = useState(0);
    const [skipped] = useState(new Set());
    const [stepper, setStepper] = useState(null);
    const [stepperMessage, setStepperMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const steps = getSteps();

    //Hooks Datos formulario
    const [vendor, setVendor] = useState([]);
    const [vendorDescount, setVendorDescount] = useState([]);
    const [dataSales, setdataSales] = useState();
    const [startDate, setStartDate] = useState(null);
    const [store, setStore] = useState(null);
    //ApiRest datos de colaboradores
    const datos = [];

    getCollaboration().then((res) => { res.map(resdata => datos.push({ name: resdata.name, label: resdata.name })) });
    console.log(datos);
    //ApiRest datos de tienndas
    const datosTiendas = [];
    getStore().then((res) => { res.map(resdata => datosTiendas.push({ name: resdata.name, label: resdata.name })) });
    useEffect(() => {
        let data = { store: localStorage.getItem('store'), type: localStorage.getItem('type'), _id: localStorage.getItem('idBinnacleSale') }
        datosVentas(data);
    }, []);


    const datosVentas = async (datos) => {
        await salesShowById(datos)
            .then((res) => {
                console.log(res[0].date_created);
                setdataSales([{
                    id: res[0]._id,
                    venta_diaria: res[0].sale_daily,
                    no_personas: res[0].people_totals,
                    no_ventas: res[0].sales_totals,
                    meta: res[0].daily_goal,
                    venta_anterior: res[0].year_before_sale,
                    encargado: res[0].manager,
                    factoresDeVenta: res[0].fact,
                    facturas_sis_desde: res[0].fac_sis_to,
                    facturas_sis_hasta: res[0].fac_sis_from,
                    facturas_sis_total: res[0].total_sis,
                    facturas_man_desde: res[0].fac_man_from,
                    facturas_man_hasta: res[0].fac_man_to,
                    facturas_man_total: res[0].total_man,
                    facturas_cod_desde: res[0].fact_send_CE_from,
                    facturas_cod_hasta: res[0].fact_send_CE_to,
                    facturas_cod_total: res[0].fact_send_CEV,
                    facturas_nota_desde: res[0].fact_nt_c_f,
                    facturas_nota_hasta: res[0].fact_nt_c_to,
                    facturas_nota_total: res[0].fact_nt_c,
                    efectivoQuetzales: res[0].cash_quetzales,
                    efectivoQuetzalesDolares: res[0].cash_dolares,
                    credomatic: res[0].credomatic,
                    visa: res[0].visa,
                    visaOnline: res[0].visaOnline,
                    visaDolares: res[0].visaDolares,
                    masterCard: res[0].masterCard,
                    crediCuotas: res[0].credicuotas,
                    visaCuotas: res[0].visaCuotas,
                    valorEnvioEfectivo: res[0].numb_send_cash_value,
                    lifeMilesNumber: res[0].lifeMilesNum,
                    lifeMilesValor: res[0].lifeMilesVa,
                    exencionIva: res[0].extIva,
                    loyalty: res[0].loyalty,
                    gastosAutorizados: res[0].Authorized_Expenditure_v,
                    retirosMercaderia: res[0].retreats,
                    ventaEnLinea: res[0].total_on,
                    notaDeCredito: res[0].note_credit,
                    faltante: res[0].diff,
                    cuadreDeCaja: res[0].box_square,
                    diferencia: res[0].diference,
                    cashback: res[0].cashBackVa,
                    giftcard: res[0].giftcard,
                    observaciones: res[0].obs_method,
                    tienda: res[0].tienda
                }]);
                setLoading(false);
                setStore(res[0].store_creat);
                setStartDate(res[0].date_created);
                //pinta los vendedores
                const valuesVendors = [...vendor];
                res[0].vendors.map((field) => {
                    return valuesVendors.push({ nombre: field.name, venta: field.sale });
                });
                setVendor(valuesVendors);

                //pinta las notas de credito
                const valuesVendorsNotaCredito = [...vendor];
                res[0].vendorsDescount.map((field) => {
                    return valuesVendorsNotaCredito.push({ nombre: field.name, venta: field.sale });
                });
                setVendorDescount(valuesVendorsNotaCredito);

            }
            )
            .catch(err =>
                console.log(err)
            )
    }

    //Pinta datos en el stepper
    function getStepContent(stepIndex) {

        switch (stepIndex) {
            case 0:
                let userManager = dataSales[0].encargado === null ? 'Encargado' : dataSales[0].encargado
                const valueManager = { value: userManager, label: userManager };

                let storeManger = store;
                const valueStore = { value: storeManger, label: storeManger };
                return (
                    <>
                        <MDBRow>
                            {localStorage.getItem('change_date') === 'true' ? (

                                <MDBCol md='4' style={{ marginTop: "32px" }}>
                                    <Typography variant="body2">&nbsp;</Typography>
                                    <Select
                                        onChange={e => setStore(e.label)}
                                        value={valueStore}
                                        options={datosTiendas}
                                    />
                                </MDBCol>
                            ) : ''}
                            <MDBCol md='4' style={{ marginTop: "26px" }}>

                                <MDBInput
                                    type='date'
                                    className="form-control"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </MDBCol>
                        </MDBRow>


                        {stepper !== null ? <MDBCol md='12'>
                            <MDBCard color='red lighten-1' text='white' className='text-center'>
                                <MDBCardBody>
                                    {stepperMessage}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol> : ""}

                        <MDBRow style={{ justifyContent: "center", display: "flex" }}>
                            <MDBCol md='2'>
                                <Typography variant="body2">Venta Diaria</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].venta_diaria}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile
                                    onChange={e => handleChangeData(e, "venta_diaria", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">No. personas</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].no_personas}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "no_personas", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">No. Ventas</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].no_ventas}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "no_ventas", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Meta Diaria</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].meta}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "meta", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Venta Anterior</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].venta_anterior}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "venta_anterior", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2' style={{ marginTop: "26px" }}>
                                <Select
                                    onChange={e => handleChangeData(e, "encargado")}
                                    defaultValue={valueManager}
                                    options={datos}
                                />
                            </MDBCol>
                            <MDBCol md='12'>
                                <MDBInput
                                    type='textarea'
                                    rows='3'
                                    label='Factores clave que afectan el comercio'
                                    value={dataSales[0].factoresDeVenta} onChange={e => handleChangeData(e, "factoresDeVenta")}
                                />
                            </MDBCol>
                        </MDBRow>
                    </>
                );
            case 1:

                return (
                    <>
                        {stepper !== null ? <MDBCol md='12'>
                            <MDBCard color='red lighten-1' text='white' className='text-center'>
                                <MDBCardBody>
                                    {stepperMessage}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol> : ""}


                        <MDBCol md="8">
                            <Button color='primary' onClick={() => handleAdd()}><MDBIcon icon="plus" />Vendedor</Button>
                            <Button color='secondary' onClick={() => handleAddVendorsDesconunt()}><MDBIcon icon="plus" />Nota de credito Vendedor</Button>
                        </MDBCol>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            {vendor.map((field, idx) => {
                                let user = vendor[idx].nombre === null || vendor[idx].nombre === ' ' ? 'Vendedor' : vendor[idx].nombre
                                const valueVendor = { value: user, label: user };
                                return (
                                    <MDBCol md="6" key={`${field}-${idx}`}>
                                        <MDBRow style={{ justifyContent: "center", display: "flex" }}>
                                            <MDBCol md='6' style={{ marginTop: "26px" }}>
                                                <Select
                                                    onChange={e => handleChangeVendors(idx, e, "nombre")}
                                                    defaultValue={valueVendor}
                                                    options={datos}
                                                />
                                            </MDBCol>
                                            <MDBCol md='4'>
                                                <Typography variant="body2">total</Typography>
                                                <NumericInput
                                                    className="form-control"
                                                    value={vendor[idx].venta}
                                                    step={1}
                                                    precision={2}
                                                    size={2}
                                                    mobile
                                                    onChange={e => handleChangeVendors(idx, e, "venta", "number")}
                                                />
                                            </MDBCol>

                                            <MDBCol md='2' style={{ paddingLeft: "0px", paddingTop: "20px" }}>
                                                {idx !== 0 && (<MDBBtn size="sm" color='danger' onClick={() => handleRemove(idx)}>X</MDBBtn>)}
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCol>
                                )
                            })}
                        </MDBRow>
                        {vendorDescount.length > 0 ? <Typography variant="body2">Notas de crédito</Typography> : ""}
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>

                            {vendorDescount.map((field, idx) => {
                                let user = vendorDescount[idx].nombre === null || vendorDescount[idx].nombre === ' ' ? 'Vendedor' : vendorDescount[idx].nombre
                                const valueVendor = { value: user, label: user };
                                return (
                                    <MDBCol md="6" key={`${field}-${idx}`}>
                                        <MDBRow style={{ justifyContent: "center", display: "flex" }}>
                                            <MDBCol md='6' style={{ marginTop: "26px" }}>
                                                <Select
                                                    onChange={e => handleChangeVendorsDesconunt(idx, e, "nombre")}
                                                    defaultValue={valueVendor}
                                                    options={datos}
                                                />
                                            </MDBCol>
                                            <MDBCol md='4'>
                                                <Typography variant="body2">total</Typography>
                                                <NumericInput
                                                    className="form-control"
                                                    value={vendorDescount[idx].venta}
                                                    step={1}
                                                    precision={2}
                                                    size={2}
                                                    mobile
                                                    onChange={e => handleChangeVendorsDesconunt(idx, e, "venta", "number")}
                                                />
                                            </MDBCol>
                                            <MDBCol md='2' style={{ paddingLeft: "0px", paddingTop: "20px" }}>
                                                <MDBBtn size="sm" color='danger' onClick={() => handleRemoveVendorsDesconunt(idx)}>X</MDBBtn>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCol>
                                )
                            })}
                        </MDBRow>
                        <br></br>
                    </>
                );
            case 2:
                return (
                    <>
                        {stepper !== null ? <MDBCol md='12'>
                            <MDBCard color='red lighten-1' text='white' className='text-center'>
                                <MDBCardBody>
                                    {stepperMessage}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol> : ""}
                        <MDBRow style={{ justifyContent: "center", display: "flex" }}>
                            <MDBCol md='4'>
                                Factura De Sistema
                          </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Desde' type='text' value={dataSales[0].facturas_sis_desde} onChange={e => handleChangeData(e, "facturas_sis_desde")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Hasta' type='text' value={dataSales[0].facturas_sis_hasta} onChange={e => handleChangeData(e, "facturas_sis_hasta")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Total</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].facturas_sis_total}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "facturas_sis_total", "number")}
                                />
                            </MDBCol>

                            <MDBCol md='4'>
                                Factura Manual
                          </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Desde' type='text' value={dataSales[0].facturas_man_desde} onChange={e => handleChangeData(e, "facturas_man_desde")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Hasta' type='text' value={dataSales[0].facturas_man_hasta} onChange={e => handleChangeData(e, "facturas_man_hasta")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Total</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].facturas_man_total}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "facturas_man_total", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='4'>
                                Factura COD
                          </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Desde' type='text' value={dataSales[0].facturas_cod_desde} onChange={e => handleChangeData(e, "facturas_cod_desde")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Hasta' type='text' value={dataSales[0].facturas_cod_hasta} onChange={e => handleChangeData(e, "facturas_cod_hasta")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Total</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].facturas_cod_total}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "facturas_cod_total", "number")}
                                />
                            </MDBCol>

                            <MDBCol md='4'>
                                Notas De Crédito
                          </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Desde' type='text' value={dataSales[0].facturas_nota_desde} onChange={e => handleChangeData(e, "facturas_nota_desde")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <MDBInput label='Hasta' type='text' value={dataSales[0].facturas_nota_hasta} onChange={e => handleChangeData(e, "facturas_nota_hasta")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Total</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].facturas_nota_total}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "facturas_nota_total", "number")}
                                />
                            </MDBCol>
                        </MDBRow>
                    </>
                );
            case 3:
                return (
                    <>
                        {stepper !== null ? <MDBCol md='12'>
                            <MDBCard color='red lighten-1' text='white' className='text-center'>
                                <MDBCardBody>
                                    {stepperMessage}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol> : ""}
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            1. Efectivo
                      </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            <MDBCol md='3'>
                                <Typography variant="body2">Efectivo En Quetzáles</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].efectivoQuetzales}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "efectivoQuetzales", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='3'>
                                <Typography variant="body2">Efectivo En Doláres(Quetzáles)</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].efectivoQuetzalesDolares}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "efectivoQuetzalesDolares", "number")}
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            2. Tarjetas
                      </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            <MDBCol md='2'>
                                <Typography variant="body2">Credomatic</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].credomatic}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "credomatic", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Visa</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].visa}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "visa", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Visa Online</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].visaOnline}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "visaOnline", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Visa Doláres</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].visaDolares}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "visaDolares", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Master Card</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].masterCard}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "masterCard", "number")}
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            3. Cuota
                      </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            <MDBCol md='2'>
                                <Typography variant="body2">Credi Cuotas</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].crediCuotas}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "crediCuotas", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Visa Cuotas</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].visaCuotas}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "visaCuotas", "number")}
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            4. Envios
                      </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            <MDBCol md='2'>
                                <Typography variant="body2">Valor De Envio Efectivo</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].valorEnvioEfectivo}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "valorEnvioEfectivo", "number")}
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            5. Especiales
                      </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            <MDBCol md='2'>
                                <MDBInput label='Life Miles Número' type='text' value={dataSales[0].lifeMilesNumber} onChange={e => handleChangeData(e, "lifeMilesNumber")} />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Life Miles Valor</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].lifeMilesValor}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "lifeMilesValor", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Exención Iva</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].exencionIva}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "exencionIva", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Loyalty</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].loyalty}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "loyalty", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Gasto Autorizados Valor</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].gastosAutorizados}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "gastosAutorizados", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Retiros De Mercadería</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].retirosMercaderia}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "retirosMercaderia", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Venta En Línea Total</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].ventaEnLinea}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "ventaEnLinea", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Nota De Crédito</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].notaDeCredito}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "notaDeCredito", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Faltante</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].faltante}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "faltante", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Cuadre De Caja</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].cuadreDeCaja}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "cuadreDeCaja", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Diferencias</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].diferencia}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "diferencia", "number")}
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            6. Certificados
                      </MDBRow>
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            <MDBCol md='2'>
                                <Typography variant="body2">Valor Cashback</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].cashback}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "cashback", "number")}
                                />
                            </MDBCol>
                            <MDBCol md='2'>
                                <Typography variant="body2">Valor Gift Card</Typography>
                                <NumericInput
                                    className="form-control"
                                    value={dataSales[0].giftcard}
                                    step={1}
                                    precision={2}
                                    size={2}
                                    mobile

                                    onChange={e => handleChangeData(e, "giftcard", "number")}
                                />
                            </MDBCol>
                        </MDBRow>
                        <br></br>

                    </>
                );
            case 4:
                return (
                    <>
                        {stepper !== null ? <MDBCol md='12'>
                            <MDBCard color='red lighten-1' text='white' className='text-center'>
                                <MDBCardBody>
                                    {stepperMessage}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol> : ""}
                        <MDBRow style={{ justifyContent: "left", display: "flex" }}>
                            <MDBCol md='12'>
                                <MDBInput
                                    type='textarea'
                                    rows='3'
                                    label='Observaciones del día'
                                    value={dataSales[0].observaciones} onChange={e => handleChangeData(e, "observaciones")}
                                />
                            </MDBCol>
                        </MDBRow>
                    </>
                )
            default:
                return 'Ooooups! Este paso no existe';
        }
    }

    const handleNext = async () => {
        let pagNext = 1;
        switch (activeStep) {
            case 0:
                if (dataSales[0].encargado === null || dataSales[0].encargado === " ") {
                    setStepper(0)
                    setStepperMessage("Tienes que seleccionar un encargado para la tienda.")
                    Swal.fire('Error', 'Tienes que seleccionar un encargado para la tienda.', 'error');
                    pagNext = 0;
                } else {
                    await validDataSales(startDate, store, dataSales[0].encargado)
                        .then((res) => {
                            setStepper(null)
                            pagNext = 1;
                        })
                        .catch((err) => {
                            setStepper(0)
                            setStepperMessage("Hubo un problema técnico por comunicar a soporte técnico.")
                            pagNext = 0;
                        })

                }

                if (parseFloat(dataSales[0].venta_diaria) === 0) {
                    Swal.fire('Observación', '¿Está seguro que su venta del día fue 0?', 'info');
                }

                if (parseFloat(dataSales[0].venta_diaria) === null) {
                    Swal.fire('Error', 'No puedes dejar vacio el dato de venta diaria', 'info');
                    pagNext = 0;
                }

                if (startDate === null) {
                    Swal.fire('Error', 'No puedes dejar vacio el campo de fecha', 'info');
                    pagNext = 0;
                }

                if (localStorage.getItem('change_date') === 'true') {
                    if (store === null) {
                        Swal.fire('Error', 'No puedes dejar vacio la tienda', 'info');
                        pagNext = 0;
                    }
                }

                break;
            case 1:
                var validateVendorsempty = 0;
                vendor.map((res) => {
                    if (res.nombre === null) {
                        validateVendorsempty += 1
                    }
                    return validateVendorsempty;
                })

                vendorDescount.map((res) => {
                    if (res.nombre === null) {
                        validateVendorsempty += 1
                    }
                    return validateVendorsempty;
                })

                if (validateVendorsempty < 1) {

                    const vendorsValid = confirmdataVendors(vendor, vendorDescount, dataSales[0].venta_diaria)
                    if (vendorsValid.status) {
                        setStepper(null)
                        pagNext = 1;
                    } else {
                        setStepper(1)
                        setStepperMessage(vendorsValid.message)
                        pagNext = 0;
                    }
                } else {
                    setStepper(1)
                    setStepperMessage("No puedes dejar el nombre de un vendedor en blanco.")
                    pagNext = 0;
                }


                break;
            case 2:
                const invoiceValid = confirmdataInvoice(dataSales[0])
                if (invoiceValid.status) {
                    setStepper(null)
                    pagNext = 1;
                } else {
                    setStepper(2)
                    setStepperMessage(invoiceValid.message)
                    pagNext = 0;
                }
                break;
            case 3:
                const dataPayMethod = confirmdataMethodPayment(dataSales[0])
                if (dataPayMethod.status) {
                    setStepper(null)
                    pagNext = 1;
                } else {
                    setStepper(3)
                    setStepperMessage(dataPayMethod.message)
                    pagNext = 0;
                }
                break;
            case 4:
                updateDataSales(dataSales, vendor, vendorDescount, localStorage.getItem('email'), store, startDate)
                    .then((response) => {
                        if (response.status === true) {
                            setLoading(false)
                            Swal.fire('Felicitaciones!', response.message, 'success');
                            setStepper(null)
                            pagNext = 0;
                            history.push(`/bitacora_ventas_show`);
                        }

                        if (response.status === false) {
                            Swal.fire('Error', response.message, 'error');
                            pagNext = 0;
                            setStepper(5)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        setStepper(4)
                        setStepperMessage("Error, no se pudo crear su registro de dato de venta")
                        pagNext = 0;
                    })

                break;
            default:
        }
        setActiveStep((prevActiveStep) => prevActiveStep + pagNext);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleMenu = () => {
        history.push(`/bitacoras`);
    };

    function handleChangeVendors(i, event, name, type) {
        const values = [...vendor];
        if (type !== "number") {
            if (name === "nombre") {
                values[i][name] = event.label;
            } else if (event.target.value === "") {
                values[i][name] = null;
            } else {
                values[i][name] = event.target.value;
            }
        } else {
            values[i][name] = event
        }

        setVendor(values);
    }

    function handleAdd() {
        if (vendor.length <= 8) {
            const values = [...vendor];
            values.push({ nombre: null, venta: 0 });
            setVendor(values);
        } else {
            alert("Se alconzó el limite vendedores")
        }
    }

    function handleRemove(i) {
        if (i !== 0) {
            const values = [...vendor];
            values.splice(i, 1);
            setVendor(values);
        }
    }

    function handleChangeVendorsDesconunt(i, event, name, type) {
        const values = [...vendorDescount];
        if (type !== "number") {
            if (name === "nombre") {
                values[i][name] = event.label;
            } else if (event.target.value === "") {
                values[i][name] = null;
            } else {
                values[i][name] = event.target.value;
            }
        } else {
            values[i][name] = event
        }
        setVendorDescount(values);
    }

    function handleAddVendorsDesconunt() {
        if (vendorDescount.length <= 8) {
            const values = [...vendorDescount];
            values.push({ nombre: null, venta: 0 });
            setVendorDescount(values);
        } else {
            alert("Se alconzó el limite vendedores")
        }
    }

    function handleRemoveVendorsDesconunt(i) {
        const values = [...vendorDescount];
        values.splice(i, 1);
        setVendorDescount(values);
    }

    function handleChangeData(event, name, type) {
        const values = [...dataSales];
        if (type !== "number") {
            if (name === "encargado") {
                values[0][name] = event.label;
            } else if (event.target.value === "") {
                values[0][name] = null;
            } else {
                values[0][name] = event.target.value;
            }
            setdataSales(values);
        } else {
            if (event === null) {
                Swal.fire('Error', 'No puedes dejar el valor en blanco', 'info');
                values[0][name] = 0
            } else {
                values[0][name] = event
            }
        }
    }

    const isStepFailed = (step) => {
        return step === stepper;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const isStepOptional = (step) => {
        return step === stepper;
    };

    if (localStorage.getItem('session') !== "true") {
        history.push(`/`);
    }

    return (
        <Layaout>
            <br></br>
            <CardHeader title="Venta Diaria Actualización" icon="ticket-alt">
                <div className={classes.root}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = (
                                    <Typography variant="caption" color="error">
                                    </Typography>
                                );
                            }
                            if (isStepFailed(index)) {
                                labelProps.error = true;
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div>
                        {activeStep === steps.length ? (
                            <div>
                                { loading ?
                                    (<center> <img
                                        alt='Preload'
                                        className='img-fluid'
                                        src={Loading}
                                    /></center>)
                                    : (<Button onClick={handleMenu}>Regresar a menu</Button>)}
                            </div>
                        ) :
                            loading ?
                                (<center> <img
                                    alt='Preload'
                                    className='img-fluid'
                                    src={Loading}
                                /></center>) : (
                                    <div>
                                        <Typography className={classes.instructions} component={'span'} variant={'body2'}>{getStepContent(activeStep)}</Typography>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                className={classes.backButton}
                                            >
                                                Regresar
                                        </Button>
                                            <Button variant="contained" color="primary" onClick={handleNext}>
                                                {activeStep === steps.length - 1 ? 'Terminar' : 'Siguente'}
                                            </Button>
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                </div>

            </CardHeader>
        </Layaout>
    )
}

export default DatosdeventaUpdate;