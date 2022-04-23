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

const CertificatesPage = () => {

    return (
        <Layaout>

            <MDBAnimation type='zoomIn' duration='500ms'>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md='8' className='mt-3 mx-auto'>
                            <MDBJumbotron>
                                <h1 className='text-center'>
                                    <MDBIcon icon='window-restore' className='mr-2 indigo-text' />
                                    Certificados
                                </h1>
                                <ul className='list-unstyled example-components-list'>
                                    {
                                        localStorage.getItem('type') === 'admin' && (
                                            <MenuLink to='/certificate/new_certificate' title='Nuevo Certificado' />
                                        )
                                    }
                                    <MenuLink to='/certificate/redeem_certificate' title='Canjear Certificado' />
                                    <MenuLink to='/certificate/history' title='Historico de Certificado' />
                                </ul>
                            </MDBJumbotron>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBAnimation>
        </Layaout>
    )
}

export default CertificatesPage