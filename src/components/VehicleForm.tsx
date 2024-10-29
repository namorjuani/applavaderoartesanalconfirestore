// VehicleForm.tsx
import React, { useState } from 'react';
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

const VehicleForm: React.FC = () => {
    const [customerType, setCustomerType] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState(0);
    const [vehicles, setVehicles] = useState<Vehicle[]>(JSON.parse(localStorage.getItem('vehicles') || '[]'));

    // Función para obtener los precios desde el localStorage
    const getPrices = () => {
        const prices = JSON.parse(localStorage.getItem('washPrices') || '{}');
        console.log('Prices:', prices); // Log para verificar los precios
        return prices;
    };
    const vehiclePrices = getPrices();

    // Función para formatear el key como "fourByFourRentacar"
    const formatKey = (type: string, customerType: string) => {
        let vehicleKey = '';
        switch (type) {
            case '4x4':
                vehicleKey = 'fourByFour';
                break;
            case 'auto':
                vehicleKey = 'auto';
                break;
            case 'suv':
                vehicleKey = 'suv';
                break;
            case 'combi':
                vehicleKey = 'combi';
                break;
            default:
                vehicleKey = type;
        }
        const formattedKey = `${vehicleKey}${customerType === 'rental' ? 'Rentacar' : 'Particular'}`;
        console.log('Formatted Key:', formattedKey); // Log para verificar el key
        return formattedKey;
    };

    // Actualiza el tipo de cliente y, si ya se seleccionó un tipo de vehículo, actualiza el monto
    const handleCustomerTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value;
        setCustomerType(type);
        if (vehicleType) {
            const priceKey = formatKey(vehicleType, type);
            console.log('Price Key:', priceKey); // Ver qué clave se está generando
            setAmount(vehiclePrices[priceKey] || 0);
            console.log('Amount set to:', vehiclePrices[priceKey] || 0); // Ver el monto establecido
        }
    };

    // Actualiza el tipo de vehículo y calcula el monto basado en el tipo de cliente
    const handleVehicleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value;
        setVehicleType(type);
        if (customerType) {
            const priceKey = formatKey(type, customerType);
            console.log('Price Key:', priceKey); // Ver qué clave se está generando
            setAmount(vehiclePrices[priceKey] || 0);
            console.log('Amount set to:', vehiclePrices[priceKey] || 0); // Ver el monto establecido
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!customerType || !licensePlate || !vehicleType || !customerName || (customerType === 'private' && !phoneNumber)) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor complete todos los campos',
            });
            return;
        }

        const date = new Date().toISOString().split('T')[0];
        const newVehicle: Vehicle = {
            customerType,
            companyName,
            licensePlate,
            vehicleType,
            customerName,
            phoneNumber,
            date,
            washer: '',
            amount,
        };

        try {
            const updatedVehicles = [...vehicles, newVehicle];
            setVehicles(updatedVehicles);
            localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

            // Disparar evento para actualización de la lista
            window.dispatchEvent(new Event('storage'));

            // Resetear campos
            setCustomerType('');
            setCompanyName('');
            setLicensePlate('');
            setVehicleType('');
            setCustomerName('');
            setPhoneNumber('');
            setAmount(0);

            Swal.fire({
                icon: 'success',
                title: 'Vehículo registrado exitosamente',
            });
        } catch (error) {
            console.error("Error al guardar el vehículo:", error); // Esto imprimirá el error en la consola
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo registrar el vehículo. Por favor intente de nuevo.',
            });
        }
    };


    return (
        <div className="VehicleForm">
            <h2>Registrar Vehículo</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Tipo de Cliente:
                    <select value={customerType} onChange={handleCustomerTypeChange}>
                        <option value="">Seleccione...</option>
                        <option value="rental">Rent A Car</option>
                        <option value="private">Particular</option>
                    </select>
                </label>
                <br />
                <label>
                    Empresa:
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </label>
                <br />
                <label>
                    Patente:
                    <input type="text" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                </label>
                <br />
                <label>
                    Tipo de Vehículo:
                    <select value={vehicleType} onChange={handleVehicleTypeChange}>
                        <option value="">Seleccione...</option>
                        <option value="auto">Auto</option>
                        <option value="suv">SUV</option>
                        <option value="4x4">4x4</option>
                        <option value="combi">Combi</option>
                    </select>
                </label>
                <br />
                <label>
                    Nombre del Cliente:
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </label>
                <br />
                {customerType === 'private' && (
                    <>
                        <label>
                            Teléfono del Cliente:
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </label>
                        <br />
                    </>
                )}
                <br />
                <button type="submit">Registrar Vehículo</button>
            </form>
        </div>
    );
};

export default VehicleForm;
