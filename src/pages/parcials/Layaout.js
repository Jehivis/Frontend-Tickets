import React, { Component } from 'react'
import { ReactComponent as Logo } from '../../assets/corpinto.svg';
import './Layaout.css'
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBNavLink,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from 'mdbreact';

class Navbar extends Component {


  state = {
    collapseID: ''
  };


  _logOut = () => {
    localStorage.clear();
  }

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ''
    })
    );

  closeCollapse = collID => () => {
    const { collapseID } = this.state;
    window.scrollTo(0, 0);
    collapseID === collID && this.setState({ collapseID: '' });
  };

  render() {
    const overlay = (
      <div
        id='sidenav-overlay'
        style={{ backgroundColor: 'transparent' }}
        onClick={this.toggleCollapse('mainNavbarCollapse')}
      />
    );


    const { collapseID } = this.state;
    return (
      <>
        <MDBNavbar color='indigo' dark expand='md' fixed='top' scrolling>
          <MDBNavbarBrand href='/' className='py-0 font-weight-bold'>
            <Logo style={{ height: '2.5rem', width: '2.5rem' }} />
            <strong className='align-middle'>Corpinto</strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler
            onClick={this.toggleCollapse('mainNavbarCollapse')}
          />

          <MDBCollapse id='mainNavbarCollapse' isOpen={collapseID} navbar >

            <MDBNavbarNav right className={localStorage.getItem('session')?"visibility_navbar":"visibility_navbar_none"}>

              <MDBNavItem>
                <MDBNavLink
                  exact
                  to='/bitacoras'
                  onClick={this.closeCollapse('mainNavbarCollapse')}
                >
                  <strong>Bitácoras</strong>
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  exact
                  to='/tickets'
                  onClick={this.closeCollapse('mainNavbarCollapse')}
                >
                  <strong>Tickets</strong>
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  exact
                  to='/damaged_merchandise'
                  onClick={this.closeCollapse('mainNavbarCollapse')}
                >
                  <strong>Mercadería Dañada</strong>
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  exact
                  to='/certificates'
                  onClick={this.closeCollapse('mainNavbarCollapse')}
                >
                  <strong>Certificados</strong>
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  exact
                  to='/retreats'
                  onClick={this.closeCollapse('mainNavbarCollapse')}
                >
                  <strong>Retiros</strong>
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  exact
                  to='/reports'
                  onClick={this.closeCollapse('mainNavbarCollapse')}
                >
                  <strong>Reportería</strong>
                </MDBNavLink>
              </MDBNavItem>
              {localStorage.getItem('type') === "admin"? (
              <MDBNavItem>
                <MDBNavLink
                  exact
                  to='/settingsList'
                  onClick={this.closeCollapse('mainNavbarCollapse')}
                >
                  <strong>Configuraciones</strong>
                </MDBNavLink>
              </MDBNavItem>
              ):""}
              <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                    <MDBIcon icon='user' className='mr-1' />
                        Perfil
                      </MDBDropdownToggle>
                  <MDBDropdownMenu className='dropdown-default' right>
                    <MDBDropdownItem href='#!'>Mi cuenta</MDBDropdownItem>
                    <MDBDropdownItem href='/' onClick={this._logOut}>Salir</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
        {collapseID && overlay}
        {this.props.children}
      </>
    );
  }
}

export default Navbar;