import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/editProfile.css';

const EditProfile = () => {
  const { userEmail, getProfilesFromFirestore, picture, unreadMessages, updateProfileInFirestore, deleteUserProfileFromFirestore, handleLogout, uploadImage, uploadVideo } = useContext(MusiColaboContext);
  const [picture1, setPicture1] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [instruments, setInstruments] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveChangesMessage, setSaveChangesMessage] = useState(false);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false);
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
            setDescription(currentUserProfile.description);
        } else { //cuando el usuario elimina su cuenta y se intenta volver a cargar su perfil, evitar que se mantenga la pagina de editar el perfil sin usuario logeado, hacer logout y redirigir a la pagina de login.
          handleLogout();
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, [getProfilesFromFirestore, userEmail, handleLogout, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el spinner
  
    try {
      let newPictureUrl = pictureUrl;
      let newVideoUrls = [];
  
      // Subir nueva imagen si hay una seleccionada
      if (picture1) {
        newPictureUrl = await uploadImage(picture1);
        setPictureUrl(newPictureUrl);
      }
  
      // Subir videos y crear URLs permanentes
      newVideoUrls = await Promise.all(videos.map(async (video) => {
        if (typeof video === 'string') {
          return video; // Si es una URL permanente, reutilizarla.
        } else if (video && video.file) {
          const downloadURL = await uploadVideo(video.file);
          URL.revokeObjectURL(video.previewUrl); // Revocar la URL temporal
          return downloadURL;
        } else {
          console.error('Video no es un objeto de archivo válido:', video);
          return null;
        }
      }));
  
      // Filtrar URLs nulas si alguna carga falló o había datos no válidos
      newVideoUrls = newVideoUrls.filter(url => url !== null);
  
      // Actualizar el perfil con la nueva información
      const updatedProfile = {
        picture: newPictureUrl || null,
        videos: newVideoUrls || [],
        name,
        username,
        email,
        city,
        instruments,
        purpose,
        description
      };

      await updateProfileInFirestore(userEmail, updatedProfile);
      setVideos(newVideoUrls); 
      setSaveChangesMessage(true);

      // Simula tiempo de espera de la red y procesamiento
    setTimeout(async () => {
      await updateProfileInFirestore(userEmail, updatedProfile);
      setLoading(false); // Desactiva el spinner justo antes de mostrar el mensaje
      setSaveChangesMessage(true);


      setTimeout(() => {
        setSaveChangesMessage(false);
        setIsEditMode(false);
        navigate('/edit-profile'); // Redirecciona al perfil del usuario después de actualizar
      }, 1500);
    }, 1000); 

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
    const files = Array.from(e.target.files).map(file => ({
      file: file,
      previewUrl: URL.createObjectURL(file) // Asigna una URL de vista previa al cargar
    }));
    setVideos(prevVideos => [...prevVideos, ...files]);
  };

  useEffect(() => {
    // Esto asume que `videos` es un array de File objects
    return () => {
      videos.forEach(video => {
        if (typeof video !== 'string') {
          URL.revokeObjectURL(video.previewUrl);
        }
      });
    };
  }, [videos]);


  const handleRemoveVideo = (index) => {
    console.log('Índice para eliminar:', index); // Muestra el índice del array que se va a eliminar [0, 1, 2] (0 o 1 o 2) dependiendo de la posicion del video que eliminamos
    console.log('Estado de los videos antes de eliminar:', videos.map(v => v.previewUrl || v)); // Muestra el estado previo a la eliminacion del video

    // Crear una copia del arreglo de videos para manipular
    let updatedVideos = [...videos];

    // Revocar la URL si es necesaria
    if (typeof updatedVideos[index] !== 'string') {
        URL.revokeObjectURL(updatedVideos[index].previewUrl);
    }
    updatedVideos.splice(index, 1);  // Eliminar el video en el índice dado

    console.log('Estado de videos después de eliminar:', updatedVideos.map(v => v.previewUrl || v));  //Muestra el estado actual despues de la eliminacion del video

    setVideos(updatedVideos); // Actualizar el estado con el nuevo arreglo de videos
    setKey(prevKey => prevKey + 1); 
    console.log("Video eliminado correctamente")
  };
  

  const handleRemovePicture = () => {
    setPictureUrl('/images/profile_image.jpg'); // Ruta relativa a la carpeta imagen de la carpeta public
    console.log("Imagen eliminada correctamente")
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.")) {
      try {
        await deleteUserProfileFromFirestore(userEmail);
        handleLogout(); // Hacer logout si la eliminación fue exitosa
       //navigate('/login'); // Redirigir al usuario a la pagina de login
      } catch (error) {
        alert("Ocurrió un error al eliminar el perfil: " + error.message);
      }
    }
  };


  return (
<div className='container-fluid' id='container-edit-profile'>
      <div className='container-header-edit-profile'>
        <div className='row-header-edit-profile'>
          <div className='col col-btn-home-edit-profile'>
           <Link to="/list" className="btn btn-secondary btn-sm" id='btn-home-edit-profile'>Volver</Link>
          </div>
          <div className=' col col-logo-edit-profile'>
            <div className='musicolabo-logo-edit-profile'> 
            <h1 className='logo-ini-text'>MC</h1>
          </div>
            <h1 className='logo-text'>MusiColabo</h1>
          </div>
          <div className='col col-button-edit-profile'>
           <div className='container-user-logged-edit-profile'>
           <Link to="/" onClick={handleLogout} className="btn btn-secondary" id='btn-edit-profile-logout'>Salir</Link>
           <div className='userlogged'>
              <img src={picture} className='picture-header-edit-profile' alt="Imagen de perfil" />
            </div>
            <div className='container--mensajes-no-leidos'> 
              {unreadMessages > 0 && 
                <Link to="/messages" className="unread-messages-header-edit-profile">
                  <h6 className='unread-text'>{unreadMessages} mensaje(s) nuevo(s).</h6>
                </Link>}              
            </div>
           </div>
          </div>        
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
            className='input-picture-edit-profile'
            type="file"
            onChange={(e) => setPicture1(e.target.files[0])}
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
            className='input-video-edit-profile'
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoChange}
          />
        </label>
      <div key={key} className='preview-video'>
        {videos.map((video, index) => (
          <div key={index} className="video-item">
           <video controls>
            <source src={video.previewUrl || video} type="video/mp4" /> 
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
        <h6>Propósito:</h6>
        <label>
          <textarea
            className='area1-edit-profile'
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={{ overflowWrap: 'break-word', wordWrap: 'break-word', overflow: 'hidden' }}
            maxLength={175}
            placeholder='(max 175 caract.)'
          >
          </textarea>
        </label>
        <h6>Descripción:</h6>
        <label>
          <textarea
            className='area2-edit-profile'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
          </textarea>
        </label>
        <hr></hr>
        <div className='container-btns-save-delete'>
          <button type="submit" className="btn btn-secondary" id='btn-save'>Guardar cambios</button>
          <button className="btn btn-danger" onClick={handleDeleteProfile} id='btn-delete'>Eliminar Cuenta</button>
        </div>
        {loading && <div className="spinner"></div>} {/* Spinner aquí */}
        {saveChangesMessage && (
        <div className="save-success-message">
          Cambios guardados con éxito!
        </div>
      )}

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
       <div className='pro'><h5>Propósito: </h5><p>{purpose}</p></div>
       <div className='desc'><h5>Descripción: </h5><p>{description}</p></div>
       <hr></hr>
       <h3>Videos:</h3> 
       {videos.length > 0 && (
          <div key={key} className='preview-video'>
           {videos.map((video, index) => (
          <div key={index}>
            <video controls>
             <source src={video.previewUrl || video} type="video/mp4" /> 
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