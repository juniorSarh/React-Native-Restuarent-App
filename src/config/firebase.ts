import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

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

// 🔥 FIX: Use AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);






