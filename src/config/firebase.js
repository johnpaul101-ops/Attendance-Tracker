import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCS4Tic4Blm9_8EurGxzWfqj4lVLGzwzPQ",
  authDomain: "attendance-tracker-175c1.firebaseapp.com",
  projectId: "attendance-tracker-175c1",
  storageBucket: "attendance-tracker-175c1.firebasestorage.app",
  messagingSenderId: "1047312916326",
  appId: "1:1047312916326:web:bf2c3c7b9a0b3704d072a7",
  measurementId: "G-89GJK3XF8B",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
  sizeBytes: CACHE_SIZE_UNLIMITED,
});
