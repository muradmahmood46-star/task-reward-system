import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCPo8DYml5GDjZkeXIKai7XzYE5kvaM11A",
    authDomain: "task-reward-system.firebaseapp.com",
    projectId: "task-reward-system",
    storageBucket: "task-reward-system.firebasestorage.app",
    messagingSenderId: "917463833362",
    appId: "1:917463833362:web:000d33dddc54969d9ff1cb",
    measurementId: "G-8BBJ9CRTW3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);