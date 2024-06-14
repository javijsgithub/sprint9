import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../styles/userVideos.css';

const UserVideos = () => {
  const { getVideosByUsername, picture, handleLogout, unreadMessages, getProfilesFromFirestore } = useContext(MusiColaboContext);
  const { username } = useParams();
  const [videos, setVideos] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const userVideos = await getVideosByUsername(username);
        setVideos(userVideos);
      } catch (error) {
        console.error('Error al obtener los videos del usuario:', error);
      }
    };

    if (username) {
      fetchVideos();
    }
  }, [username, getVideosByUsername]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profiles = await getProfilesFromFirestore();
        setUserProfiles(profiles);
      } catch (error) {
        console.error('Error al obtener perfiles de usuario:', error);
      }
    };
    fetchUserProfiles();
  }, [getProfilesFromFirestore]);

  console.log(`Number of user profiles fetched: ${userProfiles.length}`);

 
  return (
    <div className='container-fluid' id='container-user-videos'>
      <div className='container-header-videos'>
        <div className='row-header-videos'>
          <div className='col col-btn-home-videos'>
           <Link to="/list" className="btn btn-secondary btn-sm" id='btn-home-videos'>Volver</Link>
          </div>
          <div className='col col-logo-videos'>
            <div className='musicolabo-logo-videos'> 
            <h1 className='logo-ini-text'>MC</h1>
          </div>
            <h1 className='logo-text'>MusiColabo</h1>
          </div>
          <div className='col col-button-videos'>
           <div className='container-user-logged-videos'>
             <Link to="/" onClick={handleLogout} className="btn btn-secondary" id='btn-videos-logout'>Salir</Link>
             <div className='userlogged'>
              <img src={picture} className='picture-header-videos' alt="Imagen de perfil" />
             </div>
             <div className='container--mensajes-no-leidos'> 
              {unreadMessages > 0 && 
                <Link to="/messages" className="unread-messages-header-videos">
                  <h6 className='unread-text'>{unreadMessages} mensaje(s) nuevo(s).</h6>
                </Link>}              
            </div>
           </div>
          </div>        </div>
      </div>
      {videos.length > 0 ? (
        <div className="container-videos">
           <h2 className='videos-de'>Videos de {username}:</h2>
           <hr></hr>
           <div className='container-vid'>
           {videos.map((video, index) => (
            <div key={index}>
              <video controls preload="metadata" className='video'>
              <source src={video.previewUrl || video} type="video/mp4" /> 
                Tu navegador no admite la etiqueta de video.
              </video>
            </div>
          ))}
           </div>
          
        </div>
      ) : (
        <p>No hay videos disponibles.</p>
      )}
    </div>
  );
};

export default UserVideos;
