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

    if (localStorage.getItem('type') !== "admin") {
        history.push(`/retreats`);
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
                                    Configuraciones
                                </h1>
                                <ul className='list-unstyled example-components-list'>
                                    <MenuLink to='/stateList' title='Estados' />
                                    <MenuLink to='/collaborationList' title='Colaboradores' />
                                    <MenuLink to='/usersList' title='Usuario' />
                                    <MenuLink to='/subsidiarias' title='Subsidiarias' />
                                    <MenuLink to='/stores' title='Tiendas' />
                                    <MenuLink to='/emails' title='Emails de correos' />
                                    <MenuLink to='/templates' title='Plantillas' />
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