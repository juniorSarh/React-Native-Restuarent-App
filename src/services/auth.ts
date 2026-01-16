import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const registerUser = async (user: {
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}) => {
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
    throw new Error(error.message || 'Registration failed');
  }
};

export const loginUser = async (email: string, password: string) => {
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
    throw new Error(error.message || 'Login failed');
  }
};
