import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

type RegisterUserProps = {
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
};

export const registerUser = async ({
  name,
  surname,
  email,
  password,
  contactNumber,
  address,
}: RegisterUserProps) => {
  // 1. Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const uid = userCredential.user.uid;

  // 2. Save extra user info in Firestore
  await setDoc(doc(db, "users", uid), {
    name,
    surname,
    email,
    contactNumber,
    address,
    role: "user",
    createdAt: serverTimestamp(),
  });

  return userCredential.user;
};

export const registerAdmin = async ({
  email,
  password, 
}: {email: string; password: string}) => {
  // 1. Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const uid = userCredential.user.uid;

  // 2. Save admin info in Firestore
  await setDoc(doc(db, "admins", uid), {
    email,
    role: "admin",
    createdAt: serverTimestamp(),
  });

  return userCredential.user;

};

// login user
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

