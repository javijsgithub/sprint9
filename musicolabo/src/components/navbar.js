import React, { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { MusiColaboContext } from '../context/context';
import '../styles/navbar.css';

const MyNavbar = () => {

  const { getProfilesFromFirestore, setFilteredProfiles, loggedIn, instrumentFilter, setInstrumentFilter, cityFilter, setCityFilter } = useContext(MusiColaboContext);
  const [noProfilesFound, setNoProfilesFound] = useState(false);

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

  return (
    
    <Navbar className='navbar' collapseOnSelect expand="xl"  variant="dark">
        <Link className="navbar-brand" id='navbar-logo' to="/"><h4>MusiColabo</h4></Link>
      <Navbar.Toggle id='toggle' aria-controls="responsive-navbar-nav" className="custom-toggler" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          {loggedIn && (
            <>
            <div className='navbar-nav'>
              <Link className="nav-link" id='nav-link-1' to="/">Home</Link>
              <Link className="nav-link" id='nav-link-2' to="/edit-profile">Mi perfil</Link>
              <Link className="nav-link" id='nav-link-3' to="/messages">Mensajes</Link>
            </div>
            </>
          )}
        </Nav>
        <Form className="d-flex" id='navbar-filter'>
          <FormControl
            id='input-instrument-navbar'
            type="search"
            autocomplete="off"
            placeholder="Instrumento"
            className="me-2"
            aria-label="Search"
            value={instrumentFilter}
            onChange={(e) => setInstrumentFilter(e.target.value)}
          />
          <FormControl
            id='input-city-navbar'
            type="search"
            placeholder="Ciudad"
            autocomplete="off"
            className="me-2"
            aria-label="Search"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
         <Button id='btn-filter' variant="outline-success" onClick={filterProfiles}>Filtrar</Button> 
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
