// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "lfms-24960.firebaseapp.com",
  projectId: "lfms-24960",
  storageBucket: "lfms-24960.appspot.com",
  messagingSenderId: "459385620900",
  appId: "1:459385620900:web:8d13997f4cefb44d111931",
  measurementId: "G-88B0K0Q93J",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
