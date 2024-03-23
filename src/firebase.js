import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCVlwc1AxNMnZEcaYDJ2HtV58nlKEMhbo",
  authDomain: "first-iteration-test.firebaseapp.com",
  projectId: "first-iteration-test",
  storageBucket: "first-iteration-test.appspot.com",
  messagingSenderId: "853996848803",
  appId: "1:853996848803:web:10df6ce8c0f290499fa116"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)


