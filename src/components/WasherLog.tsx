import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { db } from '../firebaseConfig'; // Ajusta la ruta según la ubicación de tu archivo

// Ahora puedes usar `db` para interactuar con Firestore, por ejemplo:
import { collection, getDocs } from "firebase/firestore";

async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "nombreDeTuColeccion"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
}

interface Vehicle {
    customerType: string;
    companyName: string;
    licensePlate: string;
    vehicleType: string;
    customerName: string;
    phoneNumber: string;
    date: string;
    washer: string;
    amount: number;
}

const Washers: React.FC = () => {
    const [washers, setWashers] = useState<string[]>([]);
    const [newWasher, setNewWasher] = useState('');
    const [selectedWasherToRemove, setSelectedWasherToRemove] = useState<string>('');
    const [selectedWasherSummary, setSelectedWasherSummary] = useState<string>('');
    const [vehicleSummary, setVehicleSummary] = useState<Vehicle[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [washerPrices, setWasherPrices] = useState<{ [key: string]: number }>({
        autoRentacar: 500,
        suvRentacar: 600,
        fourByFour: 800,
        combiRentacar: 1000,
        autoParticular: 500,
        suvParticular: 600,
        fourByFourParticular: 800,
        combiParticular: 1000,
    });

    useEffect(() => {
        const storedWashers = JSON.parse(localStorage.getItem('washers') || '[]');
        setWashers(storedWashers);

        const storedWasherPrices = JSON.parse(localStorage.getItem('washerPrices') || '{}');
        if (Object.keys(storedWasherPrices).length > 0) {
            setWasherPrices(storedWasherPrices);
        }
    }, []);

    const handleAddWasher = () => {
        if (newWasher && !washers.includes(newWasher)) {
            const updatedWashers = [...washers, newWasher];
            setWashers(updatedWashers);
            localStorage.setItem('washers', JSON.stringify(updatedWashers));
            setNewWasher('');
            Swal.fire('Éxito', 'Lavador agregado correctamente', 'success');
        } else {
            Swal.fire('Error', 'El lavador ya existe o no es válido', 'error');
        }
    };

    const handleRemoveWasher = () => {
        if (selectedWasherToRemove) {
            const confirm = window.confirm(`¿Estás seguro de que deseas eliminar el lavador ${selectedWasherToRemove}?`);
            if (confirm) {
                const updatedWashers = washers.filter(washer => washer !== selectedWasherToRemove);
                setWashers(updatedWashers);
                localStorage.setItem('washers', JSON.stringify(updatedWashers));

                const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
                const updatedVehicles = vehicles.filter((vehicle: Vehicle) => vehicle.washer !== selectedWasherToRemove);
                localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

                Swal.fire('Éxito', `Lavador ${selectedWasherToRemove} eliminado correctamente`, 'success');
                setSelectedWasherToRemove('');
            }
        } else {
            Swal.fire('Error', 'Selecciona un lavador para eliminar', 'error');
        }
    };

    const handleSearchSummary = () => {
        if (selectedWasherSummary) {
            const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
            const filteredVehicles = vehicles.filter((vehicle: Vehicle) => vehicle.washer === selectedWasherSummary);

            // Calcula el total acumulado basado en los precios
            const totalAmount = filteredVehicles.reduce((sum: number, vehicle: Vehicle) => {
                const priceKey = `${vehicle.vehicleType.toLowerCase()}${vehicle.customerType.toLowerCase()}`;
                const price = washerPrices[priceKey] || 0; // Obtener el precio correcto
                return sum + price;
            }, 0);

            // Actualiza el estado
            setVehicleSummary(filteredVehicles);
            setTotalAmount(totalAmount);
        } else {
            Swal.fire('Error', 'Selecciona un lavador para buscar el resumen', 'error');
        }
    };

    return (
        <div>
            <h2>Gestión de Lavadores</h2>

            <div>
                <h3>Buscar Resumen de Lavador</h3>
                <select
                    value={selectedWasherSummary}
                    onChange={(e) => setSelectedWasherSummary(e.target.value)}
                >
                    <option value="">Seleccione un lavador</option>
                    {washers.map((washer, index) => (
                        <option key={index} value={washer}>{washer}</option>
                    ))}
                </select>
                <button onClick={handleSearchSummary}>Buscar Resumen</button>

                {vehicleSummary.length > 0 && (
                    <div>
                        <h4>Resumen para {selectedWasherSummary}</h4>
                        <ul>
                            {vehicleSummary.map((vehicle, index) => (
                                <li key={index}>
                                    {vehicle.date} - {vehicle.licensePlate} - {vehicle.vehicleType} - {vehicle.companyName}
                                </li>
                            ))}
                        </ul>
                        <h5>Total de Vehículos Lavados:</h5>
                        <ul>
                            {Object.entries(vehicleSummary.reduce((acc: { [key: string]: number }, vehicle) => {
                                const key = `${vehicle.vehicleType.toLowerCase()}${vehicle.customerType.toLowerCase()}`;
                                if (!acc[key]) acc[key] = 0;
                                acc[key] += 1;
                                return acc;
                            }, {})).map(([key, count]) => (
                                <li key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')}: ${count}`}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div>
                <h3>Lavadores Actuales</h3>
                <ul>
                    {washers.map((washer, index) => (
                        <li key={index}>{washer}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Washers;
