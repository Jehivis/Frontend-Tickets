import React from 'react';
import { MDBPagination, MDBPageItem, MDBPageNav, MDBContainer } from "mdbreact";

const ModalReportes = ({ showModal, toggle, dateStart, dateEnd }) => {

  return ( 
    <MDBModal isOpen={showModal} toggle={toggle}>
        <MDBModalHeader toggle={toggle}>Exportar a Excel</MDBModalHeader>
        <MDBModalBody>
            <MDBRow>
                <MDBCol md='6'>
                    <MDBInput
                        value={dateStart}
                        onChange={(e) => { setDateStart(e.target.value.replace("/","-").replace("/","-")) }}
                        label='Fecha Inicial'
                        type='date'
                        validate
                    />
                </MDBCol>
                <MDBCol md='6'>
                    <MDBInput
                        value={dateEnd}
                        onChange={(e) => { setDateEnd(e.target.value.replace("/","-").replace("/","-")) }}
                        label='Fecha Final'
                        type='date'
                        validate
                    />
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol md="10" className="offset-1">
                <MDBTypography>Tienda</MDBTypography>
                    <Select
                        onChange={e => setDataStore(e.value)}
                        defaultValue={defaultStore}
                        options={stores}
                    />
                </MDBCol>
            </MDBRow>
        </MDBModalBody>
        <MDBModalFooter>
            <Button className="text-white red" onClick={() => toggle()}><span> Cancelar</span></Button>
            {
                dataDamagedMerchandise.length < 1?(
                    <Button className="btn text-white green" style={{marginLeft: "10px"}} onClick={() => reload_data(model) }>Exportar a Excel</Button>
                ):(
                    <JsonToExcel
                        data={dataDamagedMerchandise}
                        className='btn text-white green'
                        filename='test'
                        fields={{
                            'damage':'DAÑO',
                            'upc':'UPC',
                            'alu':'ALU',
                            'siz': 'TALLA'
                        }}
                        text={'Descargar'}
                        style={{
                            'fontSize': '0.875rem',
                            'minWidth': '64px',
                            'boxSizing': 'border-box',
                            'transition': 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                            'fontFamily': '"Roboto", "Helvetica", "Arial", sans-serif',
                            'fontWeight': '500',
                            'lineHeight': '1.75',
                            'borderRadius': '4px',
                            'letterSpacing': '0.02857em',
                            'textTransform': 'uppercase',
                            'padding': '6px 8px 6px 8px'

                        }}
                    />
                )
            }
        </MDBModalFooter>
    </MDBModal>
  );
};

export default ModalReportes;