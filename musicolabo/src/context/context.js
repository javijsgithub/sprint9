import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, getDocs, query, where, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
export const MusiColaboContext = createContext();

const MusiColaboContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);

  
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

  // Función para crear un nuevo documento de perfil de usuario en Firestore Database.
  const createNewDocument = async (userProfile) => {
    try {
      
        await addDoc(collection(db, 'userData'), userProfile);
        console.log('Documento creado exitosamente con los datos del perfil del usuario:', userProfile);
      
    } catch (error) {
      console.error('Error al crear el documento:', error);
      throw error;
    }
  };
//  Funcion para cargar imagenes en firestorage
  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Imagen subida correctamente:', file.name);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Devuelve la URL de descarga de la imagen
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  };

  // Función para cargar videos en FireStorage
  const uploadVideo = async (file) => {
    try {
      const storageRef = ref(storage, `videos/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Video subido correctamente:', file.name);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Devuelve la URL de descarga del video
    } catch (error) {
      console.error("Error al subir el video:", error);
      throw error;
    }
  };

  // Funcion para ver los perfiles de usuarios en el listado
  const getProfilesFromFirestore = async () => {
    try {
      const profilesSnapshot = await getDocs(collection(db, 'userData'));
      const profiles = profilesSnapshot.docs.map(doc => doc.data());
      return profiles;
    } catch (error) {
      console.error('Error al obtener perfiles de usuario:', error);
      throw error;
    }
  };

  //  Funcion para enviar mensajes utilizando firestore
  const sendMessage = async (recipientEmail, message) => {
    try {
      console.log("Enviando mensaje...");
      console.log("Destinatario userId:", recipientEmail);
      console.log("Mensaje:", message);
      // Obtener la referencia al documento del destinatario usando el correo electrónico
    const querySnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', recipientEmail)));
    if (!querySnapshot.empty) {
      const recipientDocRef = querySnapshot.docs[0].ref;
      const messagesCollectionRef = collection(recipientDocRef, 'messages');
      await addDoc(messagesCollectionRef, {
        sender: userEmail,
        message: message,
        timestamp: new Date()
      });
      console.log('Mensaje enviado exitosamente.');
    } else {
      console.error('No se encontró ningún usuario con el correo electrónico proporcionado:', recipientEmail);
    }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  

  // Funcion para que el usuario pueda editar su perfil 
  const updateProfileInFirestore = async (userEmail, updatedProfile) => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', userEmail)));
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await setDoc(docRef, updatedProfile, { merge: true });
        console.log('Perfil del usuario actualizado exitosamente en Firestore:', updatedProfile);
      } else {
        console.error('No se encontró ningún perfil con el correo electrónico proporcionado:', userEmail);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario en Firestore:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true);
        setUserEmail(user.email);
      } else {
        setLoggedIn(false);
        setUserEmail('');
      }
    });

    if (userEmail) {
      const unsubscribeMessages = onSnapshot(
        query(collection(db, 'userData', userEmail, 'messages'), where('read', '==', false)),
        (snapshot) => {
          console.log("Snapshot de mensajes no leídos:", snapshot);
          console.log("Documentos no leídos:", snapshot.docs);
          console.log("Cantidad de documentos no leídos:", snapshot.docs.length);
          setUnreadMessages(snapshot.docs.length);
        }
      );
  
      return () => {
        unsubscribeMessages();
      };
    }
  
    return () => {
      unsubscribeAuth();
    };
  }, [userEmail]);

  return (
    <MusiColaboContext.Provider value={{ 
      user,
      storage,
      userEmail,
      loggedIn,
      sendMessage,
      uploadImage,
      uploadVideo,
      createNewDocument,
      handleRegister,
      handleLogin,
      handleLogout, 
      getProfilesFromFirestore,
      updateProfileInFirestore,
      unreadMessages
       
      }}>
      {children}
    </MusiColaboContext.Provider>
  );
};

export default MusiColaboContextProvider;