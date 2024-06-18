import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/messages.css';

const Messages = () => {
  const { user, getMessagesFromFirestore, handleLogout, deleteMessageFromFirestore, picture, unreadMessages, sendMessage, updateMessageReadStatus, setUnreadMessages, getProfilesFromFirestore  } = useContext(MusiColaboContext);
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
  const [loading, setLoading] = useState(false);

  // Función para guardar la posición del scroll al navegar a user-profile
  const handleLinkClick = () => {
    const currentPosition = window.scrollY;
   //console.log('Posición del scroll al salir:', currentPosition);
    localStorage.setItem('scrollPosition', currentPosition.toString());
};
 
 // Restaurar la posición del scroll a donde estaba antes de salir del listado de mensajes y aplicarla al regresar
 useEffect(() => {
  const storedPosition = localStorage.getItem('scrollPosition');
  if (storedPosition && messages.length > 0) {
    const parsedPosition = parseInt(storedPosition, 10);
    if (!isNaN(parsedPosition) && parsedPosition !== 0) {
      //console.log('Posición del scroll al volver:', parsedPosition);
      window.scrollTo(0, parsedPosition);
      localStorage.removeItem('scrollPosition');
    }
  }
}, [messages]);  //  Se restaurará la posicion del scroll despues de que se carguen los mensajes


  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);  // Activar el spinner
      try {
        if (user) {
          const threads = await getMessagesFromFirestore(user.email);
          //console.log('Hilos de mensajes obtenidos:', threads);
  
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

      setLoading(false);  // Desactivar el spinner

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
const moveMessage = async (threadIndex) => {
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

const deleteMessage = async (messageId, threadIndex) => {
  try {
    // Eliminar el mensaje de Firestore
    await deleteMessageFromFirestore(user.email, messageId);

    // Una vez eliminado el mensaje de Firestore, actualizamos el estado localmente para reflejar el cambio
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages[threadIndex].unread = updatedMessages[threadIndex].unread.filter(msg => msg.id !== messageId);
      updatedMessages[threadIndex].read = updatedMessages[threadIndex].read.filter(msg => msg.id !== messageId);
      return updatedMessages;
    });
    // Actualizar el contaddor de aviso de mensajes no leidos
    setUnreadMessages(prevUnreadMessages => Math.max(0, prevUnreadMessages - 1));

    // Asegurarse de que el índice del hilo no se quede en la lista de expandidos
    setExpandedMessageIndexes(prevIndexes => prevIndexes.filter(id => id !== messageId));

   
    //console.log('Mensaje eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el mensaje:', error);
  }
};


  
const expandMessage = (messageId) => {
  setExpandedMessageIndexes(prevIndexes =>
    prevIndexes.includes(messageId) ?
    prevIndexes.filter(index => index !== messageId) :
    [...prevIndexes, messageId]
  );
};
  
  
  const handleReply = (recipientEmail, recipientName, originalMessageId) => {
    //console.log('Message ID received:', originalMessageId);
    setRecipientEmail(recipientEmail);
    setRecipientName(recipientName);
    setOriginalMessageId(originalMessageId);
    setShowReplyForm(true);
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Activar el spinner
    try {
      //console.log('Original Message ID:', originalMessageId);
      await sendMessage(recipientEmail, recipientName, replyMessage, originalMessageId);
      setReplyMessage('');
      setOriginalMessageId(null);
      setLoading(false); // Desactiva el spinner justo antes de mostrar el mensaje "mensaje enviado!"
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
            <Link to="/list" className='btn btn-secondary btn-sm' type="button" id='btn-volver-messages'>Volver</Link>
          </div>
          <div className='col col-logo-messages'>
            <div className='musicolabo-logo-messages'>
            <h1 className='logo-ini-text'>MC</h1>
          </div>
            <h1 className='logo-text'>MusiColabo</h1>
          </div>
          <div className='col col-button-messages'>
           <div className='container-user-logged-messages'>
             <Link to="/" onClick={handleLogout} className="btn btn-secondary" id='btn-messages-logout'>Salir</Link>
             <div className='userlogged'>
              <img src={picture} className='picture-header-messages' alt="Imagen de perfil" />
             </div>
             <div className='container--mensajes-no-leidos'> 
              {unreadMessages > 0 && 
                <Link to="/messages" className="unread-messages-header-messages">
                  <h6 className='unread-text'>{unreadMessages} mensaje(s) nuevo(s).</h6>
                </Link>}              
            </div>
           </div>
          </div>
        </div>
      </div>
      <div className='container-recibidos'>
      <h2>Mensajes recibidos:</h2>
      {loading && <div className="spinner-messages"></div>}
      <hr/>
      <h3>No leídos:</h3>
      <ul className='mensajes-no-leidos'>
        {messages.map((thread, threadIndex) => (
          <React.Fragment key={threadIndex}>
            {thread.unread.map((message, index) => (
              <li key={`${threadIndex}-${index}`} className={message.replyTo ? "reply-message" : "original-message"}>
                <strong>De:</strong> {getUserNameByEmail(message.sender)}, <Link to={`/user-profile/${getUserNameByEmail(message.sender)}`} className='link-messages' onClick={handleLinkClick}>Ver perfil</Link><br />
                <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />
                <br/>
                {expandedMessageIndexes.includes(message.id) && ( // Solo expande el mensaje si el índice del hilo está en expandedMessageIndexes
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
                     
                     <button onClick={() => expandMessage(message.id)}>Cerrar mensaje</button>
                     <button onClick={() => moveMessage(threadIndex, user.email)}>Mover a leídos</button> 
                     <button onClick={() => handleReply(message.sender, getUserNameByEmail(message.sender), message.id)}>Responder</button>
                     <br/> 
                     <button id='btn-delete-message' onClick={() => deleteMessage(message.id, threadIndex)}>Eliminar mensaje</button>          

          </>
        )}
         {!expandedMessageIndexes.includes(message.id) && (
           <button onClick={() => expandMessage(message.id)}>Ver mensaje</button>
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
                <strong>De:</strong> {getUserNameByEmail(message.sender)}, <Link to={`/user-profile/${getUserNameByEmail(message.sender)}`} className='link-messages' onClick={handleLinkClick}>Ver perfil</Link><br />
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
                    <br/> 
                    <button id='btn-delete-message' onClick={() => deleteMessage(message.id, threadIndex)}>Eliminar mensaje</button>          

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
              <br/>
              {loading && <div className="spinner-send-reply-messages"></div>}
              {messageSent && <span>Mensaje enviado!</span>} 
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
