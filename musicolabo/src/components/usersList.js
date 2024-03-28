import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import Header from './header';
import '../styles/userList.css';


const UsersList = () => {
  const { getProfilesFromFirestore, sendMessage, unreadMessages } = useContext(MusiColaboContext);
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');



  const handleSendMessage = (recipientEmail, recipientName) => {
    console.log("Se hizo clic en el enlace 'Enviar mensaje'");
    console.log("ID del usuario destinatario:", recipientEmail);
    setRecipientEmail(recipientEmail);
    setRecipientName(recipientName);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(recipientEmail, recipientName, message);
      setShowModal(false);
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
        <Link to="/" 
         className="btn btn-secondary" id='btn-users-list-go-to-header'>Ir a la pagina de Bienvenida
        </Link>

          <h2>LISTADO</h2>
      {unreadMessages > 0 && 
      <Link to="/messages"
       className="unread-messages">Tienes {unreadMessages} mensaje(s) nuevo(s).
      </Link>}
      <div className="row-list">
        {profiles.map(profile => (
          <div className="col-md-3 mb-4 sm-3 col-cards" key={profile.email}>
            <div className="cards">
              <img src={profile.picture} className="card-img-top" alt="Imagen de perfil" />
              <div className="card-body">
                <div className='card-name-and-city'>
                  <h3 className="card-name">{profile.name}</h3>
                  <p className='card-city'>{profile.city}</p>
                  <p className='card-instruments'>{profile.instruments.join(', ')}</p>
                </div>
                <div className='container-purpose-link'>
                  <div className='container-purpose'>
                    <p className='card-purpose'>{profile.purpose}</p>
                  </div>
                  <div className='container-link'>
                  <Link to='' className='link-card' onClick={() => handleSendMessage(profile.email, profile.name)}>Enviar mensaje</Link>  
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showModal && (
        <div className="message-popup">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Enviar mensaje a {recipientName}</h2>
            <form onSubmit={handleSubmit}>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
              <button type="submit">Enviar</button>
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