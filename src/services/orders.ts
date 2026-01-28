import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const createOrder = async (items: any[], total: number, paymentStatus: 'paid' | 'pending' = 'paid') => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const orderData = {
    userId: user.uid,
    items,
    totalAmount: total,
    status: "pending",
    paymentStatus,
    createdAt: serverTimestamp(),
  };

  const orderRef = await addDoc(collection(db, "orders"), orderData);
  return orderRef.id;
};
