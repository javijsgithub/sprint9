// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnn7fB1DXOJqEKWUOqm2krq1v3xj0WMb8",
  authDomain: "musicolabo-8a2d2.firebaseapp.com",
  projectId: "musicolabo-8a2d2",
  storageBucket: "musicolabo-8a2d2.appspot.com",
  messagingSenderId: "307438348",
  appId: "1:307438348:web:b46dcfc54c3b62e594df29",
  measurementId: "G-1HH17VVHCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app, analytics);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth,db, collection, storage };
