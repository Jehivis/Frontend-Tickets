import React from 'react';
import {
    MDBCard,
    MDBCardBody,
    MDBContainer,
    MDBCardTitle
} from 'mdbreact';

export default function CardHeader(props) {
    return (
        <React.Fragment>
            <MDBContainer>
                <MDBCard>
                    <MDBCardTitle className="center-element" style={{paddingTop: "10px"}}><b>{props.title}</b></MDBCardTitle>
                    <MDBCardBody className="center">
                        {props.children}
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </React.Fragment>
    )
}