import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

/* =======================
   TYPES
======================= */

export type RegisterPayload = {
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
};

export type AuthUser = {
  uid: string;
  email: string;
  name: string;
  surname: string;
  contactNumber: string;
  address: string;
};

/* =======================
   REGISTER
======================= */

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthUser> => {
  const { email, password, name, surname, contactNumber, address } = payload;

  try {
    // 1️⃣ Create user in Firebase Auth
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = credential.user.uid;

    // 2️⃣ Save profile in Firestore
    const userData = {
      uid,
      email,
      name,
      surname,
      contactNumber,
      address,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", uid), userData);

    return {
      uid,
      email,
      name,
      surname,
      contactNumber,
      address,
    };
  } catch (error: any) {
    console.error("Firebase registration error:", error);

    // Friendly error messages
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters");
    }

    throw new Error("Registration failed");
  }
};

/* =======================
   LOGIN
======================= */

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    // 1️⃣ Sign in
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = credential.user.uid;

    // 2️⃣ Fetch Firestore profile
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      throw new Error("User profile not found");
    }

    const data = snapshot.data();

    return {
      uid,
      email: data.email,
      name: data.name,
      surname: data.surname,
      contactNumber: data.contactNumber,
      address: data.address,
    };
  } catch (error: any) {
    console.error("Firebase login error:", error);

    if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid email or password");
    }

    throw new Error("Login failed");
  }
};
