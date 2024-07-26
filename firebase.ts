import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9UYPDOr10lHZuZyARoW01BL6HLmCkdkM",
  authDomain: "linkedin-test-2cda6.firebaseapp.com",
  projectId: "linkedin-test-2cda6",
  storageBucket: "linkedin-test-2cda6.appspot.com",
  messagingSenderId: "383813022025",
  appId: "1:383813022025:web:19c340e417b464d5526a98"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const db = getFirestore(app);

export const storage = getStorage(app);