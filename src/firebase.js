import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- NEW

const firebaseConfig = {
  apiKey: "AIzaSyDxXyNdbXBPHCQbJ8K3Uf3lqTsQopMw_l4",
  authDomain: "portfolink-9d2d0.firebaseapp.com",
  projectId: "portfolink-9d2d0",
  storageBucket: "portfolink-9d2d0.appspot.com",
  messagingSenderId: "492213495764",
  appId: "1:492213495764:web:3d20732f3fc063bbbe1841",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // <-- NEW
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Export services
export { auth, db, storage, googleProvider, githubProvider };
