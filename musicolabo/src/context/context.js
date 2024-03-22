import React, { createContext, useState } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
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

  // Función para crear un nuevo documento de perfil de usuario en Firestore Database
  const createNewDocument = async (userProfile) => {
    try {
      await addDoc(collection(db, 'userData'), userProfile);
      console.log('Documento creado exitosamente con los datos del perfil del usuario:', userProfile);
    } catch (error) {
      console.error('Error al crear el documento:', error);
      throw error;
    }
  };

  return (
    <MusiColaboContext.Provider value={{ 
      user,
      userEmail,
      loggedIn,
      createNewDocument,
      handleRegister,
      handleLogin,
      handleLogout  
      }}>
      {children}
    </MusiColaboContext.Provider>
  );
};

export default MusiColaboContextProvider;