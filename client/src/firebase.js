// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpOLY3nhc5LBbSjcosp6EYd3YDjEB-p2I",
  authDomain: "image-and-docs.firebaseapp.com",
  projectId: "image-and-docs",
  storageBucket: "image-and-docs.appspot.com",
  messagingSenderId: "339118230020",
  appId: "1:339118230020:web:fa49fdead27d6fdfb18351"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);