import React, { Component } from 'react'
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBBtn
} from 'mdbreact';
import Layaout from '../parcials/Layaout'

import './PageNotFound.css'

//Complements
import SectionContainer from '../../components/sectionContainer';

class PageNotFound extends Component {

	render() {
		return (
			<Layaout>
			<MDBContainer className='mt-5'>
				<SectionContainer noBorder>
					<MDBRow>
						<MDBCol className="card-login" md='6'>
							<div class="four_zero_four_bg">
								<h1 class="text-center ">404</h1>
							</div>
							<center>
							<div class="contant_box_404">
								<h3 class="h2">
									Ooops!
									</h3>
								<p>Esta página no está dsponible. Disculpa las molestias.</p>
								<p>Prueba a buscar otra cosa</p>
								<MDBBtn className="text-center" color="info">Regresar</MDBBtn>
							</div>
							</center>
						</MDBCol>
					</MDBRow>
				</SectionContainer>
			</MDBContainer>
			</Layaout>
		)
	}
}

export default PageNotFound