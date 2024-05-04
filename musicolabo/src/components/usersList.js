import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import MyNavbar from './navbar';
import '../styles/userList.css';


const UsersList = () => {
  const { getProfilesFromFirestore, sendMessage, unreadMessages, filteredProfiles, loggedIn } = useContext(MusiColaboContext);
  const [userProfiles, setUserProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const navigate = useNavigate(); // Usar el hook useNavigate para la redirección a login si no estas logeado y quieres enviar un mensaje a un usuario




  const handleSendMessage = (recipientEmail, recipientName) => {
    if (!loggedIn) {
      // Redirigir al usuario a la página de inicio de sesión si no está logeado
      navigate('/login');

      } else {
      console.log("Se hizo clic en el enlace 'Enviar mensaje'");
      console.log("ID del usuario destinatario:", recipientEmail);
      setRecipientEmail(recipientEmail);
      setRecipientName(recipientName);
      setShowForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(recipientEmail, recipientName, message);
      setMessage('');
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

  console.log("Mensajes no leídos:", unreadMessages);

  return (
    <div className='container-users-list'>
      <Header />
      <MyNavbar />
      <div className="row-list">
        {(filteredProfiles.length > 0 ? filteredProfiles : userProfiles).map(profile => (
          <div className="col-md-3 mb-4 sm-3 col-cards" key={profile.email}>
            <div className="cards">
              <img src={profile.picture} className="card-img-top" alt="Imagen de perfil" />
              <div className="card-body">
                <div className='card-name-and-city'>
                  <div className='user'> 
                    <h3 className="card-user-name">{profile.username}</h3>
                    <Link to={`/user-profile-list/${profile.email}`} className='link-user'>Perfil</Link>
                  </div>
                  <p className='card-city'>{profile.city}</p>
                  <p className='card-instruments'>{profile.instruments.join(', ')}</p>
                </div>
                <div className='container-purpose-link'>
                  <div className='container-purpose'>
                    <p className='card-purpose'>{profile.purpose}</p>
                  </div>
                  <div className='container-link'>
                    <Link to={`/user-videos/${profile.email}`} className='link-card' id='link-videos'>Ver videos</Link>
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
          <h2>Enviar mensaje a {recipientName}</h2>
          <form onSubmit={handleSubmit}>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            <button id='btn-message-popup-submit' type="submit">Enviar</button>
            <br/>
            {messageSent && <span>Mensaje enviado!</span>}
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersList;