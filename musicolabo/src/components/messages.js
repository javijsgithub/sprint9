import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/messages.css';

const Messages = () => {
  const { user, getMessagesFromFirestore, unreadMessages, sendMessage, updateMessageReadStatus, setUnreadMessages, getProfilesFromFirestore  } = useContext(MusiColaboContext);
  const [messages, setMessages] = useState([]);
  const [newUnreadList, setNewUnreadList] = useState([]);
  const [newReadList, setNewReadList] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [expandedMessageIndexes, setExpandedMessageIndexes] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [originalMessageId, setOriginalMessageId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user) {
          const threads = await getMessagesFromFirestore(user.email);
          console.log('Hilos de mensajes obtenidos:', threads);
  
          // Aquí adaptamos la estructura a las listas existentes de leídos y no leídos.
          const newUnreadList = [];
          const newReadList = [];
          threads.forEach(thread => {
            thread.unread.forEach(msg => newUnreadList.push(msg));
            thread.read.forEach(msg => newReadList.push(msg));
          });
        
          setMessages(threads);  // Mantiene todos los hilos si necesitas usarlos en otro contexto.
          setNewUnreadList(newUnreadList);
          setNewReadList(newReadList);
        }
      } catch (error) {
        console.error('Error al obtener mensajes del usuario:', error);
      }
    };
    fetchMessages();
  }, [getMessagesFromFirestore, user]);


 //mover el mensaje de la lista de no leidos a la lista de leidos
 const moveMessageToRead = async (messageId, userEmail) => {
  try {
    const message = newUnreadList.find(msg => msg.id === messageId);
    if (message) {    
      await updateMessageReadStatus(userEmail, messageId);

      const updatedUnreadList = newUnreadList.filter(msg => msg.id !== messageId);
      setNewUnreadList(updatedUnreadList);

      const updatedReadList = [message, ...newReadList];
      setNewReadList(updatedReadList);

      // Actualizar el contaddor de aviso de mensajes no leidos
      setUnreadMessages(prevUnreadMessages => Math.max(0, prevUnreadMessages - 1));
    }
  } catch (error) {
    console.error('Error al mover el mensaje a la lista de leídos:', error);
  }
};

// Materializar que el mensaje se mueva de la lista de no leidos a la lista de leidos
const closeAndMoveMessage = async (threadIndex) => {
  try {
    const thread = messages[threadIndex];
    if (thread.unread.length > 0) {
      const messageToMove = thread.unread[0];
      await moveMessageToRead(messageToMove.id, user.email);

      // Actualizamos el estado localmente
      setMessages(prevMessages => {
        const updatedThreads = [...prevMessages];
        updatedThreads[threadIndex] = {
          ...thread,
          unread: thread.unread.slice(1),
          read: [messageToMove, ...thread.read]
        };
        return updatedThreads;
      });
    }
  } catch (error) {
    console.error('Error al cambiar el estado del mensaje:', error);
  }
};


  
  const expandMessage = (threadIndex) => {
    // Expandir o contraer el hilo según su estado actual
    setExpandedMessageIndexes(prevIndexes =>
      prevIndexes.includes(threadIndex) ?
      prevIndexes.filter(index => index !== threadIndex) :
      [...prevIndexes, threadIndex]
    );
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
      <h2>Mensajes recibidos:</h2>
      {unreadMessages > 0 && <h6 className='aviso'>Tienes {unreadMessages} mensaje/s no leídos.</h6>}
      <hr/>
      <h3>No leídos:</h3>
      <ul className='mensajes-no-leidos'>
        {messages.map((thread, threadIndex) => (
          <React.Fragment key={threadIndex}>
            {thread.unread.map((message, index) => (
              <li key={`${threadIndex}-${index}`} className={message.replyTo ? "reply-message" : "original-message"}>
                <strong>De:</strong> {getUserNameByEmail(message.sender)}, <Link to={`/user-profile/${message.sender}`} className='link-messages'>Ver perfil</Link><br />
                <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />
                <br/>
                 {expandedMessageIndexes.includes(threadIndex) && ( // Solo expande el mensaje si el índice del hilo está en expandedMessageIndexes
          <>
                <strong>Mensaje:</strong> {message.message}<br />

                {message.replyTo && (
                  <div className='container-reply'>
                    <em>
                      <strong>En respuesta a tu mensaje:</strong>
                      <br/>
                      <strong>Fecha y hora:</strong>  {message.originalMessageDate || "Fecha del mensaje original no encontrado"}<br />
                      <strong>Mensaje:</strong> {message.originalMessage || "Mensaje original no encontrado"}       
                    </em>
                  </div>
                                  )}

                     <button onClick={() => closeAndMoveMessage(threadIndex, user.email)}>Cerrar mensaje</button>            
                     <button onClick={() => handleReply(message.sender, getUserNameByEmail(message.sender), message.id)}>Responder</button>
          </>
        )}
        {!expandedMessageIndexes.includes(threadIndex) && ( // Renderiza el botón "Ver mensaje" solo si el índice del hilo NO está expandido
          <button onClick={() => expandMessage(threadIndex)}>Ver mensaje</button>
        )}
        <hr></hr>
      </li>
    ))}
  </React.Fragment>
))}
      </ul>
      <br/>
      <h3>Leídos:</h3>
      <ul className='mensajes-leidos'>
        {messages.map((thread, threadIndex) => (
          <React.Fragment key={threadIndex}>
            {thread.read.map((message, index) => (
              <li key={`${threadIndex}-${index}`} className={message.replyTo ? "reply-message" : "original-message"}>
                <strong>De:</strong> {getUserNameByEmail(message.sender)}, <Link to={`/user-profile/${message.sender}`} className='link-messages'>Ver perfil</Link><br />
                <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />
                <br/>

                {expandedMessageIndexes.includes(threadIndex) ? (
                  <>
                   <strong>Mensaje:</strong> {message.message}<br />
                {message.replyTo && (
                  <div className='container-reply'>
                    <em>
                      <strong>En respuesta a tu mensaje:</strong>
                      <br/>
                      <strong>Fecha y hora:</strong>  {message.originalMessageDate || "Fecha del mensaje original no encontrado"}<br />
                      <strong>Mensaje:</strong> {message.originalMessage || "Mensaje original no encontrado"}       
                    </em>
                  </div>
                )}
                    <button onClick={() => expandMessage(threadIndex)}>Cerrar mensaje</button>
                    <button onClick={() => handleReply(message.sender, getUserNameByEmail(message.sender), message.id)}>Responder</button>
                  </>
                ) : (
                  <button onClick={() => expandMessage(threadIndex)}>Ver mensaje</button>
                )}
                <hr></hr>
              </li>
            ))}
          </React.Fragment>
        ))}
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
