import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKHFs-SHzlAoOvD8duZb1he0samAj8q0k",
  authDomain: "rn-restuarant-app-64df9.firebaseapp.com",
  projectId: "rn-restuarant-app-64df9",
  storageBucket: "rn-restuarant-app-64df9.appspot.com",
  messagingSenderId: "262220698487",
  appId: "1:262220698487:web:f347802208e00ec4c8c772",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;