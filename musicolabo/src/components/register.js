import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MusiColaboContext } from '../context/context.js';
import { Link } from 'react-router-dom';
import '../styles/register.css';

const Register = () => {
  const { handleRegister } = useContext(MusiColaboContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await handleRegister({ email, password });
    navigate('/create-profile');  // Redireccionar a la página deseada después de registrarse para ya poder hacer login

    } catch (error) {
      setError('Email ya registrado.');
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <div className='container-fluid' id='container-register'>
      <div className='container-header-register'>
        <div className='row-header-register'>
          <div className='col col-btn-home-register'>
          <Link to="/" className='btn btn-sm btn-outline-secondary' type="button" id='btn-home-register'>HOME</Link>
          </div>
          <div className=' col col-logo-register'>
            <div className='musicolabo-logo-register'> 
              <h1>MC</h1>
            </div>
              <h1>MusiColabo</h1>
          </div>
          <div className='col col-vacia'></div>
        </div>
      </div>
       <div className='container-form-register'>
        <h2>Registrarse</h2>
         <form onSubmit={handleSubmit}>
           <input 
             className='input-email-form-register'
             required
             type="email" 
             placeholder="Email" 
             value={email} 
             onChange={e => setEmail(e.target.value)} 
           />
           {error && <p className="error-message-email-register">{error}</p>}
           <input 
             className='input-password-form-register'
             required
             type="password" 
             placeholder="Contraseña" 
             value={password} 
             onChange={e => setPassword(e.target.value)} 
           />
           <button 
             onSubmit={handleRegister} 
             type="submit" 
             className="btn btn-secondary" 
             id='btn-form-register'>
              Registrarse
           </button>
        </form>
       </div>     
    </div>
  );
};

export default Register;