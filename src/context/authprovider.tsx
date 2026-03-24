import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const uid = firebaseUser.uid;

        // 🔍 Check Admin
        const adminSnap = await getDoc(doc(db, "admins", uid));
        if (adminSnap.exists()) {
          router.replace("/admin/dashboard");
          setLoading(false);
          return;
        }

        // 🔍 Check User
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          router.replace("/(tabs)/home");
          setLoading(false);
          return;
        }
      } else {
        setUser(null);
        router.replace("/");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};