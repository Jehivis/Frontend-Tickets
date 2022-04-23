import axios from 'axios'
import moment from 'moment-timezone';
import momentAdd from 'moment';
const url = process.env.REACT_APP_URL_BASE;

/*Muestra los datos de venta buscados por _id*/
export const salesShowById = (store) => {

    return axios
        .post(url + '/binnacles/sales_show_by_id', store)
        .then((response) => {
            return response.data.salesNew;
        })
        .catch((error) => {
            console.log(error);
        })

}

/*Muestra los datos de venta*/
export const salesShow = (store) => {
    return axios
        .post(url + '/binnacles/sales_show', store)
        .then((response) => {
            return response.data.dataStore;
        })
        .catch((error) => {
            console.log(error);
        })

}
//Valida si tiene un dato de venta ingresado este dia
export const validDataSales = async (dateStart, storeStart, manager) => {

    let StoreDefault
    if (storeStart) {
        StoreDefault = storeStart;
    } else {
        StoreDefault = localStorage.getItem('store');
    }

    let data = { dateStart, StoreDefault, manager }
    return axios
        .post(`${url}/sales/validationDataSale`, data)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error;
        })

}

/*Vlida los datos de vendedores*/
export const confirmdataVendors = (vendors, vendorDescount, sale) => {
    var totalVendors = 0;
    var totalDesconuntVendors = 0;
    var totalFinanVendors = 0
    var message = ""
    var status = ""
    //Venta de vendedores
    vendors.map(res => totalVendors += parseFloat(res.venta) === ' ' ? 0 : parseFloat(res.venta))
    //Descuento que se le hace a los vendedores encaso un cliente devuelva el producto que compro
    vendorDescount.map(resp => totalDesconuntVendors += parseFloat(resp.venta) === ' ' ? 0 : parseFloat(resp.venta))

    totalFinanVendors = totalVendors.toFixed(2) - totalDesconuntVendors.toFixed(2);

    if (parseFloat(totalFinanVendors.toFixed(2)) === parseFloat(sale.toFixed(2))) {
        message = ""
        status = true
    } else {
        message = "Los datos ingresados no cuadran, datos de vendedores es: " + parseFloat(totalFinanVendors.toFixed(2)) + " y la venta ingresada es: " + sale;
        status = false
    }
    return { message: message, status: status }
}
/*valida la data de las facturas*/
export const confirmdataInvoice = (sale) => {
    var totalInvoice_sis_total = 0
    var totalInvoice_man_total = 0
    var totalInvoice_cod_total = 0
    var totalInvoice_nota_total = 0
    var total = 0
    var message = ""
    var status = ""

    totalInvoice_sis_total += parseFloat(sale.facturas_sis_total.toFixed(2)) === ' ' ? 0 : parseFloat(sale.facturas_sis_total.toFixed(2))
    totalInvoice_man_total += parseFloat(sale.facturas_man_total.toFixed(2)) === ' ' ? 0 : parseFloat(sale.facturas_man_total.toFixed(2))
    totalInvoice_cod_total += parseFloat(sale.facturas_cod_total.toFixed(2)) === ' ' ? 0 : parseFloat(sale.facturas_cod_total.toFixed(2))
    totalInvoice_nota_total += parseFloat(sale.facturas_nota_total.toFixed(2)) === ' ' ? 0 : parseFloat(sale.facturas_nota_total.toFixed(2))


    total = (parseFloat(totalInvoice_sis_total.toFixed(2)) + parseFloat(totalInvoice_man_total.toFixed(2)) + parseFloat(totalInvoice_cod_total.toFixed(2))) - parseFloat(totalInvoice_nota_total.toFixed(2))
    if (parseFloat(total.toFixed(2)) === parseFloat(sale.venta_diaria.toFixed(2))) {
        message = ""
        status = true
    } else {
        message = "Los datos ingresados no cuadran, datos de facturación son: " + total + " y la venta ingresada es: " + sale.venta_diaria
        status = false
    }

    return { message: message, status: status }

}
/*valida la data de los metodos de pago*/
export const confirmdataMethodPayment = (sale) => {
    var message = ""
    var status = false
    var saleTotalDay = 0
    var saleTotalDayDescounst = 0
    var totalDay = 0

    //efectivo
    saleTotalDay += parseFloat(sale.efectivoQuetzales.toFixed(2)) +
        parseFloat(sale.efectivoQuetzalesDolares.toFixed(2)) +
        //Tarjetas
        parseFloat(sale.credomatic.toFixed(2)) +
        parseFloat(sale.visa.toFixed(2)) +
        parseFloat(sale.visaOnline.toFixed(2)) +
        parseFloat(sale.visaDolares.toFixed(2)) +
        parseFloat(sale.masterCard.toFixed(2)) +
        //Cuotas
        parseFloat(sale.crediCuotas.toFixed(2)) +
        parseFloat(sale.visaCuotas.toFixed(2)) +
        //Envios
        parseFloat(sale.valorEnvioEfectivo.toFixed(2)) +
        //Especiales
        parseFloat(sale.lifeMilesValor.toFixed(2)) +
        parseFloat(sale.exencionIva.toFixed(2)) +
        parseFloat(sale.loyalty.toFixed(2)) +
        parseFloat(sale.gastosAutorizados.toFixed(2)) +
        parseFloat(sale.retirosMercaderia.toFixed(2)) +
        parseFloat(sale.ventaEnLinea.toFixed(2)) +
        parseFloat(sale.cuadreDeCaja.toFixed(2)) +
        //Certificados
        parseFloat(sale.cashback.toFixed(2)) +
        parseFloat(sale.giftcard.toFixed(2))

    // Son los campos negativos que se tienen dentro de la venta del dia para cuadrar el total

    saleTotalDayDescounst +=
        parseFloat(sale.faltante.toFixed(2)) +
        parseFloat(sale.diferencia.toFixed(2)) +
        parseFloat(sale.notaDeCredito.toFixed(2))

    totalDay = parseFloat(saleTotalDay.toFixed(2)) - parseFloat(saleTotalDayDescounst.toFixed(2))

    if (parseFloat(totalDay.toFixed(2)) === parseFloat(sale.venta_diaria.toFixed(2))) {
        message = ""
        status = true
    } else {
        message = "Los datos ingresados no cuadran, metodos de pago ingresados da: " + totalDay + " y la venta ingresada es: " + sale.venta_diaria
        status = false
    }

    return { message: message, status: status }


}
//Crea el dato de venta del dia
export const createDataSales = async (sales, vendors, vendorsDescount, email, dataStore, dateStore) => {

    let store = localStorage.getItem('store')
    var storeDefault, dateStoreDefault;

    if (dataStore) {
        storeDefault = dataStore;
    } else {
        storeDefault = store;
    }
    if (dateStore) {

        dateStoreDefault = dateStore;
    } else {
        dateStoreDefault = null;

    }

    let data = { sales, vendors, vendorsDescount, email, storeDefault, dateStoreDefault }

    return axios
        .post(`${url}/sales/create`, data)
        .then((response) => {
            return response.data

        })
        .catch((error) => {
            console.error(error);
        })
}

