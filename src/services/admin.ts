import { auth, db } from "../config/firebase";
import { doc, setDoc, deleteDoc, collection, getDocs, getDoc, serverTimestamp } from "firebase/firestore";

/**
 * Check if current logged-in user is an admin
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  const snap = await getDoc(doc(db, "admins", user.uid));
  return snap.exists();
};

/**
 * Check if a specific user is an admin
 */
export const getAdmin = async (uid: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists();
};

/**
 * Add Admin with attributes
 */
export const addAdmin = async (
  uid: string,
  email: string,
  password: string,
  role: string = "admin"
) => {
  await setDoc(doc(db, "admins", uid), {
    email,
    password, // ⚠️ In production, never store plaintext passwords
    role,
    createdAt: serverTimestamp(),
  });
};

/**
 * Remove Admin
 */
export const removeAdmin = async (uid: string) => {
  await deleteDoc(doc(db, "admins", uid));
};

/**
 * Get all Admins
 */
export const getAdminList = async (): Promise<any[]> => {
  const snapshot = await getDocs(collection(db, "admins"));
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
};