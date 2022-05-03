import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { getStorage } from 'firebase/storage' ;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUaH_pM6S0P8Xy2jnlj1-HNCXjCyFbZiw",
  authDomain: "social-media-app-2bc8b.firebaseapp.com",
  projectId: "social-media-app-2bc8b",
  storageBucket: "social-media-app-2bc8b.appspot.com",
  messagingSenderId: "1095065958990",
  appId: "1:1095065958990:web:c959668af292cc3aed211f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestoreDB = getFirestore(app);
const storage = getStorage(app);

// Get collection from Firestore Database
export const getCollection = async (collectionName) => {
  const col = collection(firestoreDB, collectionName);
  const collectionSnapshot = await getDocs(col);
  const result = collectionSnapshot.docs.map(doc => doc.data());
  return result;
};

export { auth, firestoreDB, storage };