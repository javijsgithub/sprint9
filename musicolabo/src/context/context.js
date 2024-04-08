import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, getDocs, query, where, orderBy, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
export const MusiColaboContext = createContext();

const MusiColaboContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [picture, setPicture] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  
  // Función para registrar un nuevo usuario.
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


  // Función para iniciar sesión.
  const handleLogin = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setUserEmail(email);
      setLoggedIn(true);

    // Obtener el nombre de usuario y la imagen de perfil en una sola consulta
    const userDataSnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', email)));
    if (!userDataSnapshot.empty) {
      const userData = userDataSnapshot.docs[0].data();
      setUsername(userData.username);
      setPicture(userData.picture);
    }
    } catch (error) {
      throw error;
    }
  };


  // Función para cerrar sesión.
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setLoggedIn(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  // Función para crear un nuevo documento de perfil de usuario en Firestore.
  const createNewDocument = async (userProfile) => {
    try {
      
        await addDoc(collection(db, 'userData'), userProfile);
        console.log('Documento creado exitosamente con los datos del perfil del usuario:', userProfile);
      
    } catch (error) {
      console.error('Error al crear el documento:', error);
      throw error;
    }
  };


//  Funcion para cargar imagenes en firestorage.
  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Imagen subida correctamente:', file.name);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Devuelve la URL de descarga de la imagen.
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  };


  // Función para cargar videos en FireStorage.
  const uploadVideo = async (file) => {
    try {
      const storageRef = ref(storage, `videos/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Video subido correctamente:', file.name);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Devuelve la URL de descarga del video.
    } catch (error) {
      console.error("Error al subir el video:", error);
      throw error;
    }
  };

  //  Funcion para obtener los videos del usuario. 
  const getVideosByUserEmail = async (email) => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', email)));
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.videos) {
          return userData.videos;
        } else {
          return [];
        }
      } else {
        console.error('No se encontró ningún usuario con el correo electrónico proporcionado:', email);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los videos del usuario:', error);
      throw error;
    }
  };


  // Funcion para ver los perfiles de usuarios en el listado.
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


  // Funcion para que el usuario pueda editar su perfil.
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


  //  Funcion para enviar mensajes utilizando firestore
  const sendMessage = async (recipientEmail, recipientName, message) => {
    try {
      console.log("Enviando mensaje a...", recipientName);
      console.log("Destinatario userId:", recipientEmail);
      console.log("Mensaje:", message);
      // Obtener la referencia al documento del destinatario usando el correo electrónico
    const querySnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', recipientEmail)));
    if (!querySnapshot.empty) {
      const recipientDocRef = querySnapshot.docs[0].ref;
      const messagesCollectionRef = collection(recipientDocRef, 'messages');
      await addDoc(messagesCollectionRef, {
        sender: userEmail,
        recipient: recipientEmail, 
        message: message,
        timestamp: new Date(),
        read: false // Marcar el mensaje como no leído cuando se envía
      });
      console.log('Mensaje enviado exitosamente.');
       if (recipientEmail === userEmail) {
        setUnreadMessages(prevUnreadMessages => prevUnreadMessages + 1);
      }
    } else {
      console.error('No se encontró ningún usuario con el correo electrónico proporcionado:', recipientEmail);
    }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };
    // mostrar los avisos de mensajes
  useEffect(() => {
    if (userEmail && loggedIn) {
      const unsubscribeMessages = onSnapshot(collection(db, 'userData'), async (snapshot) => {
        let unreadCount = 0;
        for (const doc of snapshot.docs) {
          const messagesCollectionRef = collection(doc.ref, 'messages');
          const messagesSnapshot = await getDocs(messagesCollectionRef);
          for (const messageDoc of messagesSnapshot.docs) {
            const messageData = messageDoc.data();
            if (!messageData.read && messageData.recipient === userEmail) {
              unreadCount++;
            }
          }
        }
        setUnreadMessages(unreadCount);
      });
  
      return () => {
        unsubscribeMessages();
      };
    }
  }, [userEmail, loggedIn]);


  // Función para obtener los mensajes del usuario.
  const getMessagesFromFirestore = async (userEmail) => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', userEmail)));
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const messagesQuerySnapshot = await getDocs(query(collection(userDocRef, 'messages'), orderBy('timestamp', 'asc')));       
        const messages = messagesQuerySnapshot.docs.map(doc => {
          const messageData = doc.data();
          console.log('Mensaje obtenido:', messageData);
          if (!messageData.hasOwnProperty('read')) {
            messageData.read = false;
          }
          return messageData;
        });
        return messages;
      } else {
        console.error('No se encontró ningún usuario con el correo electrónico proporcionado:', userEmail);
        return []; // Devolver un array vacío si no se encuentra ningún usuario
      }
    } catch (error) {
      console.error('Error al obtener mensajes del usuario:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    if (user) {
      // Llamar a la función getMessagesFromFirestore para obtener los mensajes del usuario.
    getMessagesFromFirestore(user.email)
    .then(messages => {
      // Calcular el número de mensajes no leídos.
      const unreadCount = messages.filter(message => !message.read).length;
      setUnreadMessages(unreadCount);
      console.log('unreadMessages actualizado:', unreadCount);
    })
    .catch(error => {
      console.error('Error al obtener mensajes del usuario:', error);
    });
    }
  }, [user]);


  // Funcion para diferenciar mensajes entre leidos y no leidos.
  const updateMessageReadStatus = async (recipientEmail) => {
    try {
      const userDocSnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', recipientEmail)));
      if (!userDocSnapshot.empty) {
        const userDocRef = userDocSnapshot.docs[0].ref;
        const messagesCollectionRef = collection(userDocRef, 'messages');
        const unreadMessagesQuerySnapshot = await getDocs(query(messagesCollectionRef, where('read', '==', false)));
        unreadMessagesQuerySnapshot.forEach(async (doc) => {
          await setDoc(doc.ref, { read: true }, { merge: true });
        });
      }
    } catch (error) {
      console.error('Error al actualizar el estado de leído del mensaje:', error);
    }
  };

  
  return (
    <MusiColaboContext.Provider value={{ 
      user,
      storage,
      username,
      picture,
      userEmail,
      loggedIn,
      unreadMessages,
      filteredProfiles,
      sendMessage,
      uploadImage,
      uploadVideo,
      createNewDocument,
      handleRegister,
      handleLogin,
      handleLogout, 
      getProfilesFromFirestore,
      getMessagesFromFirestore,
      updateProfileInFirestore,
      updateMessageReadStatus,
      setUnreadMessages,
      setFilteredProfiles,
      getVideosByUserEmail
      }}>
      {children}
    </MusiColaboContext.Provider>
  );
};

export default MusiColaboContextProvider;






