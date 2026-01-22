import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
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

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Trim inputs to avoid invisible spaces
    const emailTrimmed = email.trim();

    // Sign in with Firebase Auth
    const credential = await signInWithEmailAndPassword(
      auth,
      emailTrimmed,
      password
    );

    const uid = credential.user.uid;

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", uid));
    const adminDoc = await getDoc(doc(db, "admins", uid));

    // Determine role
    const isAdmin = adminDoc.exists();
    const profileData = userDoc.exists() ? userDoc.data() : {};

    return {
      uid,
      email: emailTrimmed,
      role: isAdmin ? "admin" : "user",
      profile: profileData,
    };
  } catch (err: any) {
    console.error("Firebase login error:", err);
    // Handle different Firebase Auth errors
    switch (err.code) {
      case "auth/user-not-found":
        throw new Error("No account found with this email");
      case "auth/wrong-password":
        throw new Error("Incorrect password");
      case "auth/invalid-email":
        throw new Error("Invalid email format");
      default:
        throw new Error(err.message || "Login failed");
    }
  }
};
/* =======================
   CHECK ADMIN
======================= */
export const isAdminUser = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  const snap = await getDoc(doc(db, "admins", user.uid));
  return snap.exists();
};