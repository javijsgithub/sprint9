import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../styles/userVideos.css';

const UserVideos = () => {
  const { getVideosByUserEmail, getProfilesFromFirestore } = useContext(MusiColaboContext);
  const { userEmail } = useParams();
  const [videos, setVideos] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const userVideos = await getVideosByUserEmail(userEmail);
        setVideos(userVideos);
      } catch (error) {
        console.error('Error al obtener los videos del usuario:', error);
      }
    };

    if (userEmail) {
      fetchVideos();
    }
  }, [userEmail, getVideosByUserEmail]);

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

  const getUserNameByEmail = (email) => {
    const userProfile = userProfiles.find(profile => profile.email === email);
    return userProfile ? userProfile.username : email; // Si se encuentra el perfil, devolver el nombre de usuario, de lo contrario, devolver el correo electrónico
  };

  return (
    <div className='container-fluid' id='container-user-videos'>
      <div className='container-header-videos'>
        <div className='row-header-videos'>
          <div className='col col-btn-home-videos'>
           <Link to="/list" className="btn btn-secondary" id='btn-home-videos'>Volver</Link>
          </div>
          <div className='col col-logo-videos'>
            <div className='musicolabo-logo-videos'> 
              <h1>MC</h1>
            </div>
              <h1>MusiColabo</h1>
          </div>
          <div className='col col-vacia'></div>
        </div>
      </div>
      {videos.length > 0 ? (
        <div className="container-videos">
           <h2 className='videos-de'>Videos de {getUserNameByEmail(userEmail)}:</h2>
           <hr></hr>
           <div className='container-vid'>
           {videos.map((video, index) => (
            <div key={index}>
              <video controls>
              <source src={typeof video === 'string' ? video : URL.createObjectURL(video)} type="video/mp4" />
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
