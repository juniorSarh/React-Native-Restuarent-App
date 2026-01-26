import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const createOrder = async (items: any[], total: number) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  await addDoc(collection(db, "orders"), {
    userId: user.uid,
    items,
    totalAmount: total,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
