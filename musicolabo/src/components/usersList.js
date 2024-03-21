import React/*, { useContext }*/ from 'react';
//import { MusiColaboContext } from '../context/context';
import { Link } from 'react-router-dom';
import Header from './header';


const UsersList = () => {
    //const { users, loadMoreUsers } = useContext(MusiColaboContext);
  
    return (
     
      <div className='container-users-list'>
        <Header />
          
          <Link to="/" className="btn btn-secondary" id='btn-users-list-go-to-header'>Ir a la pagina de Bienvenida</Link>

          <h2>LISTADO</h2>
      </div>
            
          
         /* <div className='container-btn-view-more'>
         <button type="button" id='btn-view-more' onClick={loadMoreUsers} class="btn btn-secondary">Ver mas...</button>
         
          </div>*/
         
  
      
    );
  };
  
  export default UsersList;