import React, { useState, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/createProfile.css';

const CreateProfile = () => {
  const { userEmail, createNewDocument, uploadImage, uploadVideo } = useContext(MusiColaboContext);
  const [picture, setPicture] = useState('');
  const [videos, setVideos] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(userEmail); // Email prellenado
  const [instruments, setInstruments] = useState([]);
  const [city, setCity] = useState('');
  const [purpose, setPurpose] = useState('');
  const navigate = useNavigate();
  const [profileSent, setProfileSent] = useState(false);

  

  const handleInstrumentChange = (e) => {
    const instrument = e.target.value;
    if (e.target.checked) {
      setInstruments([...instruments, instrument]);
    } else {
      setInstruments(instruments.filter(item => item !== instrument));
    }
  };

  const handleVideoChange = (e) => {
    setVideos([...videos, ...e.target.files]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
        
    try {
      let pictureUrl = ''; // Inicializar la URL de la imagen como vacía por defecto
    // Verificar si se proporcionó una imagen
    if (picture) {
      pictureUrl = await uploadImage(picture);
    } else {
      // Si no se proporcionó una imagen, usar la imagen predeterminada
      pictureUrl = '/images/profile_image.jpg'; // Ruta relativa a la carpeta imagen de la carpeta public
    }
      const videoUrls = await Promise.all(videos.map(async (video) => {
        return await uploadVideo(video);
      }));
      const userProfile = {
        picture: pictureUrl,
        videos: videoUrls,
        name,
        username,
        email,
        city,
        instruments,
        purpose
      };

      await createNewDocument(userProfile);
      setProfileSent(true); // para "Perfil creado con exito!"
      
      setTimeout(() => {
        setProfileSent(false);
        navigate('/login'); // Redirecciona al usuario al login
      }, 1500); 
   
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  return (
    <div className='container-fluid' id='container-create-profile'>
      <div className='container-header-create-profile'>
        <div className='row-header-create-profile'>
          <div className='col col-vacia1'></div>
          <div className=' col col-logo-create-profile'>
            <div className='musicolabo-logo-create-profile'> 
            <h1 className='logo-ini-text'>MC</h1>
          </div>
            <h1 className='logo-text'>MusiColabo</h1>
          </div>
          <div className='col col-vacia2'></div>
        </div>
      </div>
      <div className="container-form-create-profile">
       <h2>Crea tu perfil de usuario</h2>
       <hr></hr>
         <form onSubmit={handleSubmit}>
            <fieldset>

               <h6>Cargar imagen de perfil:</h6> 
               <label> 
                 <input
                 className='input-picture-form-create-profile' 
                 type="file" 
                 onChange={(e) => setPicture(e.target.files[0])}                />
               </label>
               <h6>Cargar video(s):</h6> 
              <label> 
                <input
                className='input-video-form-create-profile' 
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                />
            </label>
               <h6>Nombre:</h6>
               <label>
                 <input
                 className='input-name-form-create-profile'
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                />
              </label>
              <h6>Nombre de usuario:</h6> 
              <label>
                 <input
                 className='input-username-form-create-profile'
                 type="text"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                />
               </label>
               <h6>Email:</h6>
               <label>
                 <input
                 className='input-email-form-create-profile'
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 disabled // El email no debe ser editable
                />
               </label>
               <h6>Ubicación:</h6>
               <label> 
                 <input
                 className='input-ubication-form-create-profile'
                 type="text"
                 value={city}
                 onChange={(e) => setCity(e.target.value)}
                />
               </label>

            </fieldset>
            <fieldset>
              
                <h6>Instrumentos:</h6> 
                <label>
                 <div className='checks-instruments-form-create-profile'>
                  <label>
                    <input
                      type="checkbox"
                      value="guitarra"
                      checked={instruments.includes("guitarra")}
                      onChange={handleInstrumentChange}
                    /> Guitarra 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="bajo"
                      checked={instruments.includes("bajo")}
                      onChange={handleInstrumentChange}
                    /> bajo
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="piano"
                      checked={instruments.includes("piano")}
                      onChange={handleInstrumentChange}
                    /> piano
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="violin"
                      checked={instruments.includes("violin")}
                      onChange={handleInstrumentChange}
                    /> violin
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="cello"
                      checked={instruments.includes("cello")}
                      onChange={handleInstrumentChange}
                    /> cello
                  </label>
                  <label>
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
              <h6>Descripcion:</h6>
                <label>
                  <textarea
                    className='input-description-form-create-profile'
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  >
                  </textarea>
                </label>

            </fieldset>
            <button
             // onSubmit={createNewDocument}
              type="submit"
              className="btn btn-secondary"
              id='btn-form-create-profile'>
              Crear perfil
            </button>
            <br/>
            {profileSent && <span>Perfil creado con Exito!</span>}
         </form>
      </div>
    </div>
  );
};

export default CreateProfile;
