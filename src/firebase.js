import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDglrtD6MN0rNzB_NHaT0kGNYkHpqBElkI",
  authDomain: "sat-math-jayden.firebaseapp.com",
  projectId: "sat-math-jayden",
  storageBucket: "sat-math-jayden.firebasestorage.app",
  messagingSenderId: "540358122189",
  appId: "1:540358122189:web:e3a012b1189c6f00d96784"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
