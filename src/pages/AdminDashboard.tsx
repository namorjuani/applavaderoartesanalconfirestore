import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AdminDashboard.css'
import { db } from '../firebaseConfig'; // Ajusta la ruta según la ubicación de tu archivo

// Ahora puedes usar `db` para interactuar con Firestore, por ejemplo:
import { collection, getDocs } from "firebase/firestore";

async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "nombreDeTuColeccion"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
}

const AdminDashboard: React.FC = () => {

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [washers, setWashers] = useState<string[]>([]);
    const [selectedWasher, setSelectedWasher] = useState<string>('');
    const [prices, setPrices] = useState<{ [key: string]: number }>({
        autoRentacar: 5500,
        suvRentacar: 6500,
        fourByFour: 8500,
        combiRentacar: 10000,
        autoParticular: 5500,
        suvParticular: 6500,
        fourByFourParticular: 8500,
        combiParticular: 10000,
    });
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
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Admin logged in:', localStorage.getItem('adminLoggedIn'));
        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        console.log('Loaded vehicles:', storedVehicles);
        setVehicles(storedVehicles);

        const storedWashers = JSON.parse(localStorage.getItem('washers') || '["Ariana", "Alejandro", "Javier"]');
        console.log('Loaded washers:', storedWashers);
        setWashers(storedWashers);

        const storedPrices = JSON.parse(localStorage.getItem('washPrices') || '{}');
        console.log('Loaded wash prices:', storedPrices);
        if (Object.keys(storedPrices).length > 0) {
            setPrices(storedPrices);
        }

        const storedWasherPrices = JSON.parse(localStorage.getItem('washerPrices') || '{}');
        console.log('Loaded washer prices:', storedWasherPrices);
        if (Object.keys(storedWasherPrices).length > 0) {
            setWasherPrices(storedWasherPrices);
        }
    }, [navigate]);

    const handleAddWasher = () => {
        const newWasher = prompt('Ingrese el nombre del nuevo lavador:');
        if (newWasher) {
            setWashers(prevWashers => [...prevWashers, newWasher]);
            localStorage.setItem('washers', JSON.stringify([...washers, newWasher]));
            Swal.fire('Éxito', `Lavador ${newWasher} agregado correctamente`, 'success');
        }
    };

    const handleRemoveWasher = (washer: string) => {
        const confirm = window.confirm(`¿Estás seguro de que deseas eliminar a ${washer}?`);
        if (confirm) {
            const updatedWashers = washers.filter(w => w !== washer);
            setWashers(updatedWashers);
            localStorage.setItem('washers', JSON.stringify(updatedWashers));
            Swal.fire('Éxito', `Lavador ${washer} eliminado correctamente`, 'success');
        }
    };

    const handleEditVehicle = (index: number) => {
        const newLicensePlate = prompt('Modificar patente:', vehicles[index].licensePlate);
        const newVehicleType = prompt('Modificar tipo de vehículo:', vehicles[index].vehicleType);
        const newWasher = prompt('Modificar lavador:', vehicles[index].washer);
        const newCompany = prompt('Modificar empresa:', vehicles[index].companyName);
        const newDate = prompt('Modificar fecha:', vehicles[index].date);

        if (newLicensePlate && newVehicleType && newWasher && newCompany && newDate) {
            const updatedVehicles = [...vehicles];
            updatedVehicles[index] = {
                ...updatedVehicles[index],
                licensePlate: newLicensePlate,
                vehicleType: newVehicleType,
                washer: newWasher,
                companyName: newCompany,
                date: newDate
            };
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

    const handlePaymentReceived = (washer: string) => {
        const confirm = window.confirm(`¿Confirmar que el pago de ${washer} ha sido recibido y los registros deben ser reiniciados?`);
        if (confirm) {
            const updatedVehicles = vehicles.map(vehicle =>
                vehicle.washer === washer ? { ...vehicle, amount: 0 } : vehicle
            );
            setVehicles(updatedVehicles);
            localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
            Swal.fire('Éxito', `Registros de ${washer} reiniciados`, 'success');
        }
    };

    const handlePriceChange = (type: string, value: number) => {
        setPrices(prevPrices => ({ ...prevPrices, [type]: value }));
    };

    const handleWasherPriceChange = (type: string, value: number) => {
        setWasherPrices(prevPrices => ({ ...prevPrices, [type]: value }));
    };

    const handleSavePrices = () => {
        localStorage.setItem('washPrices', JSON.stringify(prices));
        Swal.fire('Éxito', 'Tarifas de lavado actualizadas correctamente', 'success');
    };

    const handleSaveWasherPrices = () => {
        localStorage.setItem('washerPrices', JSON.stringify(washerPrices));
        Swal.fire('Éxito', 'Tarifas de lavadores actualizadas correctamente', 'success');
    };

    const uniqueCompanies = Array.from(new Set(vehicles.map((vehicle: any) => vehicle.companyName)));

    return (
        <div className="admin-dashboard">
            <h2>Panel de Administración</h2>

            <div>
                <h3>Gestión de Lavadores</h3>
                <button className="button add" onClick={handleAddWasher}>Agregar Lavador</button>
                <ul>
                    {washers.map((washer, index) => (
                        <li key={index}>
                            {washer}
                            <button className="button remove" onClick={() => handleRemoveWasher(washer)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Modificar Tarifas de Lavado</h3>
                {Object.keys(prices).map((key, index) => (
                    <div key={index}>
                        <label>
                            {key}:
                            <input
                                type="number"
                                value={prices[key]}
                                onChange={(e) => handlePriceChange(key, Number(e.target.value))}
                            />
                        </label>
                    </div>
                ))}
                <button onClick={handleSavePrices}>Guardar Tarifas de Lavado</button>

                <h3>Modificar Tarifas de Lavadores</h3>
                {Object.keys(washerPrices).map((key, index) => (
                    <div key={index}>
                        <label>
                            {key}:
                            <input
                                type="number"
                                value={washerPrices[key]}
                                onChange={(e) => handleWasherPriceChange(key, Number(e.target.value))}
                            />
                        </label>
                    </div>
                ))}
                <button onClick={handleSaveWasherPrices}>Guardar Tarifas de Lavadores</button>
            </div>

            <div>
                <h3>Filtrar y Limpiar Registros</h3>
                <div>
                    <label>
                        Empresa:
                        <select onChange={(e) => setSelectedCompany(e.target.value)} value={selectedCompany}>
                            <option value="">Seleccionar empresa</option>
                            {uniqueCompanies.map((company, index) => (
                                <option key={index} value={company}>{company}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Fecha de inicio:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <label>
                        Fecha de fin:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                </div>
                <button onClick={handleClearCompanyRecords}>Limpiar Registros de Empresa</button>
            </div>

            <div>
                <h3>Registros de Lavadores</h3>
                <ul>
                    {washers.map(washer => (
                        <li key={washer}>
                            {washer}
                            <button className="button clear" onClick={() => handleClearWasher(washer)}>Limpiar Registros</button>
                            <button className="button payment" onClick={() => handlePaymentReceived(washer)}>Pago Recibido</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Modificar Vehículo</h3>
                {vehicles.map((vehicle, index) => (
                    <div key={index}>
                        <p>Patente: {vehicle.licensePlate}, Tipo: {vehicle.vehicleType}, Lavador: {vehicle.washer}, Empresa: {vehicle.companyName}, Fecha: {vehicle.date}</p>
                        <button onClick={() => handleEditVehicle(index)}>Modificar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
