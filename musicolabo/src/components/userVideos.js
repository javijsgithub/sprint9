import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import '../styles/userVideos.css';

const UserVideos = () => {
  const { getVideosByUserEmail } = useContext(MusiColaboContext);
  const { userEmail } = useParams();
  const [videos, setVideos] = useState([]);

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

  return (
    <div className='container-user-videos'>
        <Link to="/list" className="btn btn-secondary" id='btn-users-list-go-to-header'>Volver</Link>
        <h2>Videos de {userEmail}</h2>
      {videos.length > 0 ? (
        <div className="container-vid">
          {videos.map((video, index) => (
            <div key={index}>
              <video controls/>
              <source src={video} type="video/mp4" />
            </div>
          ))}
        </div>
      ) : (
        <p>No hay videos disponibles.</p>
      )}
    </div>
  );
};

export default UserVideos;
