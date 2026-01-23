import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

const FOOD_COLLECTION = "fooditems";

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
  try {
    console.log('Adding food item with data:', data);
    const docRef = await addDoc(collection(db, FOOD_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Food item added with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error adding food item:', error);
    throw error;
  }
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
