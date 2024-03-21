import React from 'react';
import Header from './header';
import { Link } from 'react-router-dom';


function WelcomeScreen() {
    return (
      <div className='container-content'>
         <Header />
        <div className="container-welcome shadow p-3">
        <Link to="/list" className="btn btn-secondary" id='btn-welcome-screen-go-to-user-list'>Ir al listado de MusiColabors</Link>
          <h1>bienvenido</h1>
        </div>
       </div>
    );
  }
  
  export default WelcomeScreen;