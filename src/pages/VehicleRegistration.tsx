import React from 'react';
import VehicleForm from '../components/VehicleForm';
import VehicleList from '../components/VehicleList';
import { db } from '../firebaseConfig'; // Ajusta la ruta según la ubicación de tu archivo

// Ahora puedes usar `db` para interactuar con Firestore, por ejemplo:
import { collection, getDocs } from "firebase/firestore";

async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "nombreDeTuColeccion"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
}

const VehicleRegistration: React.FC = () => {
    return (
        <div>
            <VehicleForm />
            <VehicleList />
        </div>
    );
};

export default VehicleRegistration;
