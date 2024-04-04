import { initializeApp } from 'firebase/app';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCuDC9lJoxIH3W40BFLFWKrOA2M0FTEDI",
  authDomain: "financetracker-6ff07.firebaseapp.com",
  projectId: "financetracker-6ff07",
  storageBucket: "financetracker-6ff07.appspot.com",
  messagingSenderId: "751809296128",
  appId: "1:751809296128:web:04b851f43d4f9ab211e5e5",
  measurementId: "G-7KQEGS7VL1"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export default app;
