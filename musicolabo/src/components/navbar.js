import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { MusiColaboContext } from '../context/context';
import '../styles/navbar.css';

const Navbar = () => {

  const { getProfilesFromFirestore, setFilteredProfiles } = useContext(MusiColaboContext);
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [noProfilesFound, setNoProfilesFound] = useState(false);

  const handleFilter = async () => {
    try {
      // Lógica para filtrar los perfiles según el instrumento y la ciudad seleccionados
      const profiles = await getProfilesFromFirestore();
      let filteredProfiles = profiles;

      if (instrumentFilter) {
        filteredProfiles = filteredProfiles.filter(profile =>
             profile.instruments.some(instrument =>
                 instrument.toLowerCase().includes(instrumentFilter.toLowerCase()))); 
     }

      if (cityFilter) {
        filteredProfiles = filteredProfiles.filter(profile =>
             profile.city.toLowerCase() === cityFilter.toLowerCase());
      }

       // Actualizar el estado en el contexto con los perfiles filtrados
       setFilteredProfiles(filteredProfiles);

       if (filteredProfiles.length === 0) {
        setNoProfilesFound(true); // Mostrar mensaje de "No se encontraron perfiles"
      } else {
        setNoProfilesFound(false);
      }
      
      console.log('Perfiles filtrados:', filteredProfiles);
    } catch (error) {
      console.error('Error al filtrar perfiles:', error);
    }
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark ">
      <div className="container">
        <Link className="navbar-brand" to="/">MusiColabo</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/edit-profile">Perfil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/messages">Mensajes</Link>
            </li>
          </ul>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Filtrar por instrumento" aria-label="Search" value={instrumentFilter} onChange={(e) => setInstrumentFilter(e.target.value)} />
            <input className="form-control me-2" type="search" placeholder="Filtrar por ciudad" aria-label="Search" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
            <button className="btn btn-outline-light" type="button" onClick={handleFilter}>Filtrar</button>
          </form>
          {noProfilesFound && (
            <div className="alert alert-warning" role="alert">
              No se encontraron perfiles con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
