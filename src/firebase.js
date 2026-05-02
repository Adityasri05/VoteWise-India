import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAg-qTRNYiUvDMHU6aEEmtUoodNE3l4yA",
  authDomain: "votewise-india-b5e0c.firebaseapp.com",
  projectId: "votewise-india-b5e0c",
  storageBucket: "votewise-india-b5e0c.firebasestorage.app",
  messagingSenderId: "1014340596395",
  appId: "1:1014340596395:web:5cfd34ef480a3b783d3dee",
  measurementId: "G-N6QPYNGXCL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export default app;