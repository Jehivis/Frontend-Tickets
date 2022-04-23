import React from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBJumbotron,
    MDBIcon,
    MDBAnimation
} from 'mdbreact';
import MenuLink from '../../components/menuLink';
import Layaout from '../parcials/Layaout'

const TicketsPage = () => {

    return (
        <Layaout>

            <MDBAnimation type='zoomIn' duration='500ms'>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md='8' className='mt-3 mx-auto'>
                            <MDBJumbotron>
                                <h1 className='text-center'>
                                    <MDBIcon icon='window-restore' className='mr-2 indigo-text' />
                                    Tickets
                                </h1>
                                <ul className='list-unstyled example-components-list'>
                                    <MenuLink to='/tickets/system_transfer' title='Traslado de Sistema' />
                                    <MenuLink to='/tickets/Immediate_delivery' title='Entregas Inmediatas' />
                                    <MenuLink to='/tickets/external_retreats' title='Retiros Externos' />
                                    <MenuLink to='/tickets/photo_retreats' title='Retiros Fotografía' />
                                    <MenuLink to='/tickets/history' title='Histórico Tickets' />
                                </ul>
                            </MDBJumbotron>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBAnimation>
        </Layaout>
    )
}

export default TicketsPage