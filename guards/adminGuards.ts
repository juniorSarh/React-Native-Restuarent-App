import { auth, db } from "../src/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const requireAdmin = async () => {
  const user = auth.currentUser;
  if (!user) return false;

  const snap = await getDoc(doc(db, "admins", user.uid));
  return snap.exists();
};
