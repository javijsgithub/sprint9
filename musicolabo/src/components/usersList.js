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
      <div className="row-list">
        {profiles.map(profile => (
          <div className="col-md-3 mb-4 sm-3 col-cards" key={profile.email}>
            <div className="cards">
              <img src={profile.picture} className="card-img-top" alt="Imagen de perfil" />
              <div className="card-body">
                <div className='card-name-and-city'>
                  <h3 className="card-name">{profile.name}</h3>
                  <p className='card-city'>{profile.city}</p>
                  <p className='card-instruments'>{profile.instruments.join(', ')}</p>
                </div>
                <div className='container-purpose-link'>
                  <div className='container-purpose'>
                    <p className='card-purpose'>{profile.purpose}</p>
                  </div>
                  <div className='container-link'>
                    <Link to='' className='link-card'>Enviar mensaje</Link>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>
  </div>
          
         /* <div className='container-btn-view-more'>
         <button type="button" id='btn-view-more' onClick={loadMoreUsers} class="btn btn-secondary">Ver mas...</button>
         
          </div>*/
         
  
      
    );
  };
  
  export default UsersList;