import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const FOOD_COLLECTION = "foodItems";

export const listenToFoodItems = (
  callback: (items: any[]) => void
) => {
  const colRef = collection(db, FOOD_COLLECTION);

  return onSnapshot(colRef, snapshot => {
    const items: any[] = [];
    snapshot.forEach(doc => {
      items.push({ id: doc.id, ...doc.data() });
    });
    callback(items);
  });
};

export const addFoodItem = async (data: any) => {
  await addDoc(collection(db, FOOD_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateFoodItem = async (id: string, data: any) => {
  await updateDoc(doc(db, FOOD_COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteFoodItem = async (id: string) => {
  await deleteDoc(doc(db, FOOD_COLLECTION, id));
};
