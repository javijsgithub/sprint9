import React, { useState, useContext/*, useEffect*/ } from 'react';
import { useNavigate} from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/createProfile.css';

const CreateProfile = () => {
  const { userEmail, createNewDocument } = useContext(MusiColaboContext);
  const [picture, setPicture] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(userEmail); // Email prellenado
  const [instruments, setInstruments] = useState([]);
  const [city, setCity] = useState('');
  const [purpose, setPurpose] = useState('');
  const navigate = useNavigate();
  

  const handleInstrumentChange = (e) => {
    const instrument = e.target.value;
    if (e.target.checked) {
      setInstruments([...instruments, instrument]);
    } else {
      setInstruments(instruments.filter(item => item !== instrument));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userProfile = {
        picture,
        name,
        username,
        email,
        city,
        instruments,
        purpose
      };

      await createNewDocument(userProfile);
      navigate('/list'); // Redirecciona al usuario a otra página, por ejemplo, la página de inicio
   
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  return (
    <div className='container-fluid' id='container-create-profile'>
      <div className='container-header-create-profile'>
        <div className='row-header-create-profile'>
          <div className='col col-vacia1'></div>
          <div className=' col col-logo'>
            <div className='musicolabo-logo'> 
              <h1>MC</h1>
            </div>
              <h1>MusiColabo</h1>
          </div>
          <div className='col col-vacia2'></div>
        </div>
      </div>
      <div className="container-form-create-profile">
       <h2>Crea tu perfil de Usuario</h2>
         <form onSubmit={handleSubmit} className=''>
            <fieldset>
             <p>Cargar imagen de perfil:</p> 
             <label for="profile-picture"> 
                 <input
                className='input-picture-form-create-profile' 
                id="profile-picture" 
                type="file" 
                value={picture}
                onChange={(e) => setPicture(e.target.value)} 
               />
               </label>
               <p>Nombre:</p>
               <label for='name'>
                 <input
                 className='input-name-form-create-profile'
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                />
              </label>
              <p>Nombre de usuario:</p> 
              <label for='username'>
                 <input
                 className='input-username-form-create-profile'
                 type="text"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                />
               </label>
               <p>Email:</p>
               <label for='email'>
                 <input
                 className='input-email-form-create-profile'
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 disabled // El email no debe ser editable
                />
               </label>
               <p>Ubicación:</p>
               <label for='ubication'> 
                 <input
                 className='input-ubication-form-create-profile'
                 type="text"
                 value={city}
                 onChange={(e) => setCity(e.target.value)}
                />
               </label>
            </fieldset>
            <fieldset>
              
                <p>Instrumentos:</p> 
                <label for='instruments'>
                  <div className='checks-instruments-form-create-profile'>
                  <label for='guitar'>
                    <input
                      type="checkbox"
                      value="guitarra"
                      checked={instruments.includes("guitarra")}
                      onChange={handleInstrumentChange}
                    /> Guitarra 

                  </label>
                  <label for='bass'>
                    <input
                      type="checkbox"
                      value="bajo"
                      checked={instruments.includes("bajo")}
                      onChange={handleInstrumentChange}
                    /> bajo
                  </label>
                  <label for='piano'>
                    <input
                      type="checkbox"
                      value="piano"
                      checked={instruments.includes("piano")}
                      onChange={handleInstrumentChange}
                    /> piano
                  </label>
                  <label for='violin'>
                    <input
                      type="checkbox"
                      value="violin"
                      checked={instruments.includes("violin")}
                      onChange={handleInstrumentChange}
                    /> violin
                  </label>
                  <label for='cello'>
                    <input
                      type="checkbox"
                      value="cello"
                      checked={instruments.includes("cello")}
                      onChange={handleInstrumentChange}
                    /> cello
                  </label>
                  <label for='drums'>
                    <input
                      type="checkbox"
                      value="bateria"
                      checked={instruments.includes("bateria")}
                      onChange={handleInstrumentChange}
                    /> bateria
                  </label>
                  </div>
                </label>
                <br/>
              <p>Descripcion:</p>
              <label for='description'>
                 <textarea
                 className='input-description-form-create-profile'
                 value={purpose}
                 onChange={(e) => setPurpose(e.target.value)}
                >
                </textarea>
              </label>
            </fieldset>
           <button
             //onSubmit={updateCreateProfileContext}
             type="submit"
             className="btn btn-secondary"
             id='btn-form-create-profile'>
              Crear perfil
           </button>
         </form>
      </div>
    </div>
  );
};

export default CreateProfile;
