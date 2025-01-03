// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración obtenida de Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCWBG57EKbhD47xfr3kt3Fze8tp5O2eEjc",
  authDomain: "fluiana-d4841.firebaseapp.com",
  projectId: "fluiana-d4841",
  storageBucket: "fluiana-d4841.firebasestorage.app",
  messagingSenderId: "515088677482",
  appId: "1:515088677482:web:6cf54960d32c7de8626813"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
