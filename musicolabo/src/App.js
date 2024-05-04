import React, { useContext } from 'react';
import MusiColaboContextProvider, { MusiColaboContext} from './context/context.js';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login.js';
import Register from './components/register.js';
import Header from './components/header.js';
import UsersList from './components/usersList.js';
import WelcomeScreen from './components/welcomeScreen.js';
import CreateProfile from './components/createProfile.js';
import EditProfile from './components/editProfile.js';
import UserProfile from './components/userProfile.js';
import UserProfileList from './components/userProfileList.js';
import UserVideos from './components/userVideos.js';
import Messages from './components/messages.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <MusiColaboContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/header" element={<Header />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/list" element={<UsersList/>} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/user-profile/:userEmail" element={<UserProfile />} />
              <Route path="/user-profile-list/:userEmail" element={<ProtectedRoute><UserProfileList /></ProtectedRoute>} />
              <Route path="/user-videos/:userEmail" element={<ProtectedRoute><UserVideos /></ProtectedRoute>} />
            </Routes>
          </Router>
         </MusiColaboContextProvider>
      
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { loggedIn, loadingAuth  } = useContext(MusiColaboContext);
  if (loadingAuth) {
    return <div>Cargando...</div>;
  }
  return loggedIn ? children : <Navigate to="/login" />;
}

export default App;
