import React, { useState, useEffect } from 'react';

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
            <h2>Listado de Vehículos Ingresados</h2>
            <label>
                Filtrar por fecha:
                <input type="date" name="date" onChange={handleFilterChange} />
            </label>
            <br />
            <label>
                Filtrar por patente:
                <input type="text" name="licensePlate" onChange={handleFilterChange} />
            </label>
            <br />
            <label>
                Filtrar por empresa:
                <input type="text" name="companyName" onChange={handleFilterChange} />
            </label>
            <br />
            <label>
                Filtrar por tipo de cliente:
                <select name="customerType" onChange={handleFilterChange}>
                    <option value="">Todos</option>
                    <option value="rent">Rent A Car</option>
                    <option value="private">Particular</option>
                </select>
            </label>
            <br />
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {filteredVehicles.map((vehicle, index) => (
                    <li
                        key={index}
                        style={{
                            marginBottom: '8px',
                            backgroundColor: vehicle.washer ? 'lightgreen' : 'grey',
                            padding: '8px',
                            borderRadius: '4px',
                        }}
                    >
                        {index + 1}. {vehicle.date} - {vehicle.companyName} - {vehicle.licensePlate} - {vehicle.vehicleType} - {vehicle.customerName}
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
