import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db, googleProvider } from "../config/firebase";
import { useEffect, useState, createContext } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState([]);

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signUpUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        setUser(currentUser);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            id: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || "",
            createdAt: serverTimestamp(),
          });
        }
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInUser,
        signUpUser,
        signInWithGoogle,
        user,
        isLoading,
        setIsLoading,
        sections,
        setSections,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
