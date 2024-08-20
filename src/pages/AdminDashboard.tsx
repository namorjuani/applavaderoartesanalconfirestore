import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboard: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [washers, setWashers] = useState<string[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [companies, setCompanies] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isAdminLoggedIn) {
            navigate('/admin-login');
        }

        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        setVehicles(storedVehicles);

        const storedWashers = JSON.parse(localStorage.getItem('washers') || '["Ariana", "Alejandro", "Javier"]');
        setWashers(storedWashers);

        const uniqueCompanies = Array.from(new Set(storedVehicles.map((vehicle: any) => vehicle.companyName)));
        setCompanies(uniqueCompanies);
    }, [navigate]);

    const handleEditVehicle = (index: number) => {
        const newLicensePlate = prompt('Modificar patente:', vehicles[index].licensePlate);
        const newVehicleType = prompt('Modificar tipo de vehículo:', vehicles[index].vehicleType);
        const newWasher = prompt('Modificar lavador:', vehicles[index].washer);

        if (newLicensePlate && newVehicleType && newWasher) {
            const updatedVehicles = [...vehicles];
            updatedVehicles[index].licensePlate = newLicensePlate;
            updatedVehicles[index].vehicleType = newVehicleType;
            updatedVehicles[index].washer = newWasher;
            setVehicles(updatedVehicles);
            localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
            Swal.fire('Éxito', 'Vehículo modificado correctamente', 'success');
        }
    };

    const handleClearWasher = (washer: string) => {
        const confirm = window.confirm(`¿Estás seguro de que deseas limpiar los registros de ${washer}?`);
        if (confirm) {
            const newLogs = vehicles.filter(vehicle => vehicle.washer !== washer);
            setVehicles(newLogs);
            localStorage.setItem('vehicles', JSON.stringify(newLogs));
            Swal.fire('Éxito', `Registros de ${washer} eliminados`, 'success');
        }
    };

    const handleClearCompanyRecords = () => {
        if (!selectedCompany || !startDate || !endDate) {
            Swal.fire('Error', 'Por favor complete todos los campos', 'error');
            return;
        }

        const filteredVehicles = vehicles.filter(vehicle =>
            vehicle.companyName === selectedCompany &&
            new Date(vehicle.date) >= new Date(startDate) &&
            new Date(vehicle.date) <= new Date(endDate)
        );

        if (filteredVehicles.length === 0) {
            Swal.fire('Error', 'No hay registros para esta empresa en el rango de fechas seleccionado', 'error');
            return;
        }

        const confirm = window.confirm(`¿Estás seguro de que deseas limpiar los registros de ${selectedCompany} desde ${startDate} hasta ${endDate}?`);
        if (confirm) {
            const newVehicles = vehicles.filter(vehicle =>
                vehicle.companyName !== selectedCompany ||
                new Date(vehicle.date) < new Date(startDate) ||
                new Date(vehicle.date) > new Date(endDate)
            );
            setVehicles(newVehicles);
            localStorage.setItem('vehicles', JSON.stringify(newVehicles));
            Swal.fire('Éxito', `Registros de ${selectedCompany} eliminados para el rango de fechas seleccionado`, 'success');
        }
    };

    return (
        <div>
            <h2>Panel de Administración</h2>
            <h3>Modificar Vehículos</h3>
            <ul>
                {vehicles.map((vehicle, index) => (
                    <li key={index}>
                        {vehicle.licensePlate} - {vehicle.vehicleType} - Lavado por: {vehicle.washer}
                        <button onClick={() => handleEditVehicle(index)}>Editar</button>
                    </li>
                ))}
            </ul>
            <h3>Limpiar Lavadores</h3>
            <ul>
                {washers.map((washer, index) => (
                    <li key={index}>
                        {washer}
                        <button onClick={() => handleClearWasher(washer)}>Limpiar</button>
                    </li>
                ))}
            </ul>
            <h3>Registro por Empresa</h3>
            <label>
                Seleccione Empresa:
                <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                    <option value="">Seleccione...</option>
                    {companies.map((company, index) => (
                        <option key={index} value={company}>{company}</option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Fecha de Inicio:
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <br />
            <label>
                Fecha de Fin:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <br />
            <button onClick={handleClearCompanyRecords}>Limpiar Registros</button>
        </div>
    );
};

export default AdminDashboard;
