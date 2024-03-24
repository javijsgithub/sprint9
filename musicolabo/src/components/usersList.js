import React, { useContext, useEffect, useState } from 'react';
import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import Header from './header';
import '../styles/userList.css';


const UsersList = () => {
  const { getProfilesFromFirestore } = useContext(MusiColaboContext);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const fetchedProfiles = await getProfilesFromFirestore();
        console.log("Perfiles obtenidos:", fetchedProfiles);
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error('Error al obtener perfiles:', error);
      }
    };

    fetchProfiles();
  }, [getProfilesFromFirestore]);
  
  


    return (
     
      <div className='container-users-list'>
        <Header />
          
          <Link to="/" className="btn btn-secondary" id='btn-users-list-go-to-header'>Ir a la pagina de Bienvenida</Link>

          <h2>LISTADO</h2>

          <ul>
            {profiles.map(profile => (
              <li key={profile.email}>
                <h3>{profile.name}</h3>
                <p><img src={profile.picture} alt="Imagen de perfil" /> </p>
               <p>Instrumentos: {profile.instruments.join(', ')}</p>
               {/* Mostrar otros detalles del perfil según sea necesario */}
              </li>
            ))}
          </ul>
      </div>
            
          
         /* <div className='container-btn-view-more'>
         <button type="button" id='btn-view-more' onClick={loadMoreUsers} class="btn btn-secondary">Ver mas...</button>
         
          </div>*/
         
  
      
    );
  };
  
  export default UsersList;