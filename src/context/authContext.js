import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

    const signIn = async (email, password) => {
      await setPersistence(auth, browserSessionPersistence);
      return signInWithEmailAndPassword(auth, email, password);
    };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          setUser(doc.data());
        });
      } else {
        console.log("nenhum usuario");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ user, logout, signIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
