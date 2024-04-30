import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import '../styles/userProfile.css';

const UserProfile = () => {
  const { getProfilesFromFirestore, handleLogout, picture, unreadMessages } = useContext(MusiColaboContext);
  const { userEmail } = useParams();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [instruments, setInstruments] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState([]);

  useEffect(() => {
    // Obtener el perfil del usuario y establecer los valores iniciales en los campos de entrada
    const fetchUserProfile = async () => {
      try {
        const profiles = await getProfilesFromFirestore();
        const userProfile = profiles.find(profile => profile.email === userEmail);
        if (userProfile) {
          setUsername(userProfile.username);
          setEmail(userProfile.email);
          setCity(userProfile.city);
          setInstruments(userProfile.instruments);
          setPurpose(userProfile.purpose);
          setPictureUrl(userProfile.picture);  
          setVideoUrls(userProfile.videos || []);  
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, [getProfilesFromFirestore, userEmail]);


  return (
    <div className='container-fluid' id='container-user-profile'>
      <div className='container-header-profile'>
        <div className='row-header-profile'>
          <div className='col col-btn-home-profile'>
          <Link to="/messages" className='btn btn-secondary btn-sm' type="button" id='btn-volver-profile'>Volver</Link>
          </div>
          <div className='col col-logo-profile'>
            <div className='musicolabo-logo-profile'> 
            <h1 className='logo-ini-text'>MC</h1>
          </div>
            <h1 className='logo-text'>MusiColabo</h1>
          </div>
          <div className='col col-button-profile'>
           <div className='container-user-logged-profile'>
             <Link to="/" onClick={handleLogout} className="btn btn-secondary" id='btn-profile-logout'>Salir</Link>
             <div className='userlogged'>
              <img src={picture} className='picture-header-profile' alt="Imagen de perfil" />
             </div>
             <div className='container--mensajes-no-leidos'> 
              {unreadMessages > 0 && 
                <Link to="/messages" className="unread-messages-header-profile">
                  <h6 className='unread-text'>{unreadMessages} mensaje(s) nuevo(s).</h6>
                </Link>}              
            </div>
           </div>
          </div>        </div>
      </div>
      
      {email && (
        <div className='profile'>
          <h2>Perfil de {username}:</h2>
          <hr></hr>
          <img src={pictureUrl} className='picture-profile' alt="Foto de perfil" />
          <div className='nom-us'><h5>Nombre de usuario: </h5><p> {username}</p></div>
          <div className='ub'><h5>Ubicación: </h5><p> {city}</p></div>
          <div className='inst'><h5>Instrumentos: </h5><p>{instruments.join(', ')}</p></div>
          <div className='desc'><h5>Descripción: </h5><p>{purpose}</p></div>
          <hr></hr>
            <div className="video-container">
              <h3>Videos:</h3>
              {videoUrls.map((videoUrl, index) => (
                <div key={index}>
                  <video controls>
                    <source src={videoUrl} type="video/mp4" />
                    Tu navegador no admite la etiqueta de video.
                  </video>
                </div>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;