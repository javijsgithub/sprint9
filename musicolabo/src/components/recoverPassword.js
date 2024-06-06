import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context.js'; 
import '../styles/recoverPassword.css';

const RecoverPassword = () => {
  const { sendPasswordResetEmail } = useContext(MusiColaboContext);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      setMessage('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
    } catch (error) {
      setMessage('Error al enviar el correo de recuperación. Asegúrate de que el correo es correcto.');
      console.error('Error al enviar el correo de recuperación:', error);
    }
  };

  return (
    <div className='container-fluid' id='container-recover-password'>
        <div className='container-header-recover-password'>
        <div className='row-header-recover-password'>
          <div className='col col-btn-home-recover-password'>
          <Link to="/login" className='btn btn-sm btn-outline-secondary' type="button" id='btn-home-login'>Volver</Link>
          </div>
          <div className='col col-logo-recover-password'>
            <div className='musicolabo-logo-recover-password'> 
            <h1 className='logo-ini-text'>MC</h1>
          </div>
            <h1 className='logo-text'>MusiColabo</h1>
          </div>
          <div className='col col-vacia'></div>
        </div>
      </div>
      <div className='container-form-recover-password'>
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            className='input-email-form-recover-password'
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-secondary"
            id='btn-form-recover-password'>
            Enviar Correo de Recuperación
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default RecoverPassword;