import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfkNnrm0_Xjm4T4rKe5IEN1VP5jrLfpOo",
  authDomain: "instachat-92f95.firebaseapp.com",
  projectId: "instachat-92f95",
  storageBucket: "instachat-92f95.appspot.com",
  messagingSenderId: "1041538275834",
  appId: "1:1041538275834:web:ed524e4f416a47b1306c43",
  measurementId: "G-3MPN0PKJKQ",
};
// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
export const fireBaseAuth = getAuth(app);
