import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvfeDMTgGY0nIQDF54grNZCoaT3wQSUnw",
  authDomain: "pixai-portfolio.firebaseapp.com",
  projectId: "pixai-portfolio",
  storageBucket: "pixai-portfolio.firebasestorage.app",
  messagingSenderId: "350336899242",
  appId: "1:350336899242:web:550ef166c92b34a2a518d3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);