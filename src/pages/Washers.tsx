import React from "react";
import WasherLog from "../components/WasherLog";
import { db } from '../firebaseConfig'; // Ajusta la ruta según la ubicación de tu archivo

// Ahora puedes usar `db` para interactuar con Firestore, por ejemplo:
import { collection, getDocs } from "firebase/firestore";

async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "nombreDeTuColeccion"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
}

const Washers: React.FC = () => {
    return (
        <div>
            <WasherLog />
        </div>
    );
};

export default Washers;
