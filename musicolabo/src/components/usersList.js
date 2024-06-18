import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import MyNavbar from './navbar';
import '../styles/userList.css';


const UsersList = () => {
  const { getProfilesFromFirestore, sendMessage, /*unreadMessages,*/ filteredProfiles, loggedIn } = useContext(MusiColaboContext);
  const [userProfiles, setUserProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Usar el hook useNavigate para la redirección a login si no estas logeado y quieres enviar un mensaje a un usuario o ver sus videos y perfil


  // Función para guardar la posición del scroll al navegar a User-videos y user-profile-link
  const handleLinkClick = () => {
    const currentPosition = window.scrollY;
   // console.log('Posición del scroll al salir:', currentPosition);
    localStorage.setItem('scrollPosition', currentPosition.toString());
};
 
 // Restaurar la posición del scroll a donde estaba antes de salir del listado y aplicarla al regresar
 useEffect(() => {
  const storedPosition = localStorage.getItem('scrollPosition');
  if (storedPosition && userProfiles.length > 0) {
    const parsedPosition = parseInt(storedPosition, 10);
    if (!isNaN(parsedPosition) && parsedPosition !== 0) {
      console.log('Posición del scroll al volver:', parsedPosition);
      window.scrollTo(0, parsedPosition);
      localStorage.removeItem('scrollPosition');
    }
  }
}, [userProfiles]);  //  Se restaurará la posicion del scroll despues de que se carguen los perfiles de usuario

  
  const handleSendMessage = (recipientEmail, recipientName) => {
    if (!loggedIn) {
      // Redirigir al usuario a la página de inicio de sesión si al querer enviar un mensaje no está logeado
      navigate('/login');

      } else {
     // console.log("Se hizo clic en el enlace 'Enviar mensaje'");
     // console.log("ID del usuario destinatario:", recipientEmail);
      setRecipientEmail(recipientEmail);
      setRecipientName(recipientName);
      setShowForm(true);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Activar el spinner
    try {
      await sendMessage(recipientEmail, recipientName, message);
      setMessage('');
      setLoading(false); // Desactiva el spinner justo antes de mostrar el mensaje "mensaje enviado!"
      setMessageSent(true); // para "mensaje enviado!"
      
       //Temporizador para restablecer messageSent después de 2 segundos
      setTimeout(() => {
        setMessageSent(false);
        setShowForm(false);
      }, 2000); 

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };
    

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profiles = await getProfilesFromFirestore();
        setUserProfiles(profiles);
      } catch (error) {
        console.error('Error al obtener perfiles de usuario:', error);
      }
    };
    fetchUserProfiles();
  }, [getProfilesFromFirestore]);

  //console.log("Mensajes no leídos:", unreadMessages);
  

  return (
    <div className='container-users-list'>
      <Header />
      <MyNavbar />
      <div className="row-list">
        {(filteredProfiles.length > 0 ? filteredProfiles : userProfiles).map(profile => (
          <div className="col-xxxl-2 col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12 col-cards" key={profile.email}>
            <div className="cards">
              <img src={profile.picture} className="card-img-top" alt="Imagen de perfil" />
              <div className="card-body">
                <div className='card-name-and-city'>
                  <div className='user'> 
                    <h3 className="card-user-name">{profile.username}</h3>
                    <Link to={`/user-profile-list/${profile.username}`} className='link-user' onClick={handleLinkClick}><strong>Perfil</strong></Link>
                  </div>
                  <p className='card-city'>{profile.city}</p>
                  <p className='card-instruments'>{profile.instruments.join(', ')}</p>
                </div>
                <div className='container-purpose-link'>
                  <div className='container-purpose'>
                    <p className='card-purpose'>{profile.purpose}</p>
                  </div>
                  <div className='container-link'>
                  <Link to={`/user-videos/${profile.username}`} className='link-card' id='link-videos' onClick={handleLinkClick}>Ver videos</Link>
                    <button className='link-card2' id='button-message' onClick={() => handleSendMessage(profile.email, profile.username)}>Enviar mensaje</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="message-popup">
          <button id="popup-close" onClick={() => setShowForm(false)}>&times;</button>
          <h2>Mensaje para {recipientName}</h2>
          <form onSubmit={handleSubmit}>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            <button id='btn-message-popup-submit' type="submit">Enviar</button>
            <br/>
            {loading && <div className="spinner-send-messages"></div>}
            {messageSent && <span>Mensaje enviado!</span>}
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersList;