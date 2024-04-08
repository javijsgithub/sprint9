import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/messages.css';

const Messages = () => {
  const { user, getMessagesFromFirestore, unreadMessages, sendMessage, updateMessageReadStatus, setUnreadMessages, getProfilesFromFirestore  } = useContext(MusiColaboContext);
  const [messages, setMessages] = useState([]);
  const [unreadMessagesList, setUnreadMessagesList] = useState([]);
  const [readMessagesList, setReadMessagesList] = useState([]);
  const [expandedMessageIndexes, setExpandedMessageIndexes] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user) {
          const userMessages = await getMessagesFromFirestore(user.email);
          console.log('Mensajes obtenidos en el componente:', userMessages);
          const unread = [];
          const read = [];
          userMessages.forEach(message => {
            if (!message.read) {
              unread.push(message);
            } else {
              read.push(message);
            }
          });
          setUnreadMessagesList(unread.reverse());
          setReadMessagesList(read.reverse());
          setMessages(userMessages.reverse());
        }       
      } catch (error) {
        console.error('Error al obtener mensajes del usuario:', error);
      }
    };
    fetchMessages();
  }, [getMessagesFromFirestore, user]);

 
  
  const openMessage = async (index) => {
    try {
      if (!expandedMessageIndexes.includes(index)) {
        const updatedMessages = [...messages];
        updatedMessages[index].read = true; // Marcar el mensaje como leído
        setMessages(updatedMessages);
        await updateMessageReadStatus(messages[index].recipient); // Actualizar el estado de leído en Firestore
        setExpandedMessageIndexes([...expandedMessageIndexes, index]);
      }
    } catch (error) {
      console.error('Error al abrir el mensaje:', error);
    }
  };

  const closeMessage = (index) => {
    try {
      const updatedMessages = [...messages];
      updatedMessages[index].read = true;
      setMessages(updatedMessages);
      updateMessageReadStatus(messages[index].recipient);
      setExpandedMessageIndexes(expandedMessageIndexes.filter((i) => i !== index));
      setUnreadMessages(prevUnreadMessages => Math.max(0, prevUnreadMessages - 1));
    } catch (error) {
      console.error('Error al cerrar el mensaje:', error);
    }
  };

  const handleReply = (recipientEmail, recipientName) => {
    setRecipientEmail(recipientEmail);
    setRecipientName(recipientName);
    setShowReplyForm(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(recipientEmail, recipientName, replyMessage);
      setShowReplyForm(false);
      setReplyMessage('');
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

  const getUserNameByEmail = (email) => {
    const userProfile = userProfiles.find(profile => profile.email === email);
    return userProfile ? userProfile.username : email; // Si se encuentra el perfil, devolver el nombre de usuario, de lo contrario, devolver el correo electrónico
  };

  return (
    <div className='container-fluid' id='container-messages'>
      <div className='container-header-messages'>
        <div className='row-header-messages'>
          <div className='col col-btn-home-messages'>
          <Link to="/list" className='btn btn-secondary' type="button" id='btn-volver-messages'>Volver</Link>
          </div>
          <div className='col col-logo-messages'>
            <div className='musicolabo-logo-messages'> 
              <h1>MC</h1>
            </div>
              <h1>MusiColabo</h1>
          </div>
          <div className='col col-vacia'></div>
        </div>
      </div>
      <div className='container-recibidos'>
      <h2>Bandeja:</h2>
      <hr></hr>
      {unreadMessages > 0 && <h6 className='aviso'>Tienes {unreadMessages} mensaje/s no leídos.</h6>}
      <br/>
      <h3>Mensajes no leídos:</h3>
      <ul className='mensajes-no-leidos'>
      {unreadMessagesList.map((message, index) => (
          <li key={index}>
            <strong>De:</strong> <strong>{getUserNameByEmail(message.sender)},</strong> <Link to={`/user-profile/${message.sender}`} className='link-messages'> Ver perfil</Link><br />
            <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />

            {expandedMessageIndexes.includes(index) ? (
              <>
                <strong>Mensaje:</strong> {message.message}<br />
                <button onClick={() => closeMessage(index)}>Cerrar mensaje</button>
                <button onClick={() => handleReply(message.sender, message.sender)}>Responder</button>
              </>
            ) : (
              <button onClick={() => openMessage(index)}>Ver mensaje</button>
            )}
            <hr></hr>
          </li>
        ))}
      </ul>
      <br/>
      <h3>Mensajes leídos:</h3>
      <ul className='mensajes-leidos'>
        {readMessagesList.map((message, index) => (
          <li key={index}>
            <strong>De:</strong> <strong>{getUserNameByEmail(message.sender)},</strong> <Link to={`/user-profile/${message.sender}`} className='link-messages'> Ver perfil</Link>
            <br/>
            <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />

            {expandedMessageIndexes.includes(index) ? (
              <>
                <strong>Mensaje:</strong> {message.message}<br />
                <button onClick={() => closeMessage(index)}>Cerrar mensaje</button>
                <button onClick={() => handleReply(message.sender, message.sender)}>Responder</button>
              </>
            ) : (
              <button onClick={() => openMessage(index)}>Ver mensaje</button>
            )}
            <hr></hr>
          </li>
          
        ))}
      </ul>
      

      {showReplyForm && (
        <div className="reply-message-popup">
            <button id="reply-popup-close" onClick={() => setShowReplyForm(false)}>&times;</button>
          <h2>Responder a {getUserNameByEmail(recipientName)}</h2>
          <form onSubmit={handleSubmit}>
            <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
            <button id='btn-reply-message-popup-submit' type='submit'>Enviar</button>
          </form>
        </div>
      )}
      </div>
      
    </div>
  );
};

export default Messages;


