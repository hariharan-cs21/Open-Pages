import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA1UX53R5_P4SsvtpMvntzJcc_G5QQ65ZM",
    authDomain: "postwebsite-db060.firebaseapp.com",
    projectId: "postwebsite-db060",
    storageBucket: "postwebsite-db060.appspot.com",
    messagingSenderId: "323811300326",
    appId: "1:323811300326:web:d9dc652e6d7b5314473c27"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
