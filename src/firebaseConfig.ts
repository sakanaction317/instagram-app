// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAxkmjQxXRVd09BygoB-zWVGM3VnLTVOOY",
  authDomain: "react-instagram-b21c5.firebaseapp.com",
  projectId: "react-instagram-b21c5",
  storageBucket: "react-instagram-b21c5.firebasestorage.app",
  messagingSenderId: "351304588693",
  appId: "1:351304588693:web:c05d371235ffa70e622a9c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
//export const storage = getStorage(app);

export { firebaseConfig };
