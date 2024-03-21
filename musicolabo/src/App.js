import React from 'react';
import MusiColaboContextProvider from './context/context.js';
import Login from './components/login.js';
import Register from './components/register.js';
import Header from './components/header.js';
import UsersList from './components/usersList.js';
import WelcomeScreen from './components/welcomeScreen.js';
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
            <Route path="/list" element={<UsersList/>} />
            </Routes>
          </Router>
         </MusiColaboContextProvider>
      
    </div>
  );
}

export default App;