//Update dato de venta del dia
export const updateDataSales = async (sales, vendors, vendorsDescount, email, dataStore, dateStore) => {

    let store = localStorage.getItem('store')
    var storeDefault, dateStoreDefault;

    if (dataStore) {
        storeDefault = dataStore;
    } else {
        storeDefault = store;
    }
    if (dateStore) {

        dateStoreDefault = dateStore;
    } else {
        dateStoreDefault = null;

    }

    let data = { sales, vendors, vendorsDescount, email, storeDefault, dateStoreDefault }

    return axios
        .post(`${url}/sales/update`, data)
        .then((response) => {
            return response.data

        })
        .catch((error) => {
            console.error(error);
        })
}

//Elimina dato
export const deleteDataSales = async (id) => {
    let data = { "id": id }
    return axios
        .post(`${url}/sales/delete`, data)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error(error);
        })
}


/*
Bitacora de Ejecucion
*/
export const binacleEjectionShow = (store) => {

    let data = { "store": store }
    return axios
        .post(url + '/binnacles_dailies/show', data)
        .then((response) => {
            return response.data.binnacleDailies;
        })
        .catch((error) => {
            console.log(error);
        })

}

//Crea Bitacora de Ejecucion
export const createBinacleEjection = async (dataBi) => {

    let store = localStorage.getItem('store')
    let data = { dataBi, store }

    return axios
        .post(`${url}/binnacles_dailies/created`, data)
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.error(error);
        })
}
//Eliminar bitacora
export const deletebinacleEjection = async (id) => {
    let data = { "id": id }
    return axios
        .post(`${url}/binnacles_dailies/delete`, data)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene los datos de venta diaria para el reporte*/
export const getDataReportSales = (date_start, date_end, store = false) => {
    let data = store !== null ? (
        { store: store, role: localStorage.getItem("type") }
    ) : ({ role: localStorage.getItem("type") })
    return axios
        .post(`${url}/sales/report/${date_start}/${date_end}`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene los datos de metodos de pago de venta diaria para el reporte*/
export const getDataReportSalesPaymentMethods = (date_start, date_end, store = false) => {
    let data = store !== null ? (
        { store: store==='Todas'?localStorage.getItem('store'):store, role: localStorage.getItem("type") }
    ) : ({ role: localStorage.getItem("type") })
    return axios
        .post(`${url}/sales/payment_methods/report/${date_start}/${date_end}`, data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}

/* Obtiene los datos de bitacora de ejecucion para el reporte*/
export const getDataReportDailies = (date_start, date_end, store = null) => {
    let data = store !== null ? (
        { store: store, role: localStorage.getItem("type") }
    ) : ({ role: localStorage.getItem("type") })
    return axios
        .post(`${url}/binnacles_dailies/report/${date_start}/${date_end}`, data)
        .then((response) => {
            console.log(response)
            return response;
        })
        .catch((error) => {
            console.error(error);
        })
}
