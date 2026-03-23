import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { router } from "expo-router";

// =======================
// 👤 REGISTER USER
// =======================
export const registerUser = async ({
  name,
  surname,
  email,
  password,
  contactNumber,
  address,
}: {
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

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
  } catch (error: any) {
    console.log("Register User Error:", error);

    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters");
    } else {
      throw new Error("User registration failed");
    }
  }
};

// =======================
// 🛡️ REGISTER ADMIN
// =======================
export const registerAdmin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    await setDoc(doc(db, "admins", uid), {
      email,
      role: "admin",
      createdAt: serverTimestamp(),
    });

    return userCredential.user;
  } catch (error: any) {
    console.log("Register Admin Error:", error);

    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters");
    } else {
      throw new Error("Admin registration failed");
    }
  }
};


// =======================
// 🔐 LOGIN (AUTO ROLE DETECTION)
// =======================
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // 🔍 Check ADMIN first
    const adminSnap = await getDoc(doc(db, "admins", uid));

    if (adminSnap.exists()) {
      router.replace("/admin/dashboard");
      return {
        user: userCredential.user,
        role: "admin",
      };
    }

    // 🔍 Then check USER
    const userSnap = await getDoc(doc(db, "users", uid));

    if (userSnap.exists()) {
      router.replace("/(tabs)/home");
      return {
        user: userCredential.user,
        role: "user",
      };
    }

    // ❗ No role found
    throw new Error("User role not found");
  } catch (error: any) {
    console.log("Login Error:", error);

    if (error.code === "auth/user-not-found") {
      throw new Error("User does not exist");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password");
    } else if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid email or password");
    } else {
      throw new Error(error.message || "Login failed");
    }
  }
};