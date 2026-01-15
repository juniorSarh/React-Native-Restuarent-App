// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9_TrGY11eND2FwRAXb7oV6fWrUxNSJDk",
  authDomain: "royalry-8cfe2.firebaseapp.com",
  projectId: "royalry-8cfe2",
  storageBucket: "royalry-8cfe2.firebasestorage.app",
  messagingSenderId: "882560462234",
  appId: "1:882560462234:web:69898d6d62a019c874de23",
  measurementId: "G-7Z4T5Q78Y6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);