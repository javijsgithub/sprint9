import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import '../styles/userProfile.css';

const UserProfile = () => {
  const { getProfilesFromFirestore } = useContext(MusiColaboContext);
  const { userEmail } = useParams();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [instruments, setInstruments] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState([]);

  useEffect(() => {
    // Obtener el perfil del usuario actual y establecer los valores iniciales en los campos de entrada
    const fetchUserProfile = async () => {
      try {
        const profiles = await getProfilesFromFirestore();
        const userProfile = profiles.find(profile => profile.email === userEmail);
        if (userProfile) {
          setName(userProfile.name);
          setUsername(userProfile.username);
          setEmail(userProfile.email);
          setCity(userProfile.city);
          setInstruments(userProfile.instruments);
          setPurpose(userProfile.purpose);
          setPictureUrl(userProfile.picture);  // Obtener la URL de la foto del usuario
          setVideoUrls(userProfile.videos || []);  // Obtener las URLs de los videos del usuario
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, [getProfilesFromFirestore, userEmail]);


  return (
    <div className='container-user-profile'>
       <Link to="/messages" className="btn btn-secondary" id='btn-users-list-go-to-header'>Volver</Link>
      <h2>Perfil de {username}</h2>
      {email && (
        <div className='profile'>
          <img src={pictureUrl} alt="Foto de perfil" />
          <p>Nombre: {name}</p>
          <p>Nombre de usuario: {username}</p>
          <p>Ubicación: {city}</p>
          <p>Instrumentos: {instruments.join(', ')}</p>
          <p>Descripción: {purpose}</p>
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