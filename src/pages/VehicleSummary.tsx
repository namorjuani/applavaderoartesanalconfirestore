import React, { useState, useEffect } from 'react';

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
