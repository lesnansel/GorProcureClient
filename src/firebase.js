// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt-31gC5AdpkwZ-AbRTQav7KTHnuHaAME",
  authDomain: "procurement-374ed.firebaseapp.com",
  projectId: "procurement-374ed",
  storageBucket: "procurement-374ed.firebasestorage.app",
  messagingSenderId: "17053069132",
  appId: "1:17053069132:web:29a2cb8cc2bb1296bde9e9"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(firebaseApp); // Authentication
export const provider = new GoogleAuthProvider(); // Google Sign-In Provider
export const db = getFirestore(firebaseApp); // Firestore Database
export const rdb = getDatabase(firebaseApp); // Realtime Database
export const storage = getStorage(firebaseApp); // Storage


// Function for Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user);
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
};

// Function to Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out.");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

export { ref, onValue };