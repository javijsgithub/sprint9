import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl/*, Button */} from 'react-bootstrap';
import { MusiColaboContext } from '../context/context';
import '../styles/navbar.css';

const MyNavbar = () => {

  const { getProfilesFromFirestore, setFilteredProfiles, loggedIn } = useContext(MusiColaboContext);
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [noProfilesFound, setNoProfilesFound] = useState(false);

  // Utiliza useCallback para memorizar la función de filtrado
  const filterProfiles = useCallback(async () => {
    try {
      const profiles = await getProfilesFromFirestore();
      let filteredProfiles = profiles;

      if (instrumentFilter) {
        filteredProfiles = filteredProfiles.filter(profile =>
             profile.instruments.some(instrument =>
                 instrument.toLowerCase().includes(instrumentFilter.toLowerCase())));
      }

      if (cityFilter) {
        filteredProfiles = filteredProfiles.filter(profile =>
            profile.city.toLowerCase().includes(cityFilter.toLowerCase()));
      }

      setFilteredProfiles(filteredProfiles);
      setNoProfilesFound(filteredProfiles.length === 0);
      console.log('Perfiles filtrados:', filteredProfiles);
    } catch (error) {
      console.error('Error al filtrar perfiles:', error);
    }
  }, [getProfilesFromFirestore, instrumentFilter, cityFilter, setFilteredProfiles]);

  // Observar cambios en los filtros y recargar todos los perfiles si ambos están vacíos
  useEffect(() => {
    filterProfiles(); // Llama a filterProfiles cada vez que hay un cambio en los filtros
  }, [instrumentFilter, cityFilter, filterProfiles]);

  return (
    
    <Navbar className='navbar' collapseOnSelect expand="lg"  variant="dark">
        <Link className="navbar-brand" id='navbar-logo' to="/"><h4>MusiColabo</h4></Link>
      <Navbar.Toggle id='toggle' aria-controls="responsive-navbar-nav" className="custom-toggler" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          {loggedIn && (
            <>
            <div className='navbar-nav'>
              <Link className="nav-link" id='nav-link-1' to="/">Home</Link>
              <Link className="nav-link" id='nav-link-2' to="/edit-profile">Perfil</Link>
              <Link className="nav-link" id='nav-link-3' to="/messages">Mensajes</Link>
            </div>
            </>
          )}
        </Nav>
        <Form className="d-flex" id='navbar-filter'>
          <FormControl
            id='input-instrument-navbar'
            type="search"
            placeholder="Filtrar por instrumento"
            className="me-2"
            aria-label="Search"
            value={instrumentFilter}
            onChange={(e) => setInstrumentFilter(e.target.value)}
          />
          <FormControl
            id='input-city-navbar'
            type="search"
            placeholder="Filtrar por ciudad"
            className="me-2"
            aria-label="Search"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
         {/* <Button id='btn-filter' variant="outline-success" onClick={filterProfiles}>Filtrar</Button>*/} 
        </Form>
      </Navbar.Collapse>
      {noProfilesFound && (
        <div className="alert alert-warning" role="alert">
        No se encontraron perfiles.
      </div>
      )}
    </Navbar>
    
   
  );
}

export default MyNavbar;
