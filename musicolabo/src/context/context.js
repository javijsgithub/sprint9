import React, { createContext, useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const MusiColaboContext = createContext();

const MusiColaboContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  
  // Función para registrar un nuevo usuario
  const handleRegister = async ({ email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setUserEmail(email);
      setLoggedIn(true);
    } catch (error) {
      throw error;
    }
  };

  // Función para iniciar sesión
  const handleLogin = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setUserEmail(email);
      setLoggedIn(true);
    } catch (error) {
      throw error;
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setLoggedIn(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <MusiColaboContext.Provider value={{ 
      user,
      userEmail,
      loggedIn,
      handleRegister,
      handleLogin,
      handleLogout  
      }}>
      {children}
    </MusiColaboContext.Provider>
  );
};

export default MusiColaboContextProvider;