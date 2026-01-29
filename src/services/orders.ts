import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const createOrder = async (items: any[], total: number, paymentStatus: 'paid' | 'pending' = 'paid') => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  // Get user profile information
  let userProfile = null;
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      userProfile = userSnapshot.data();
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }

  const orderData = {
    userId: user.uid,
    items,
    totalAmount: total,
    status: "pending",
    paymentStatus,
    createdAt: serverTimestamp(),
    // Include user profile information with the order
    customerInfo: userProfile ? {
      name: userProfile.name + ' ' + userProfile.surname,
      email: userProfile.email,
      contactNumber: userProfile.contactNumber,
      address: userProfile.address,
    } : {
      name: user.email || 'Unknown User',
      email: user.email || '',
      contactNumber: '',
      address: '',
    },
  };

  const orderRef = await addDoc(collection(db, "orders"), orderData);
  return orderRef.id;
};
