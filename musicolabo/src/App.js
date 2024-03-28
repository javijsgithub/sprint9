import React from 'react';
import MusiColaboContextProvider from './context/context.js';
import Login from './components/login.js';
import Register from './components/register.js';
import Header from './components/header.js';
import UsersList from './components/usersList.js';
import WelcomeScreen from './components/welcomeScreen.js';
import CreateProfile from './components/createProfile.js';
import EditProfile from './components/editProfile.js';
import Messages from './components/messages.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
            </Routes>
          </Router>
         </MusiColaboContextProvider>
      
    </div>
  );
}

export default App;
