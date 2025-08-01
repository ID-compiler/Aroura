// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


  const firebaseConfig = {
  apiKey: "AIzaSyDmW4fytlST-olKVc_fvgyzM_qfLj-Nczk",
  authDomain: "aroura-art.firebaseapp.com",
  projectId: "aroura-art",
  storageBucket: "aroura-art.firebasestorage.app",
  messagingSenderId: "55490530516",
  appId: "1:55490530516:web:1920d4ef264df41943bf41",
  measurementId: "G-Q9XJS2S8MK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
