import React, { Component } from 'react';
import {
  MDBFooter
} from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='flyout'>
          <main style={{ marginTop: '4rem' }}>
            <Routes />
          </main>
          
          <MDBFooter color='indigo' style={{marginTop: '30px'}}>
            <p className='footer-copyright mb-0 py-3 text-center' style={{ color: 'white'}}>
              &copy; {new Date().getFullYear()} Copyright:
              Corpinto S. A.
            </p>
          </MDBFooter>
        </div>
      </Router>
    );
  }
}

export default App;
