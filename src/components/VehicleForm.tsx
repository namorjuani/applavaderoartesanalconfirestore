import React, { useState } from 'react';
import Swal from 'sweetalert2';

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

    // Obtiene los precios actualizados del localStorage
    const getPrices = () => JSON.parse(localStorage.getItem('washPrices') || '{}');

    const vehiclePrices = getPrices();

    const handleCustomerTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value;
        setCustomerType(type);
        // Resetea el monto al cambiar el tipo de cliente
        if (vehicleType) {
            setAmount(vehiclePrices[type]?.[vehicleType] || 0);
        }
    }

    const handleCompanyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyName(event.target.value);
    }

    const handleLicensePlateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLicensePlate(event.target.value);
    }

    const handleVehicleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value;
        setVehicleType(type);
        // Actualiza el monto basado en el tipo de vehículo y cliente
        if (customerType) {
            setAmount(vehiclePrices[customerType]?.[type] || 0);
        }
    }

    const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerName(event.target.value);
    }

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    }

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
            washer: '', // Lavador no asignado en el formulario
            amount,
        };

        const updatedVehicles = [...vehicles, newVehicle];
        setVehicles(updatedVehicles);
        localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

        // Disparar evento para actualización de la lista
        window.dispatchEvent(new Event('storage'));

        // Reset fields
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
    }

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
                    <input type="text" value={companyName} onChange={handleCompanyNameChange} />
                </label>
                <br />
                <label>
                    Patente:
                    <input type="text" value={licensePlate} onChange={handleLicensePlateChange} />
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
                    <input type="text" value={customerName} onChange={handleCustomerNameChange} />
                </label>
                <br />
                {customerType === 'private' && (
                    <>
                        <label>
                            Teléfono del Cliente:
                            <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} />
                        </label>
                        <br />
                    </>
                )}

                <br />
                <button type="submit">Registrar Vehículo</button>
            </form>
        </div>
    );
}

export default VehicleForm;
