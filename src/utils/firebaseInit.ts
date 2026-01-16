import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export const initializeFirebase = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
