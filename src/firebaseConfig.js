import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Aapka asli config jo abhi aapne dhoonda:
const firebaseConfig = {
    apiKey: "AIzaSyCPo8DYml5GDjZkeXIKai7XzYE5kvaM11A",
    authDomain: "task-reward-system.firebaseapp.com",
    projectId: "task-reward-system",
    storageBucket: "task-reward-system.firebasestorage.app",
    messagingSenderId: "917463833362",
    appId: "1:917463833362:web:000d33dddc54969d9ff1cb",
    measurementId: "G-8BBJ9CRTW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inko export karein taake App.jsx use kar sakay
export const db = getFirestore(app);
export const auth = getAuth(app);