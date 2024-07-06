// src/components/VehicleList.tsx
import React, { useState, useEffect } from 'react';

const VehicleList: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [filter, setFilter] = useState({ date: '', company: '', licensePlate: '' });

    useEffect(() => {
        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        setVehicles(storedVehicles);
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, [event.target.name]: event.target.value });
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesDate = !filter.date || vehicle.date === filter.date;
        const matchesCompany = !filter.company || vehicle.companyName.includes(filter.company);
        const matchesLicensePlate = !filter.licensePlate || vehicle.licensePlate.includes(filter.licensePlate);
        return matchesDate && matchesCompany && matchesLicensePlate;
    });

    return (
        <div className="VehicleList">
            <h2>Vehículos Ingresados</h2>
            <div>
                <label>
                    Fecha:
                    <input type="date" name="date" value={filter.date} onChange={handleFilterChange} />
                </label>
                <label>
                    Empresa:
                    <input type="text" name="company" value={filter.company} onChange={handleFilterChange} />
                </label>
                <label>
                    Patente:
                    <input type="text" name="licensePlate" value={filter.licensePlate} onChange={handleFilterChange} />
                </label>
            </div>
            <ul>
                {filteredVehicles.map((vehicle, index) => (
                    <li key={index}>
                        {vehicle.date} - {vehicle.companyName} - {vehicle.licensePlate} - {vehicle.vehicleType} - {vehicle.customerName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VehicleList;
