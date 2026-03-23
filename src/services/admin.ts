import { auth, db } from "../config/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

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
 * Add Admin (NO PASSWORD)
 */
export const addAdmin = async (
  uid: string,
  email: string,
  role: string = "admin"
) => {
  await setDoc(doc(db, "admins", uid), {
    email,
    role,
    createdAt: serverTimestamp(),
  });
};

/**
 * Update Admin
 */
export const updateAdmin = async (
  uid: string,
  data: { email?: string; role?: string }
) => {
  await updateDoc(doc(db, "admins", uid), data);
};

/**
 * Remove Admin
 */
export const removeAdmin = async (uid: string) => {
  await deleteDoc(doc(db, "admins", uid));
};

/**
 * Get all admins
 */
export const getAdminList = async (): Promise<any[]> => {
  const snapshot = await getDocs(collection(db, "admins"));
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
};