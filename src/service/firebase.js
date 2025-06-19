import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdp1LOuAzRjjKcQ8dcBb2a4UfSvAQOEXw",
  authDomain: "wineline-b7140.firebaseapp.com",
  projectId: "wineline-b7140",
  storageBucket: "wineline-b7140.firebasestorage.app",
  messagingSenderId: "819649735039",
  appId: "1:819649735039:web:2c0f2e6ba4580931be524a",
  measurementId: "G-N47BK4C8CX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAuth(app);
