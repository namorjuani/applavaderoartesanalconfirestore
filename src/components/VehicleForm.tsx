// src/components/VehicleForm.tsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const VehicleForm: React.FC = () => {
    const [customerType, setCustomerType] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCustomerTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCustomerType(event.target.value);
    }

    const handleCompanyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyName(event.target.value);
    }

    const handleLicensePlateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLicensePlate(event.target.value);
    }

    const handleVehicleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVehicleType(event.target.value);
    }

    const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerName(event.target.value);
    }

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!customerType || !vehicleType || (!companyName && customerType === 'rent')) {
            Swal.fire('Error', 'Por favor complete todos los campos obligatorios.', 'error');
            return;
        }

        Swal.fire('Vehículo cargado', '', 'success');

        const vehicle = {
            customerType,
            companyName,
            licensePlate,
            vehicleType,
            customerName,
            phoneNumber
        };
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        vehicles.push(vehicle);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));

        setCustomerType('');
        setCompanyName('');
        setLicensePlate('');
        setVehicleType('');
        setCustomerName('');
        setPhoneNumber('');
    }

    return (
        <div className="VehicleForm">
            <form onSubmit={handleFormSubmit}>
                <label>
                    Soy de Rent A Car o Soy Particular:
                    <select value={customerType} onChange={handleCustomerTypeChange} required>
                        <option value="">Seleccionar...</option>
                        <option value="rent">Rent A Car</option>
                        <option value="private">Particular</option>
                    </select>
                </label>
                <br />
                {customerType === 'rent' && (
                    <label>
                        Nombre de la empresa:
                        <input type="text" value={companyName} onChange={handleCompanyNameChange} required />
                    </label>
                )}
                <br />
                <label>
                    Patente del vehículo:
                    <input type="text" value={licensePlate} onChange={handleLicensePlateChange} required />
                </label>
                <br />
                <label>
                    Tipo de vehículo:
                    <select value={vehicleType} onChange={handleVehicleTypeChange} required>
                        <option value="">Seleccionar...</option>
                        <option value="auto">Auto ($5,500)</option>
                        <option value="suv">SUV ($6,500)</option>
                        <option value="4x4">4x4 ($8,500)</option>
                        <option value="combi">Combi ($10,000)</option>
                    </select>
                </label>
                <br />
                <label>
                    Nombre del cliente:
                    <input type="text" value={customerName} onChange={handleCustomerNameChange} required />
                </label>
                <br />
                {customerType === 'private' && (
                    <label>
                        Número de teléfono:
                        <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
                    </label>
                )}
                <br />
                <button type="submit">Cargar vehículo</button>
            </form>
        </div>
    );
}

export default VehicleForm;