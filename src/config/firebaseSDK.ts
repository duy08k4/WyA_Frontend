// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Config này lấy trong Firebase Console (Project Settings -> General -> Your apps)
const firebaseConfig = {
    apiKey: "AIzaSyBM6ZMQw6h705Stg5okPQuwaWdXilCEjJc",
    authDomain: "wya-where-you-at.firebaseapp.com",
    projectId: "wya-where-you-at",
    storageBucket: "wya-where-you-at.firebasestorage.app",
    messagingSenderId: "59746391501",
    appId: "1:59746391501:web:b07cdf4dc0fe4bc16ae084",
    measurementId: "G-785D7SNY5W"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

export { db };
