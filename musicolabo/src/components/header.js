import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import '../styles/header.css';

const Header = () => {
  const { handleLogout, loggedIn, picture, unreadMessages } = useContext(MusiColaboContext);

   
  return (
    <div className='container-header'>
      <div className='row-header'>
        <div className='col col-redes'>
          <FaInstagram /> <FaFacebook />
        </div>
        <div className=' col col-logo'>
          <div className='musicolabo-logo'> 
            <h1 className='logo-ini-text'>MC</h1>
          </div>
            <h1 className='logo-text'>MusiColabo</h1>
        </div>
        <div className=' col col-buttons-header'>
          {loggedIn ? (
            <div className='container-user-logged-header'>
            <Link to="/" onClick={handleLogout} className="btn btn-secondary btn-sm" id='btn-header-logout'>Salir</Link>
            <div className='userlogged'>
              <img src={picture} className='picture-header' alt="Imagen de perfil" />
            </div>
            <div className='container--mensajes-no-leidos'> 
              {unreadMessages > 0 && 
                <Link to="/messages" className="unread-messages-header">
                  <h6 className='unread-text'>{unreadMessages} mensaje(s) nuevo(s).</h6>
                </Link>}              
            </div>
          </div>
          ) : (
          <>
              <Link to="/login" type="submit" className="btn btn-secondary btn-sm" id='btn-header-login'>Iniciar sesión</Link>
              <Link to="/register" type="submit" className="btn btn-secondary btn-sm" id='btn-header-register'>Registrarse</Link>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;