// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Si decides usar Analytics
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBqB8U4k2CZKNM1H4MPPisYziLcZSJMMiM",
  authDomain: "applavaderoartesanal.firebaseapp.com",
  projectId: "applavaderoartesanal",
  storageBucket: "applavaderoartesanal.appspot.com",
  messagingSenderId: "805649099589",
  appId: "1:805649099589:web:76d48b336177f037ba6c2c",
  measurementId: "G-4S5YWNCYDB",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Puedes omitir esta línea si no usas Analytics
const db = getFirestore(app); // Inicializa Firestore

// Exporta Firestore
export { db };
