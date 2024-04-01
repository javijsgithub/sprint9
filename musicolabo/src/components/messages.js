import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/messages.css';

const Messages = () => {
  const { user, getMessagesFromFirestore, unreadMessages, sendMessage, updateMessageReadStatus, setUnreadMessages  } = useContext(MusiColaboContext);
  const [messages, setMessages] = useState([]);
  const [unreadMessagesList, setUnreadMessagesList] = useState([]);
  const [readMessagesList, setReadMessagesList] = useState([]);
  const [expandedMessageIndexes, setExpandedMessageIndexes] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

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

  const handleSendReply = async () => {
    try {
      await sendMessage(recipientEmail, recipientName, replyMessage);
      setShowReplyForm(false);
      setReplyMessage('');
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
    }
  };

  return (
    <div className='container-messages'>
      <Link to="/list" className="btn btn-secondary" id='btn-users-list-go-to-header'>Volver</Link>
      <h2>Mensajes</h2>
      {unreadMessages > 0 && <p>Tienes {unreadMessages} mensaje/s no leídos.</p>}
      <h3>Mensajes no leídos</h3>
      <ul>
      {unreadMessagesList.map((message, index) => (
          <li key={index}>
            <strong>De:</strong> {message.sender}, <Link to={`/user-profile/${message.sender}`}> Ver perfil</Link><br />
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
          </li>
        ))}
      </ul>
      <h3>Mensajes leídos</h3>
      <ul>
        {readMessagesList.map((message, index) => (
          <li key={index}>
            <strong>De:</strong> {message.sender}, <Link to={`/user-profile/${message.sender}`}> Ver perfil</Link><br />
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
          </li>
        ))}
      </ul>

      {showReplyForm && (
        <div className="reply-message-popup">
            <button className="close" onClick={() => setShowReplyForm(false)}>&times;</button>
          <h3>Responder a {recipientName}</h3>
          <form>
            <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
            <button onClick={handleSendReply}>Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Messages;


