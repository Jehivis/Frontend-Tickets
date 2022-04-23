import React from 'react';
import { useHistory } from "react-router-dom";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBJumbotron,
    MDBIcon,
    MDBAnimation
} from 'mdbreact';
import MenuLink from '../../components/menuLink';

import Layaout from '../parcials/Layaout';


const Landing = () => {
    const history = useHistory();

    if (localStorage.getItem('session') !== "true") {
        history.push(`/`);
    }

    return (
        <Layaout>

            <MDBAnimation type='zoomIn' duration='500ms'>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md='8' className='mt-3 mx-auto'>
                            <MDBJumbotron>
                                <h1 className='text-center'>
                                    <MDBIcon icon='window-restore' className='mr-2 indigo-text' />
                                    Bitácoras
                                </h1>
                                <ul className='list-unstyled example-components-list'>
                                    <MenuLink to='/bitacora_ejecucion' title='Bitácora Ejecución' />
                                    <MenuLink to='/bitacora_ventas_diarias' title='Bitácora Venta Diaria' />
                                    <MenuLink to='/bitacora_ventas_show' title='Mis Datos de Venta' />
                                </ul>
                            </MDBJumbotron>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBAnimation>
        </Layaout>
    )
}

export default Landing