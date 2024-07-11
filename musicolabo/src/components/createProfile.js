import React, { useState, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/createProfile.css';

const CreateProfile = () => {
  const { userEmail, createNewDocument, uploadImage/*, uploadVideo */} = useContext(MusiColaboContext);
  const [picture, setPicture] = useState('');
  /*const [videos, setVideos] = useState([]);*/
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(userEmail); // Email prellenado
  const [instruments, setInstruments] = useState([]);
  const [city, setCity] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [profileSent, setProfileSent] = useState(false);
  const [loading, setLoading] = useState(false); 

  

  const handleInstrumentChange = (e) => {
    const instrument = e.target.value;
    if (e.target.checked) {
      setInstruments([...instruments, instrument]);
    } else {
      setInstruments(instruments.filter(item => item !== instrument));
    }
  };

  /*const handleVideoChange = (e) => {
    setVideos([...videos, ...e.target.files]);
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Activar el spinner
        
    try {
      let pictureUrl = ''; // Inicializar la URL de la imagen como vacía por defecto
    // Verificar si se proporcionó una imagen
    if (picture) {
      pictureUrl = await uploadImage(picture);
    } else {
      // Si no se proporcionó una imagen, usar la imagen predeterminada
      pictureUrl = '/images/profile_image.jpg'; // Ruta relativa a la carpeta imagen de la carpeta public
    }
      /*const videoUrls = await Promise.all(videos.map(async (video) => {
        return await uploadVideo(video);
      }));*/
      const userProfile = {
        picture: pictureUrl,
       /* videos: videoUrls,*/
        name,
        username,
        email,
        city,
        instruments,
        purpose,
        description
      };

      await createNewDocument(userProfile);
      setLoading(false);  // Desactivar el spinner
      setProfileSent(true); // muestra "Perfil creado con exito!"
      
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
                 onChange={(e) => setPicture(e.target.files[0])}             
                 />
               </label>
              {/* <h6>Cargar video(s):</h6> 
              <label> 
                <input
                className='input-video-form-create-profile' 
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                />
            </label>*/} 
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
                 <div id='checks-instruments-form-create-profile'>
                 <label>
                    <input
                      type="checkbox"
                      value="voz"
                      checked={instruments.includes("voz")}
                      onChange={handleInstrumentChange}
                    /> Voz 
                  </label>
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
                    /> Bajo
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="ukelele"
                      checked={instruments.includes("ukelele")}
                      onChange={handleInstrumentChange}
                    /> Ukelele 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="piano"
                      checked={instruments.includes("piano")}
                      onChange={handleInstrumentChange}
                    /> Piano
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="organo"
                      checked={instruments.includes("organo")}
                      onChange={handleInstrumentChange}
                    /> Órgano 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="violin"
                      checked={instruments.includes("violin")}
                      onChange={handleInstrumentChange}
                    /> Violin
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="cello"
                      checked={instruments.includes("cello")}
                      onChange={handleInstrumentChange}
                    /> Cello
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="bateria"
                      checked={instruments.includes("bateria")}
                      onChange={handleInstrumentChange}
                    /> Bateria
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="trompeta"
                      checked={instruments.includes("trompeta")}
                      onChange={handleInstrumentChange}
                    /> Trompeta 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="saxofon"
                      checked={instruments.includes("saxofon")}
                      onChange={handleInstrumentChange}
                    /> Saxofón 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="trombon"
                      checked={instruments.includes("trombon")}
                      onChange={handleInstrumentChange}
                    /> Trombón 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="trompa"
                      checked={instruments.includes("trompa")}
                      onChange={handleInstrumentChange}
                    /> Trompa 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="tuba"
                      checked={instruments.includes("tuba")}
                      onChange={handleInstrumentChange}
                    /> Tuba 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="flauta"
                      checked={instruments.includes("flauta")}
                      onChange={handleInstrumentChange}
                    /> Flauta 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="clarinete"
                      checked={instruments.includes("clarinete")}
                      onChange={handleInstrumentChange}
                    /> Clarinete 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="armonica"
                      checked={instruments.includes("armonica")}
                      onChange={handleInstrumentChange}
                    /> Armónica 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="arpa"
                      checked={instruments.includes("arpa")}
                      onChange={handleInstrumentChange}
                    /> Arpa 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="acordeon"
                      checked={instruments.includes("acordeon")}
                      onChange={handleInstrumentChange}
                    /> Acordeón 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="gaita"
                      checked={instruments.includes("gaita")}
                      onChange={handleInstrumentChange}
                    /> Gaita 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="balalaika"
                      checked={instruments.includes("balalaika")}
                      onChange={handleInstrumentChange}
                    /> Balalaika 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="banjo"
                      checked={instruments.includes("banjo")}
                      onChange={handleInstrumentChange}
                    /> Banjo 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="dejembe"
                      checked={instruments.includes("dejembe")}
                      onChange={handleInstrumentChange}
                    /> Dejembe 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="bongos"
                      checked={instruments.includes("bongos")}
                      onChange={handleInstrumentChange}
                    /> Bongos 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="pandereta"
                      checked={instruments.includes("pandereta")}
                      onChange={handleInstrumentChange}
                    /> Pandereta 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="maracas"
                      checked={instruments.includes("maracas")}
                      onChange={handleInstrumentChange}
                    /> Maracas 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="triangulo"
                      checked={instruments.includes("triangulo")}
                      onChange={handleInstrumentChange}
                    /> Triángulo 
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="xilofono"
                      checked={instruments.includes("xilofono")}
                      onChange={handleInstrumentChange}
                    /> Xilófono 
                  </label>
                 </div>
                </label>
                <br/>
              <h6>Propósito:</h6>
                <label>
                  <textarea
                    className='input-purpose-form-create-profile'
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    maxLength={175}
                    placeholder='(max 175 caract.)'
                  >
                  </textarea>
                </label>
                <h6>Descripcion:</h6>
                <label>
                  <textarea
                    className='input-description-form-create-profile'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
            {loading && <div className="spinner"></div>}
            {profileSent && <span>Perfil creado con Exito!</span>}
         </form>
      </div>
    </div>
  );
};

export default CreateProfile;
