import React from 'react';
import Header from './header';
import { Link } from 'react-router-dom';
import '../styles/welcomeScreen.css';


function WelcomeScreen() {
    return (
      <div className='container-welcomeScreen'>
         <Header />
        <div className="container-welcome">
        <h2><b>Bienvenido a MusiColabo!</b></h2>
        <hr></hr>
          <p className="welcome-description">
            MusiColabo es una plataforma diseñada para conectar músicos que buscan colaborar y crear juntos. Aquí, podrás explorar perfiles de diversos artistas, conocer sus habilidades, los instrumentos que dominan y qué están buscando o pueden ofrecer en una colaboración musical. 
          </p>
          <p className="welcome-description">
            Navega libremente por el listado de artistas para ver sus tarjetas de perfil. Para optimizar tu búsqueda y ganar tiempo, puedes filtrar los perfiles por instrumento y ciudad, lo que te permitirá encontrar músicos que se ajusten específicamente a tus necesidades y ubicación. <br/><br/> Si decides registrarte, al iniciar sesion podrás acceder a funciones adicionales como ver el perfil del artista con una descripción mas completa, ver videos de los artistas y enviarles mensajes directos para iniciar una colaboración. <br/><br/>¡Únete a nuestra comunidad y comienza a crear música juntos!
          </p>
          <Link to="/list" className="btn btn-secondary" id='btn-welcome-screen-go-to-user-list'>Ir al listado de artistas</Link>
        </div>
       </div>
    );
  }
  
  export default WelcomeScreen;