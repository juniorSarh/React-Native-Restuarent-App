import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Mock auth fallback
const useMockAuth = true; // Set to true if Firebase fails

export const registerUser = async (user: {
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}) => {
  if (useMockAuth) {
    // Mock registration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user.email && user.password && user.name && user.surname) {
          resolve({ user: { email: user.email, name: user.name, uid: 'mock-user-id' } });
        } else {
          reject(new Error('All fields are required'));
        }
      }, 1000);
    });
  }

  try {
    const { email, password, ...profile } = user;

    // Create user in Firebase Auth
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Store user data in Firestore 'users' collection
    await setDoc(doc(db, 'users', credential.user.uid), {
      email,
      name: profile.name,
      surname: profile.surname,
      contactNumber: profile.contactNumber,
      address: profile.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { user: { email, name: profile.name, uid: credential.user.uid } };
  } catch (error: any) {
    console.error('Firebase registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

export const loginUser = async (email: string, password: string) => {
  if (useMockAuth) {
    // Mock login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          resolve({ user: { email, name: 'Test User', uid: 'mock-user-id' } });
        } else if (email && password) {
          resolve({ user: { email, name: 'Demo User', uid: 'mock-user-id' } });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  try {
    // Sign in user
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // Get user data from Firestore
    const snapshot = await getDoc(doc(db, 'users', credential.user.uid));
    
    if (snapshot.exists()) {
      return { user: { email, ...snapshot.data(), uid: credential.user.uid } };
    } else {
      throw new Error('User data not found');
    }
  } catch (error: any) {
    console.error('Firebase login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};
