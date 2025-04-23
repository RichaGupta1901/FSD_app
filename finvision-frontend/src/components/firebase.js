// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiHG-Usj381fiBD3_I6TYLRnXjLgoQRLA",
  authDomain: "finvision-51433.firebaseapp.com",
  projectId: "finvision-51433",
  storageBucket: "finvision-51433.firebasestorage.app",
  messagingSenderId: "871041238761",
  appId: "1:871041238761:web:2b516acc416206432d9278",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login Failed", error);
  }
};

const logout = async () => {
  await signOut(auth);
};

export { app, auth, signInWithGoogle, logout };