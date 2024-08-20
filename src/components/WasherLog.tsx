import React, { useState, useEffect } from 'react';
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

const Washers: React.FC = () => {
    const [washers, setWashers] = useState<string[]>([]);
    const [newWasher, setNewWasher] = useState('');
    const [selectedWasherToRemove, setSelectedWasherToRemove] = useState('');
    const [selectedWasherSummary, setSelectedWasherSummary] = useState<string>('');
    const [vehicleSummary, setVehicleSummary] = useState<Vehicle[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    useEffect(() => {
        const storedWashers = JSON.parse(localStorage.getItem('washers') || '[]');
        setWashers(storedWashers);
    }, []);

    const handleAddWasher = () => {
        if (newWasher && !washers.includes(newWasher)) {
            const updatedWashers = [...washers, newWasher];
            setWashers(updatedWashers);
            localStorage.setItem('washers', JSON.stringify(updatedWashers));
            setNewWasher('');
            Swal.fire('Éxito', 'Lavador agregado correctamente', 'success');
        } else {
            Swal.fire('Error', 'El lavador ya existe o no es válido', 'error');
        }
    };

    const handleRemoveWasher = () => {
        if (selectedWasherToRemove) {
            const confirm = window.confirm(`¿Estás seguro de que deseas eliminar el lavador ${selectedWasherToRemove}?`);
            if (confirm) {
                // Eliminar el lavador de la lista de lavadores
                const updatedWashers = washers.filter(washer => washer !== selectedWasherToRemove);
                setWashers(updatedWashers);
                localStorage.setItem('washers', JSON.stringify(updatedWashers));

                // Eliminar todos los registros asociados a ese lavador
                const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
                const updatedVehicles = vehicles.filter(vehicle => vehicle.washer !== selectedWasherToRemove);
                localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

                Swal.fire('Éxito', `Lavador ${selectedWasherToRemove} eliminado correctamente`, 'success');
                setSelectedWasherToRemove(''); // Resetear selección
            }
        } else {
            Swal.fire('Error', 'Selecciona un lavador para eliminar', 'error');
        }
    };

    const handleSearchSummary = () => {
        if (selectedWasherSummary) {
            const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
            const filteredVehicles = vehicles.filter(vehicle => vehicle.washer === selectedWasherSummary);

            // Calcular el total asegurando que amount es un número
            const totalAmount = filteredVehicles.reduce((sum, vehicle) => sum + (vehicle.amount || 0), 0);

            setVehicleSummary(filteredVehicles);
            setTotalAmount(totalAmount);
        } else {
            Swal.fire('Error', 'Selecciona un lavador para buscar el resumen', 'error');
        }
    };

    return (
        <div>
            <h2>Gestión de Lavadores</h2>

            <div>
                <h3>Agregar Lavador</h3>
                <input
                    type="text"
                    value={newWasher}
                    onChange={(e) => setNewWasher(e.target.value)}
                    placeholder="Nombre del lavador"
                />
                <button onClick={handleAddWasher}>Agregar Lavador</button>
            </div>

            <div>
                <h3>Eliminar Lavador</h3>
                <select
                    value={selectedWasherToRemove}
                    onChange={(e) => setSelectedWasherToRemove(e.target.value)}
                >
                    <option value="">Seleccione un lavador para eliminar</option>
                    {washers.map((washer, index) => (
                        <option key={index} value={washer}>{washer}</option>
                    ))}
                </select>
                <button onClick={handleRemoveWasher}>Quitar Lavador Existente</button>
            </div>

            <div>
                <h3>Buscar Resumen de Lavador</h3>
                <select
                    value={selectedWasherSummary}
                    onChange={(e) => setSelectedWasherSummary(e.target.value)}
                >
                    <option value="">Seleccione un lavador</option>
                    {washers.map((washer, index) => (
                        <option key={index} value={washer}>{washer}</option>
                    ))}
                </select>
                <button onClick={handleSearchSummary}>Buscar Resumen</button>

                {vehicleSummary.length > 0 && (
                    <div>
                        <h4>Resumen para {selectedWasherSummary}</h4>
                        <ul>
                            {vehicleSummary.map((vehicle, index) => (
                                <li key={index}>
                                    {vehicle.licensePlate} - {vehicle.vehicleType} - ${vehicle.amount?.toFixed(2) || '0.00'}
                                </li>
                            ))}
                        </ul>
                        <h5>Total Acumulado: ${totalAmount.toFixed(2)}</h5>
                    </div>
                )}
            </div>

            <div>
                <h3>Lavadores Actuales</h3>
                <ul>
                    {washers.map((washer, index) => (
                        <li key={index}>{washer}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Washers;
