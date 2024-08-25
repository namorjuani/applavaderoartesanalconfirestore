import React, { useState, useEffect } from 'react';
import './VehicleList.css'; // Asegúrate de que este archivo existe y se usa en tu proyecto

const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

const VehicleList: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [washers, setWashers] = useState<string[]>([]);
    const [filters, setFilters] = useState({ date: '', licensePlate: '', companyName: '', customerType: '' });
    const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);

    useEffect(() => {
        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        setVehicles(storedVehicles);

        const storedWashers = JSON.parse(localStorage.getItem('washers') || '[]');
        setWashers(storedWashers);

        filterVehicles(storedVehicles);
    }, [filters]);

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
            setVehicles(updatedVehicles);
            filterVehicles(updatedVehicles);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleAssignWasher = (vehicleIndex: number, washerName: string) => {
        const newVehicles = [...vehicles];
        newVehicles[vehicleIndex].washer = washerName;
        setVehicles(newVehicles);
        localStorage.setItem('vehicles', JSON.stringify(newVehicles));

        const updatedLogs = [...(JSON.parse(localStorage.getItem('washerLogs') || '[]')), { washer: washerName, ...newVehicles[vehicleIndex] }];
        localStorage.setItem('washerLogs', JSON.stringify(updatedLogs));
    };

    const filterVehicles = (vehiclesList: any[]) => {
        let filtered = vehiclesList;
        const { date, licensePlate, companyName, customerType } = filters;

        if (date) filtered = filtered.filter(vehicle => vehicle.date === date);
        if (licensePlate) filtered = filtered.filter(vehicle => vehicle.licensePlate.includes(licensePlate));
        if (companyName) filtered = filtered.filter(vehicle => vehicle.companyName.includes(companyName));
        if (customerType) filtered = filtered.filter(vehicle => vehicle.customerType === customerType);

        setFilteredVehicles(filtered);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const clearDailyData = () => {
        const today = getTodayDate();
        const vehiclesToday = vehicles.filter(vehicle => vehicle.date === today);
        if (vehiclesToday.length > 0) {
            localStorage.setItem('vehicles', JSON.stringify([]));
            setVehicles([]);
            setFilteredVehicles([]);
        }
    };

    useEffect(() => {
        clearDailyData();
    }, []);

    return (
        <div className="VehicleList">
            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Patente</th>
                        <th>Tipo de Vehículo</th>
                        <th>Nombre del Cliente</th>
                        <th>Teléfono</th>
                        <th>Empresa</th>
                        <th>Lavador</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVehicles.map((vehicle, index) => (
                        <tr
                            key={index}
                            className={vehicle.washer ? 'assigned' : ''}
                        >
                            <td>{vehicle.date}</td>
                            <td>{vehicle.licensePlate}</td>
                            <td>{vehicle.vehicleType}</td>
                            <td>{vehicle.customerName}</td>
                            <td>{vehicle.phoneNumber}</td>
                            <td>{vehicle.companyName}</td>
                            <td>
                                <select
                                    value={vehicle.washer || ''}
                                    onChange={(e) => handleAssignWasher(index, e.target.value)}
                                >
                                    <option value="">Seleccione un lavador</option>
                                    {washers.map((washer, i) => (
                                        <option key={i} value={washer}>{washer}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default VehicleList;
