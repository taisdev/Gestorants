import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFyRF7qT8iGYk-t5_cNxSndPfNBrNh70Q",
  authDomain: "api-app-delivery-992fa.firebaseapp.com",
  projectId: "api-app-delivery-992fa",
  storageBucket: "api-app-delivery-992fa.appspot.com",
  messagingSenderId: "961369885360",
  appId: "1:961369885360:web:dc0b98502df9ddbc980975",
  measurementId: "G-FNV55KNJN1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;