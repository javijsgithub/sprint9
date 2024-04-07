import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/editProfile.css';

const EditProfile = () => {
  const { userEmail, getProfilesFromFirestore, updateProfileInFirestore, uploadImage, uploadVideo } = useContext(MusiColaboContext);
  const [picture, setPicture] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [instruments, setInstruments] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el perfil del usuario actual y establecer los valores iniciales en los campos de entrada
    const fetchUserProfile = async () => {
      try {
        const profiles = await getProfilesFromFirestore();
        const currentUserProfile = profiles.find(profile => profile.email === userEmail);
        if (currentUserProfile) {
            setPictureUrl(currentUserProfile.picture);
            setVideos(currentUserProfile.videos || []);            
            setName(currentUserProfile.name);
            setUsername(currentUserProfile.username);
            setEmail(currentUserProfile.email);
            setCity(currentUserProfile.city);
            setInstruments(currentUserProfile.instruments);
            setPurpose(currentUserProfile.purpose);
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, [getProfilesFromFirestore, userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        let newPictureUrl = pictureUrl;
        let newVideoUrls = [];

        if (picture) {
          newPictureUrl = await uploadImage(picture);
          setPictureUrl(newPictureUrl)
        }

        if (videos.length > 0) {
          newVideoUrls = await Promise.all(videos.map(async (video) => {
            return await uploadVideo(video);
          }));
        }
      const updatedProfile = {
        picture: newPictureUrl || null,
        videos: newVideoUrls || [],
        name,
        username,
        email,
        city,
        instruments,
        purpose
      };
      await updateProfileInFirestore(userEmail, updatedProfile);
      navigate('/edit-profile'); // Redirecciona al perfil del usuario después de actualizar
      setIsEditMode(false);
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
    }
  };

  const handleInstrumentChange = (e) => {
    const instrument = e.target.value;
    if (e.target.checked) {
      setInstruments([...instruments, instrument]);
    } else {
      setInstruments(instruments.filter(item => item !== instrument));
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleVideoChange = (e) => {
    setVideos([...videos, ...e.target.files]);
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const handleRemovePicture = () => {
    setPictureUrl('/images/profile_image.jpg'); // Ruta relativa a la carpeta imagen de la carpeta public
  };


  return (
<div className='container-fluid' id='container-edit-profile'>
      <div className='container-header-edit-profile'>
        <div className='row-header-edit-profile'>
          <div className='col col-btn-home-edit-profile'>
           <Link to="/list" className="btn btn-secondary" id='btn-home-edit-profile'>Volver</Link>
          </div>
          <div className=' col col-logo-edit-profile'>
            <div className='musicolabo-logo-edit-profile'> 
              <h1>MC</h1>
            </div>
              <h1>MusiColabo</h1>
          </div>
          <div className='col col-vacia2'></div>
        </div>
      </div>
      <div className='container-edit'>
        <div className='container-title-and-btn-edit'>
          <h2>Tu perfil:</h2>
          <button className='btn btn-sm btn-outline-secondary' id='btn-edit' onClick={toggleEditMode}>{isEditMode ? 'Cancelar' : 'Editar Perfil'}</button>
        </div>
      <hr></hr>
     
        
        <form onSubmit={handleSubmit} style={{ display: isEditMode ? 'block' : 'none' }}>      
        {pictureUrl && (
          <div className="preview-picture">
             <h6>Cambiar imagen de perfil:</h6>
        <label>
          <input
            className='input-edit-profile'
            type="file"
            onChange={(e) => setPicture(e.target.files[0])}
          />
        </label>
            <img src={pictureUrl} className='picture-edit-profile2' alt="Imagen de perfil" />
            {pictureUrl && pictureUrl !== '/images/profile_image.jpg' && (
            <button
              type="button"
              onClick={() => handleRemovePicture()}
              className="btn btn-danger btn-sm"
              id='btn-delete-picture'
            >
            Eliminar
            </button>
            )}
          </div>
          
        )}
        
        <hr></hr>
      <h6>Cargar video(s):</h6> 
        <label> 
          <input
            className='input-edit-profile'
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoChange}
          />
        </label>
      <div className='preview-video'>
        {videos.map((video, index) => (
          <div key={index} className="video-item">
           <video controls>
            <source src={video} type="video/mp4" />
             Tu navegador no admite la etiqueta de video.
           </video>
           <button
             type="button"
             onClick={() => handleRemoveVideo(index)}
             className="btn btn-danger btn-sm"
             id='btn-delete-video'
            >
            Eliminar
           </button>
          </div>
        ))}
      </div>
    <hr></hr>
      <h6>Nombre:</h6>
      <label>
          <input
            className='input-edit-profile'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <h6>Nombre de usuario:</h6>
        <label>
          <input
           className='input-edit-profile'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <h6>Email:</h6>
        <label>
          <input
           className='input-edit-profile'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled // El email no debe ser editable
          />
        </label>
        <h6>Ubicación:</h6>
        <label>
          <input
            className='input-edit-profile'
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <h6>Instrumentos:</h6>
        <label>
          <div className="checkboxes">
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
                value="piano"
                checked={instruments.includes("piano")}
                onChange={handleInstrumentChange}
              /> Piano
            </label>
            <label>
              <input
                type="checkbox"
                value="violin"
                checked={instruments.includes("violin")}
                onChange={handleInstrumentChange}
              /> Violín
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
                value="batería"
                checked={instruments.includes("batería")}
                onChange={handleInstrumentChange}
              /> Batería
            </label>
          </div>
        </label>
        <h6>Descripción:</h6>
        <label>
          <textarea
            className='area-edit-profile'
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          ></textarea>
        </label>
        <hr></hr>
        <button type="submit" className="btn btn-secondary" id='btn-save'>
          Guardar cambios
        </button>
      </form>
       {/* Mostrar la información del perfil */}
      <div style={{ display: isEditMode ? 'none' : 'block' }}>
        {pictureUrl && (
       <div className="preview-picture"> 
        <img src={pictureUrl} className='picture-edit-profile1' alt="Imagen de perfil" />
       </div>
       )}
       
       <div className='nom'><h5>Nombre: </h5><p> { name}</p></div>
       <div className='nom-us'><h5>Nombre de usuario: </h5><p> {username}</p></div>
       <div className='em'><h5>Email: </h5><p> {email}</p></div>
       <div className='ub'><h5>Ubicación: </h5><p> {city}</p></div>
       <div className='inst'><h5>Instrumentos: </h5><p>{instruments.join(', ')}</p></div>
       <div className='desc'><h5>Descripción: </h5><p>{purpose}</p></div>
       <hr></hr>
       <h3>Videos:</h3> 
       {videos.length > 0 && (
         <div className='preview-video'>
           {videos.map((video, index) => (
          <div key={index}>
            <video controls>
              <source src={video}  type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
        </div>
       )}
      </div>
    </div>
</div>
  );
};

export default EditProfile;