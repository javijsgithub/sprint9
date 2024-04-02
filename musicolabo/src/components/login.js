import React, { useState, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { MusiColaboContext } from '../context/context.js'; 
import { Link } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const { handleLogin } = useContext(MusiColaboContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
     navigate('/list');  // Redireccionar a la página deseada después de iniciar sesión

    } catch (error) {
      setError('Email y/o contraseña incorrecto.');
      console.error('Error al iniciar sesión:', error);
    }
  };
 
  return (
    <div className='container-fluid' id='container-login'>
      <div className='container-header-login'>
        <div className='row-header-login'>
          <div className='col col-btn-home-login'>
          <Link to="/" className='btn btn-sm btn-outline-secondary' type="button" id='btn-home-login'>HOME</Link>
          </div>
          <div className='col col-logo-login'>
            <div className='musicolabo-logo-login'> 
              <h1>MC</h1>
            </div>
              <h1>MusiColabo</h1>
          </div>
          <div className='col col-vacia'></div>
        </div>
      </div>
      <div className='container-form-login'>
       <h2>Iniciar sesion</h2>
        <form onSubmit={handleSubmit}>
          <input 
            className='input-email-form-login'
            required
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className='input-password-form-login'
            required
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />

          {error && <p className="error-message-email-login">{error}</p>} 

          <button 
            onSubmit={handleLogin} 
            type="submit" 
            className="btn btn-secondary" 
            id='btn-form-login'>
              Iniciar sesión
          </button>
        </form>
        <div className='container-link-register'>
         <p>Nuevo en MusiColabo? <Link to="/register" type="submit" id='link-register'>Registrate</Link></p> 
        </div>
      </div>
    </div>
  );
};

export default Login;