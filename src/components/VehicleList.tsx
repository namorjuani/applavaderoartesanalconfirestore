import React, { useState, useEffect } from 'react';

const VehicleList: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [washers, setWashers] = useState<string[]>([]);

    useEffect(() => {
        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        setVehicles(storedVehicles);

        const storedWashers = JSON.parse(localStorage.getItem('washers') || '["Ariana", "Alejandro", "Javier"]');
        setWashers(storedWashers);
    }, []);

    const handleAssignWasher = (vehicleIndex: number, washerName: string) => {
        const newVehicles = [...vehicles];
        newVehicles[vehicleIndex].washer = washerName;
        setVehicles(newVehicles);
        localStorage.setItem('vehicles', JSON.stringify(newVehicles));

        const washerLog = {
            washer: washerName,
            vehicleType: newVehicles[vehicleIndex].vehicleType,
            amount: getWasherEarnings(newVehicles[vehicleIndex].customerType, newVehicles[vehicleIndex].vehicleType),
            date: new Date().toLocaleDateString() // Añadir fecha actual
        };

        const storedWasherLogs = JSON.parse(localStorage.getItem('washerLogs') || '[]');
        storedWasherLogs.push(washerLog);
        localStorage.setItem('washerLogs', JSON.stringify(storedWasherLogs));
    };

    const getWasherEarnings = (customerType: string, vehicleType: string) => {
        if (customerType === 'rent') {
            switch (vehicleType) {
                case 'auto':
                    return 2200;
                case 'suv':
                case '4x4':
                    return 3200;
                default:
                    return 0;
            }
        } else if (customerType === 'private') {
            return 4200;
        }
        return 0;
    };

    return (
        <div className="VehicleList">
            <h2>Vehículos Ingresados</h2>
            <ul>
                {vehicles.map((vehicle, index) => (
                    <li key={index}>
                        {vehicle.date} - {vehicle.companyName} - {vehicle.licensePlate} - {vehicle.vehicleType} - {vehicle.customerName}
                        <select
                            value={vehicle.washer || ''}
                            onChange={(e) => handleAssignWasher(index, e.target.value)}
                        >
                            <option value="">Lavado por...</option>
                            {washers.map(washer => (
                                <option key={washer} value={washer}>{washer}</option>
                            ))}
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VehicleList;
