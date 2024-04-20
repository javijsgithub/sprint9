import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, orderBy, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
export const MusiColaboContext = createContext();

const MusiColaboContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [picture, setPicture] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // hook para que no se desloguee la app al recargar la pagina
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario está logueado
        setUser(user);
        setUserEmail(user.email);
        setLoggedIn(true);
        fetchUserDetails(user.email);
      } else {
        // Usuario no está logueado
        setUser(null);
        setUserEmail('');
        setLoggedIn(false);
        setUsername('');
        setPicture('');
        setLoggedIn(false);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe(); // Limpiar el observador cuando el componente se desmonte
  }, []);

  const fetchUserDetails = async (email) => {
    const userQuery = query(collection(db, 'userData'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      setUsername(userData.username || '');
      setPicture(userData.picture || '');
    }
  };

  
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

  const deleteUserProfileFromFirestore = async (userEmail) => {
    try {
      // Obtener el documento del usuario basado en el correo electrónico
      const querySnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', userEmail)));
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
  
        // Eliminar todas las subcolecciones de 'messages'
        const messagesCollectionRef = collection(userDocRef, 'messages');
        const messagesSnapshot = await getDocs(messagesCollectionRef);
        // Eliminar cada mensaje individualmente
        const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
  
        // Ahora que las subcolecciones están vacías, eliminar el documento principal
        await deleteDoc(userDocRef);
        console.log('Perfil del usuario y subcolecciones eliminados exitosamente de Firestore');
        
        // Para eliminar la cuenta de autenticación de Firebase
        if (auth.currentUser) {
          await deleteUser(auth.currentUser);
          console.log('Cuenta de autenticación de Firebase eliminada con éxito');
        }
  
        // Resetear estados relevantes o realizar otras operaciones de limpieza
        setUser(null);
        setLoggedIn(false);
        setUserEmail('');
        setUsername('');
        setPicture('');
        setUnreadMessages(0);
        alert("Tu cuenta ha sido eliminada con éxito.");
      }
    } catch (error) {
      console.error('Error al eliminar el perfil del usuario de Firestore y la cuenta de autenticación:', error);
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
  const sendMessage = async (recipientEmail, recipientName, message, originalMessageId = null, originalThreadId = null) => {
    try {
      console.log("Enviando mensaje a...", recipientName);
      console.log("Destinatario userId:", recipientEmail);
      console.log("Mensaje:", message);
      console.log("Message ID:", originalMessageId); 

      // Obtener la referencia al documento del destinatario usando el correo electrónico
    const querySnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', recipientEmail)));
    if (!querySnapshot.empty) {
      const recipientDocRef = querySnapshot.docs[0].ref;
      const messagesCollectionRef = collection(recipientDocRef, 'messages');
      const threadId = originalThreadId || originalMessageId || (await addDoc(messagesCollectionRef, {})).id; // Si no hay original, crea un nuevo hilo

      await addDoc(messagesCollectionRef, {
        sender: userEmail,
        recipient: recipientEmail, 
        message: message,
        timestamp: new Date(),
        read: false, // Marcar el mensaje como no leído cuando se envía
        replyTo: originalMessageId,
        threadId: threadId
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
 
  
  // hook para que muestren en pantalla los avisos de mensajes nuevos recibidos
  useEffect(() => {
    let unsubscribe = () => {}; // Inicializa una función de desuscripción vacía
  
    if (userEmail && loggedIn) {
      const queryRef = collection(db, 'userData');
      unsubscribe = onSnapshot(queryRef, async (snapshot) => {
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
        console.log("Mensajes nuevos:", unreadCount);
        setUnreadMessages(unreadCount);
      });
    }
  
    return () => {
      unsubscribe(); // Esto se llama cuando el componente se desmonta o cuando los valores de userEmail o loggedIn cambian
    };
  }, [userEmail, loggedIn]);
    
    
  // Función para obtener los mensajes del usuario.
  const getMessagesFromFirestore = async (userEmail) => {
    try {
      const userSnapshot = await getDocs(query(collection(db, 'userData'), where('email', '==', userEmail)));
      if (!userSnapshot.empty) {
        const userRef = userSnapshot.docs[0].ref;

        // Cargar mensajes del usuario
        const messagesQuerySnapshot = await getDocs(query(collection(userRef, 'messages'), orderBy('timestamp', 'desc')));
        let messages = messagesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), userRef: userRef.id }));

        // Cargar detalles del mensaje original cuando es necesario
        const messagesMap = {};
        const loadMessageDetails = async (message) => {
          if (message.replyTo && !messagesMap[message.replyTo]) {
            try {
              // Busca en todos los documentos 'userData' el mensaje original
              const allUsersSnapshot = await getDocs(collection(db, 'userData'));
              for (const userDoc of allUsersSnapshot.docs) {
                const potentialOriginalMessageDoc = await getDoc(doc(db, 'userData', userDoc.id, 'messages', message.replyTo));
                if (potentialOriginalMessageDoc.exists()) {
                  messagesMap[message.replyTo] = { id: message.replyTo, ...potentialOriginalMessageDoc.data() };
                }
              }
            } catch (error) {
              console.error("Failed to load original message:", error);
            }
          }
        };

        // Cargar mensajes replyTo si no están presentes
        await Promise.all(messages.map(loadMessageDetails));

        // Construir los mensajes con la información de replyTo
        messages = messages.map(message => ({
          ...message,
          replyContent: messagesMap[message.replyTo]?.message || "Mensaje original no encontrado"
        }));

        // Organizar mensajes en hilos
        const threads = messages.reduce((acc, msg) => {
          const threadId = msg.threadId || msg.id;
          if (!acc[threadId]) {
            acc[threadId] = { unread: [], read: [] };
          }
          acc[threadId][msg.read ? 'read' : 'unread'].push(msg);
          return acc;
        }, {});

        return Object.values(threads);
      } else {
        console.error('No user found with the provided email:', userEmail);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving user messages:', error);
      throw error;
    }
  };
  
  // hook para que se contabilizen los mensajes nuevos recibidos
  useEffect(() => {
    if (user) {
      getMessagesFromFirestore(user.email)
        .then(threads => {
          let unreadCount = 0;
          // Aquí recorremos cada hilo y cada mensaje dentro del hilo
          threads.forEach(thread => {
            thread.unread.forEach(message => {
              if (!message.read) {
                unreadCount++;  // Aumentamos el conteo solo si el mensaje no ha sido leído
              }
            });
          });
          setUnreadMessages(unreadCount);  // Establecer el estado de mensajes no leídos
          console.log('unreadMessages actualizado:', unreadCount);
        })
        .catch(error => {
          console.error('Error al obtener mensajes del usuario:', error);
        });
    }
  }, [user]);
  

  // Funcion para diferenciar mensajes entre leidos y no leidos.
  const updateMessageReadStatus = async (userId, messageId) => {
    try {
      const messageRef = doc(db, 'userData', userId, 'messages', messageId);
      await updateDoc(messageRef, {
        read: true  
      });
      console.log("Mensaje actualizado a leído:", messageId);
    } catch (error) {
      console.error('Error al actualizar el estado de lectura del mensaje:', error);
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
      loadingAuth,
      instrumentFilter, 
      cityFilter, 
      setCityFilter,
      setInstrumentFilter,
      sendMessage,
      uploadImage,
      uploadVideo,
      createNewDocument,
      deleteUserProfileFromFirestore,
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
