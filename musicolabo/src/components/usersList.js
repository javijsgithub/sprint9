import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import Header from './header';
import Navbar from './navbar';
import '../styles/userList.css';


const UsersList = () => {
  const { getProfilesFromFirestore, sendMessage, unreadMessages, updateMessageReadStatus, setUnreadMessages, filteredProfiles } = useContext(MusiColaboContext);
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientUserName, setRecipientUserName] = useState('');
  const [message, setMessage] = useState('');



  const handleSendMessage = (recipientEmail, recipientUserName) => {
    console.log("Se hizo clic en el enlace 'Enviar mensaje'");
    console.log("ID del usuario destinatario:", recipientEmail);
    setRecipientEmail(recipientEmail);
    setRecipientUserName(recipientUserName);
    setShowForm(true);
    updateMessageReadStatus(recipientEmail);
    // Actualizar el estado de mensajes no leídos en el contexto
  setUnreadMessages(prevUnreadMessages => Math.max(0, prevUnreadMessages - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(recipientEmail, recipientUserName, message);
      setShowForm(false);
      setMessage('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };
    

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const fetchedProfiles = await getProfilesFromFirestore();
        console.log("Perfiles obtenidos:", fetchedProfiles);
        setProfiles(fetchedProfiles);
        // Establecemos los perfiles filtrados
      } catch (error) {
        console.error('Error al obtener perfiles:', error);
      }
    };

    fetchProfiles();
  }, [getProfilesFromFirestore]);

  console.log("Mensajes no leídos:", unreadMessages);

    return (
  <div className='container-users-list'>
        <Header />
        <Navbar />
     
      <div className="row-list">
      {filteredProfiles.length > 0 ? filteredProfiles.map(profile => (
          <div className="col-md-3 mb-4 sm-3 col-cards" key={profile.email}>
            <div className="cards">
              <img src={profile.picture} className="card-img-top" alt="Imagen de perfil" />
              <div className="card-body">
                <div className='card-name-and-city'>
                  <h3 className="card-user-name">{profile.username}</h3>
                  <p className='card-city'>{profile.city}</p>
                  <p className='card-instruments'>{profile.instruments.join(', ')}</p>
                </div>
                <div className='container-purpose-link'>
                  <div className='container-purpose'>
                    <p className='card-purpose'>{profile.purpose}</p>
                  </div>
                  <div className='container-link'>
                    <Link to={`/user-videos/${profile.email}`} className='link-card' id='link-videos'>Ver videos</Link>
                    <Link to='' className='link-card' id='link-message' onClick={() => handleSendMessage(profile.email, profile.name)}>Enviar mensaje</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) :
        profiles.map(profile => (
          <div className="col-md-3 mb-4 sm-3 col-cards" key={profile.email}>
            <div className="cards">
              <img src={profile.picture} className="card-img-top" alt="Imagen de perfil" />
              <div className="card-body">
                <div className='card-name-and-city'>
                  <h3 className="card-user-name">{profile.username}</h3>
                  <p className='card-city'>{profile.city}</p>
                  <p className='card-instruments'>{profile.instruments.join(', ')}</p>
                </div>
                <div className='container-purpose-link'>
                  <div className='container-purpose'>
                    <p className='card-purpose'>{profile.purpose}</p>
                  </div>
                  <div className='container-link'>
                  <Link to={`/user-videos/${profile.email}`} className='link-card1' id='link-videos'>Ver videos</Link>
                  <Link to='' className='link-card2' id='link-message' onClick={() => handleSendMessage(profile.email, profile.name)}>Enviar mensaje</Link>  
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
            <h2>Enviar mensaje a {recipientUserName}</h2>
            <form onSubmit={handleSubmit}>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
              <button id='btn-message-popup-submit' type="submit">Enviar</button>
            </form>
        </div>
      )}
      
  </div>
    );
  };
  
  export default UsersList;

  /* <div className='container-btn-view-more'>
         <button type="button" id='btn-view-more' onClick={loadMoreUsers} class="btn btn-secondary">Ver mas...</button>
     </div>*/