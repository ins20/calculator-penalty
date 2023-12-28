// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlnCegcjMfQY9p_rn0Ts-mL93qmlz72uo",
  authDomain: "calculator-dcfb4.firebaseapp.com",
  projectId: "calculator-dcfb4",
  storageBucket: "calculator-dcfb4.appspot.com",
  messagingSenderId: "649527448160",
  appId: "1:649527448160:web:eafa45fa7a3dd64866a905",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
