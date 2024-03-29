import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

import '../styles/header.css';

const Header = () => {
  const { handleLogout, loggedIn, userEmail, unreadMessages } = useContext(MusiColaboContext);
 
  return (
    <div className='container-header'>
      <div className='row-header'>
        <div className='col col-redes'>
          <FaInstagram /> <FaFacebook /> <FaSquareXTwitter /> <FaYoutube />
        </div>
        <div className=' col col-logo'>
          <div className='musicolabo-logo'> 
            <h1>MC</h1>
          </div>
            <h1>MusiColabo</h1>
        </div>
        <div className=' col col-buttons-header'>
          {loggedIn ? (
            <div className='container-user-logged-header'>
              <Link to="/" onClick={handleLogout} className="btn btn-secondary" id='btn-header-logout'>Cerrar sesion</Link>
              <p>{userEmail}</p>
              <div className='container--mensajes-no-leidos'> 
                {unreadMessages > 0 && 
                 <Link to="/messages"
                   className="unread-messages">{unreadMessages} mensaje(s) nuevo(s).
                 </Link>}              
              </div>
            </div>
          ) : (
          <>
              <Link to="/login" type="submit" className="btn btn-secondary" id='btn-header-login'>Iniciar sesión</Link>
              <Link to="/register" type="submit" className="btn btn-secondary" id='btn-header-register'>Registrarse</Link>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;