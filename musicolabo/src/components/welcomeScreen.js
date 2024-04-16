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
            Navega libremente por el listado de MusiColabors para ver las tarjetas de perfil de cada usuario. Para optimizar tu búsqueda y ganar tiempo, puedes filtrar los perfiles por instrumento y ciudad, lo que te permitirá encontrar músicos que se ajusten específicamente a tus necesidades y ubicación. <br></br><br></br> Si decides registrarte, al iniciar sesion podrás acceder a funciones adicionales como ver videos de los usuarios y enviarles mensajes directos para iniciar una colaboración. <br></br>¡Únete a nuestra comunidad y comienza a crear música juntos!
          </p>
          <Link to="/list" className="btn btn-secondary" id='btn-welcome-screen-go-to-user-list'>Ir al listado de MusiColabors</Link>
        </div>
       </div>
    );
  }
  
  export default WelcomeScreen;