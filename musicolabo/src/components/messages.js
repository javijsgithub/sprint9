import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/messages.css';

const Messages = () => {
  const { user, getMessagesFromFirestore, unreadMessages, sendMessage, updateMessageReadStatus, setUnreadMessages, getProfilesFromFirestore  } = useContext(MusiColaboContext);
  const [messages, setMessages] = useState([]);
  //const [unreadMessagesList, setUnreadMessagesList] = useState([]);
  const [newUnreadList, setNewUnreadList] = useState([]);
  const [newReadList, setNewReadList] = useState([]);
 // const [readMessagesList, setReadMessagesList] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [expandedUnreadMessageIndexes, setExpandedUnreadMessageIndexes] = useState([]);
  const [expandedReadMessageIndexes, setExpandedReadMessageIndexes] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [originalMessageId, setOriginalMessageId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user) {
          const threads = await getMessagesFromFirestore(user.email);
          console.log('Hilos de mensajes obtenidos:', threads);
  
          // Aquí adaptamos la nueva estructura a las listas existentes de leídos y no leídos.
          const newUnreadList = [];
          const newReadList = [];
          threads.forEach(thread => {
            thread.unread.forEach(msg => newUnreadList.push(msg));
            thread.read.forEach(msg => newReadList.push(msg));
          });
 
         
          setMessages(threads);  // Mantiene todos los hilos si necesitas usarlos en otro contexto.
        }
      } catch (error) {
        console.error('Error al obtener mensajes del usuario:', error);
      }
    };
    fetchMessages();
  }, [getMessagesFromFirestore, user]);

  
  
  const openMessage = (threadIndex, isUnread) => {
    const updatedIndexes = isUnread ? expandedUnreadMessageIndexes : expandedReadMessageIndexes;
    setExpandedUnreadMessageIndexes([...updatedIndexes, threadIndex]); // Asegura usar threadIndex
  };


  const closeMessage = async (messageId, userId, threadIndex, isUnread) => {
    if (isUnread) {
      const message = newUnreadList.find(msg => msg.id === messageId);
      if (message) {
        // Elimina el mensaje de la lista de no leídos
        const updatedUnreadList = newUnreadList.filter(msg => msg.id !== messageId);
        setNewUnreadList(updatedUnreadList);
  
        // Agrega el mensaje a la lista de leídos
        const updatedReadList = [message, ...newReadList];
        setNewReadList(updatedReadList);
  
        // Actualiza el estado del mensaje a leído en Firestore
        await updateMessageReadStatus(userId, messageId);
  
        // Actualiza el contador de mensajes no leídos
        setUnreadMessages(prev => Math.max(0, prev - 1));
      }
    }
  
    // Cierra la visualización del mensaje (actualiza los índices expandidos)
    const updatedIndexes = isUnread ? expandedUnreadMessageIndexes : expandedReadMessageIndexes;
    const newIndexes = updatedIndexes.filter(index => index !== threadIndex);
    if (isUnread) {
      setExpandedUnreadMessageIndexes(newIndexes);
    } else {
      setExpandedReadMessageIndexes(newIndexes);
    }
  };

  const handleReply = (recipientEmail, recipientName, originalMessageId) => {
    console.log('Message ID received:', originalMessageId);
    setRecipientEmail(recipientEmail);
    setRecipientName(recipientName);
    setOriginalMessageId(originalMessageId);
    setShowReplyForm(true);
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Original Message ID:', originalMessageId);
      await sendMessage(recipientEmail, recipientName, replyMessage, originalMessageId);
      setReplyMessage('');
      setOriginalMessageId(null);
      setMessageSent(true); // para "mensaje enviado!"

      //Temporizador para restablecer messageSent después de 1,5 segundos
      setTimeout(() => {
        setMessageSent(false);
        setShowReplyForm(false);
      }, 1500); 


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
        <hr/>
        {unreadMessages > 0 && <h6 className='aviso'>Tienes {unreadMessages} mensaje/s no leídos.</h6>}
        <br/>
        <h3>Mensajes no leídos:</h3>
        <ul className='mensajes-no-leidos'>
          {messages.map((thread, threadIndex) => thread.unread.map((message, index) => (
  <li key={`${threadIndex}-${index}`} className={message.replyTo ? "reply-message" : "original-message"}>
    <strong>De:</strong> {getUserNameByEmail(message.sender)}, <Link to={`/user-profile/${message.sender}`} className='link-messages'>Ver perfil</Link><br />
    <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />
    <strong>Mensaje:</strong> {message.message}<br />
    
      {message.replyTo && (
        <div className='container-reply'>
          <em>
            En respuesta a tu mensaje:
            <br/>
            <strong>Mensaje:</strong> {message.replyContent || "Mensaje original no encontrado"}       
          </em>
        </div>
       )}

    {expandedUnreadMessageIndexes.includes(threadIndex) ? (
      <>
        <button onClick={() => closeMessage(threadIndex, true)}>Cerrar mensaje</button>
        <button onClick={() => handleReply(message.sender, getUserNameByEmail(message.sender), message.id)}>Responder</button>
      </>
    ) : (
      <button onClick={() => openMessage(threadIndex, true)}>Ver mensaje</button>
      
    )}
    <hr></hr>
  </li>
  
)))}
        </ul>
        <br/>
        <h3>Mensajes leídos:</h3>
        <ul className='mensajes-leidos'>
          {messages.map((thread, threadIndex) => thread.read.map((message, index) => (
  <li key={`${threadIndex}-${index}`} className={message.replyTo ? "reply-message" : "original-message"}>
    <strong>De:</strong> {getUserNameByEmail(message.sender)}, <Link to={`/user-profile/${message.sender}`} className='link-messages'>Ver perfil</Link><br />
    <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />
    <strong>Mensaje:</strong> {message.message}<br />
    {message.replyTo && (
      <div className='container-reply'>
          <em>
            En respuesta a tu mensaje:
            <br/>
            <strong>Mensaje:</strong> {message.replyContent || "Mensaje original no encontrado"}       
          </em>
        </div>
     )}
    {expandedReadMessageIndexes.includes(threadIndex) ? (
      <>
        <button onClick={() => closeMessage(threadIndex, true)}>Cerrar mensaje</button>
        <button onClick={() => handleReply(message.sender, getUserNameByEmail(message.sender), message.id)}>Responder</button>
      </>
    ) : (
      <button onClick={() => openMessage(threadIndex, true)}>Ver mensaje</button>
    )}
    <hr></hr>
  </li>
)))}
        </ul>
        {/* Formulario de respuesta */}
        {showReplyForm && (
          <div className="reply-message-popup">
            <button id="reply-popup-close" onClick={() => setShowReplyForm(false)}>&times;</button>
            <h2>Responder a {getUserNameByEmail(recipientName)}</h2>
            <form onSubmit={handleSubmit}>
              <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
              <button id='btn-reply-message-popup-submit' type='submit'>Enviar</button>
              {messageSent && <span>Mensaje enviado!</span>} 
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;


