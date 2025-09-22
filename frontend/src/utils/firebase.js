// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiUvtv2GtEDTLLkyWsAOjk0-8FgkEfssg",
  authDomain: "in-the-moment-6c324.firebaseapp.com",
  projectId: "in-the-moment-6c324",
  storageBucket: "in-the-moment-6c324.firebasestorage.app",
  messagingSenderId: "888132165328",
  appId: "1:888132165328:web:ad2abeecc943697c6608d5",
  measurementId: "G-P22MJGVEKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


// Function to trigger popup
export const signInWithGoogle = async () => {
try{
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const idToken = await user.getIdToken(); // send to backend
  return { user, idToken };
}
catch(error){
    console.log(error)
}
  
};
