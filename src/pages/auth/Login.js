import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import Swal from 'sweetalert2'
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn
} from 'mdbreact';

//Complements
import SectionContainer from '../../components/sectionContainer';
import Layaout from '../parcials/Layaout'
//Css
import './Login.css'

//Functions
import { login,login_google } from '../../functions/UserFunctions';
import { getOneStore } from '../../functions/settingsFunction'
const Login = () => {
    
    const clientId = process.env.REACT_APP_GOOGLE_ID;

    const history = useHistory();
    const [user, setUser] = useState();
    const [password, setPassword] = useState();

    const _Login = () => {

        const userData = {
            user: user,
            password: password
        }

        login(userData).then(res => {
            if (res.error === 1) {
                Swal.fire('Oops...', res.message, 'error');
            } else {
                getOneStore(res.response.data.user.store).then((resp) => {
                    localStorage.setItem('subsidiaria', resp.sbs);
                    history.push(`/bitacoras`);
                });
            }
        })
    }

    const initLogin = e =>{
        const key = e.key;
        if(key === 'Enter'){
            _Login();
        }
    }

    const onChangeUser = e => {
        setUser(e.target.value);
    }

    const onChangePassword = e => {
        setPassword(e.target.value);
    }

    const responseGoogle = (response) => {
        
        if(typeof response.profileObj !== "undefined"){
            const userData = {
                email: response.profileObj.email,
            }

            login_google(userData).then(res => {
                if (res.error === 1) {
                    Swal.fire('Oops...', res.message, 'error');
                } else {
                    getOneStore(res.store).then((resp) => {
                        localStorage.setItem('subsidiaria', resp.sbs);
                        history.push(`/bitacoras`);
                    });
                }
            })
        }else{
            Swal.fire('Oops... Tenemos problemas con google','prueba con el login normal o informa a IT', 'error');
        }
      }

    if (localStorage.getItem('session')) {
        history.push(`/bitacoras`);
    }

    return (
        <Layaout>
            <MDBContainer className='mt-5'>
                <SectionContainer noBorder>
                    <MDBRow>
                        <MDBCol className="card-login" md='6'>
                            <SectionContainer>
                                <form>
                                    <p className='h5 text-center mb-4'>Iniciar Sesión</p>
                                    <div className='grey-text'>
                                        <MDBInput
                                            label='Ingrese usuario'
                                            icon='user'
                                            group
                                            type='text'
                                            validate
                                            error='wrong'
                                            success='right'
                                            name='user'
                                            onChange={onChangeUser}
                                        />
                                        <MDBInput
                                            label='Ingrese Contraseña'
                                            icon='lock'
                                            group
                                            type='password'
                                            name='password'
                                            onKeyDown={initLogin}
                                            onChange={onChangePassword}
                                            validate
                                        />
                                    </div>
                                    <div className='text-center'>
                                        <MDBBtn color="info" onClick={() => _Login()}>Ingresar</MDBBtn>
                                        <GoogleLogin
                                            className="btn-google"
                                            clientId={clientId}
                                            buttonText="Ingresar"
                                            onSuccess={(e) => responseGoogle(e)}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </div>
                                </form>
                            </SectionContainer>
                        </MDBCol>
                    </MDBRow>
                </SectionContainer>
            </MDBContainer>
            </Layaout>
    )
}

export default Login