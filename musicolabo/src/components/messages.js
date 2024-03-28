import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';

const Messages = () => {
  const { user, getMessagesFromFirestore, unreadMessages } = useContext(MusiColaboContext);
  const [messages, setMessages] = useState([]);
  const [expandedMessageIndexes, setExpandedMessageIndexes] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user) {
          const userMessages = await getMessagesFromFirestore(user.email);
          console.log('Mensajes obtenidos en el componente:', userMessages);
          setMessages(userMessages.reverse());        }
      } catch (error) {
        console.error('Error al obtener mensajes del usuario:', error);
      }
    };

    fetchMessages();
  }, [getMessagesFromFirestore, user]);

  useEffect(() => {
    console.log('Messages:', messages);
  }, [messages]);

  const openMessage = (index) => {
    if (!expandedMessageIndexes.includes(index)) {
      setExpandedMessageIndexes([...expandedMessageIndexes, index]);
    }
  };

  const closeMessage = (index) => {
    setExpandedMessageIndexes(expandedMessageIndexes.filter((i) => i !== index));
  };

  return (
    <div className='container-messages'>
      <Link to="/list" className="btn btn-secondary" id='btn-users-list-go-to-header'>Volver</Link>
      <h2>Mensajes</h2>
      {unreadMessages > 0 && <p>Tienes {unreadMessages} mensaje/s no leídos.</p>}
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>De:</strong> {message.sender}<br />
            <strong>Fecha y hora:</strong> {new Date(message.timestamp.toDate()).toLocaleString()}<br />

            {expandedMessageIndexes.includes(index) ? (
              <>
                <strong>Mensaje:</strong> {message.message}<br />
                <button onClick={() => closeMessage(index)}>Cerrar mensaje</button>
              </>
            ) : (
              <button onClick={() => openMessage(index)}>Ver mensaje</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;


