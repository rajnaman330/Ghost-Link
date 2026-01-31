import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXQJLAGbzLHNFy6wrkewaaT0-W076no1I",
  authDomain: "ghost-link-49e6f.firebaseapp.com",
  projectId: "ghost-link-49e6f",
  storageBucket: "ghost-link-49e6f.firebasestorage.app",
  messagingSenderId: "290690056960",
  appId: "1:290690056960:web:08456e51d86eb2293d69e5",
  measurementId: "G-9NK18FJG0W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);