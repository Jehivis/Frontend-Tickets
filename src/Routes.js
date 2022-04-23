import React from 'react';
import { Route, Switch } from 'react-router-dom';

//Mis rutas
import Login from './pages/auth/Login';
import PageNotFound from './pages/404/PageNotFound';

//Bitacoras
import Landing_Bitacoras from './pages/bitacoras/Landing';
import BitacoraVenta from './pages/bitacoras/ventadiaria/Ventadiaria';
import Datosdeventa from './pages/bitacoras/ventadiaria/Datosdeventa';
import DatosdeventaUpdate from './pages/bitacoras/ventadiaria/DatosdeventaUpdate';
import Datosdeejecucion from './pages/bitacoras/ejecucion/bitacoraEjecucion'

//Tickets
import TicketsPage from './pages/tickets/TicketsPage';
import TransferSystemPage from './pages/tickets/TicketTransfer/TransferSystemPage';
import ImmediateDelivery from './pages/tickets/ImmediateDelivery/ImmediateDelivery';
import TicketsPhotoRetreats from './pages/tickets/TicketsPhoto/TiketsPhotoRetreats';
import ExternalRetreats from './pages/tickets/ExternalRetreats/ExternalRetreats';
import HistoryTickets from './pages/tickets/HistoryTickets/HistoryTickets';
//DamagedMerchandise
import DamagedMerchandise from './pages/damagedMerchandise/damagedMerchandise';

//Certificates
import CertificatesPage from './pages/certificates/CertificatesPage';
import NewCertificate from './pages/certificates/NewCertificates';
import RedeemCertificate from './pages/certificates/RedeemCertificate';
import HistoryCertificate from './pages/certificates/CertificadoHistory';

//Retiros
import Retreats from './pages/retiros/retiros';
import RetreatsForm from './pages/retiros/form/retiros_form';
import RetreatsBitacora from './pages/retiros/tables/form_bitacora';
import RetreatsBitacoraList from './pages/retiros/tables/tableList';
import RetreatsHistory from './pages/retiros/historial/tableList';

//Reports
import Reports from './pages/reports/reports';

//Settings
import Settings from './pages/setting/Settings';
import StatesList from './pages/setting/catalogos/states/Datos';
import CollaboratosList from './pages/setting/catalogos/collaboration/Datos';
import Users from './pages/setting/catalogos/users/Datos';
import SubsidiariasList from './pages/setting/catalogos/subsidiarias/Datos';
import StoreList from './pages/setting/catalogos/stores/Datos';
import EmailsList from './pages/setting/catalogos/emails/Datos';
import TemplateList from './pages/setting/catalogos/templates/Datos';

class Routes extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/bitacoras' component={Landing_Bitacoras} />
        <Route exact path='/bitacora_ventas_diarias' component={BitacoraVenta} />
        <Route exact path='/bitacora_ventas_show' component={Datosdeventa} />
        <Route exact path='/bitacora_ventas_update' component={DatosdeventaUpdate} />
        <Route exact path='/bitacora_ejecucion' component={Datosdeejecucion} />

        <Route exact path='/tickets' component={TicketsPage} />
        <Route exact path='/tickets/system_transfer' component={TransferSystemPage} />
        <Route exact path='/tickets/Immediate_delivery' component={ImmediateDelivery} />
        <Route exact path='/tickets/photo_retreats' component={TicketsPhotoRetreats} />
        <Route exact path='/tickets/external_retreats' component={ExternalRetreats} />
        <Route exact path='/tickets/history' component={HistoryTickets} />

        <Route exact path='/damaged_merchandise' component={DamagedMerchandise} />

        <Route exact path='/certificates' component={CertificatesPage} />
        <Route exact path='/certificate/new_certificate' component={NewCertificate} />
        <Route exact path='/certificate/redeem_certificate' component={RedeemCertificate} />
        <Route exact path='/certificate/history' component={HistoryCertificate} />

        <Route exact path='/retreats' component={Retreats} />
        <Route exact path='/retreats_form' component={RetreatsForm} />
        <Route exact path='/retreats_bitacoras' component={RetreatsBitacora} />
        <Route exact path='/retreats_bitacoras_list' component={RetreatsBitacoraList} />
        <Route exact path='/retreats_history' component={RetreatsHistory} />

        <Route exact path="/reports" component={Reports} />

        <Route exact path='/settingsList' component={Settings} />
        <Route exact path='/stateList' component={StatesList} />
        <Route exact path='/collaborationList' component={CollaboratosList} />
        <Route exact path='/usersList' component={Users} />
        <Route exact path='/subsidiarias' component={SubsidiariasList} />
        <Route exact path='/stores' component={StoreList} />
        <Route exact path='/emails' component={EmailsList} />
        <Route exact path='/templates' component={TemplateList} />


        <Route component={PageNotFound} />
      </Switch>
    );
  }
}

export default Routes;
