import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBTKsomUZfER3ufKuIjP5dDAkRbbMY-1oA",
  authDomain: "studio-1442930565-b00ef.firebaseapp.com",
  projectId: "studio-1442930565-b00ef",
  storageBucket: "studio-1442930565-b00ef.firebasestorage.app",
  messagingSenderId: "670785176878",
  appId: "1:670785176878:web:f54a74177a4a20c32d66bf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export default app;
