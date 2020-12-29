import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdouNP9RRVKQ_tz9zmUdAdYUUZLTkhyi8",
  authDomain: "voice-link.firebaseapp.com",
  projectId: "voice-link",
  storageBucket: "voice-link.appspot.com",
  messagingSenderId: "521046130606",
  appId: "1:521046130606:web:80a21f2fb1753acb3cd23f",
};
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const storage = firebase.storage();
