import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Ajusta la ruta según la ubicación de tu archivo

// Ahora puedes usar `db` para interactuar con Firestore, por ejemplo:
import { collection, getDocs } from "firebase/firestore";

async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "nombreDeTuColeccion"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
}

const VehicleSummary: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);

    useEffect(() => {
        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        setVehicles(storedVehicles);
    }, []);

    return (
        <div className="VehicleSummary">
            <h2>Resumen de Vehículos</h2>
            <ul>
                {vehicles.map((vehicle, index) => (
                    <li key={index}>
                        {vehicle.date} - {vehicle.companyName} - {vehicle.licensePlate} - {vehicle.vehicleType} - {vehicle.customerName} - Lavado por: {vehicle.washer || 'No asignado'}
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default VehicleSummary;
