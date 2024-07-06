// src/components/WasherLog.tsx
import React, { useState, useEffect } from 'react';

const WasherLog: React.FC = () => {
    const [washers, setWashers] = useState<string[]>(['Ariana', 'Alejandro', 'Javier']);
    const [selectedWasher, setSelectedWasher] = useState<string>('');
    const [washerLogs, setWasherLogs] = useState<any[]>([]);

    useEffect(() => {
        const storedLogs = JSON.parse(localStorage.getItem('washerLogs') || '[]');
        setWasherLogs(storedLogs);
    }, []);

    const handleWasherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWasher(event.target.value);
    };

    const handleAddWasher = () => {
        const newWasher = prompt('Ingrese el nombre del nuevo lavador');
        if (newWasher) {
            setWashers([...washers, newWasher]);
            setSelectedWasher(newWasher);
        }
    };

    const filteredLogs = washerLogs.filter(log => log.washer === selectedWasher);

    const summary = filteredLogs.reduce((acc, log) => {
        acc.total += log.amount;
        acc[log.vehicleType] = (acc[log.vehicleType] || 0) + 1;
        return acc;
    }, { total: 0, auto: 0, suv: 0, '4x4': 0, combi: 0 });

    return (
        <div className="WasherLog">
            <h2>Log de Lavadores</h2>
            <label>
                Seleccione Lavador:
                <select value={selectedWasher} onChange={handleWasherChange}>
                    <option value="">Seleccione...</option>
                    {washers.map(washer => (
                        <option key={washer} value={washer}>{washer}</option>
                    ))}
                </select>
                <button onClick={handleAddWasher}>Agregar Lavador</button>
            </label>
            {selectedWasher && (
                <div>
                    <h3>Resumen de {selectedWasher}</h3>
                    <p>Autos: {summary.auto}</p>
                    <p>SUVs: {summary.suv}</p>
                    <p>4x4: {summary['4x4']}</p>
                    <p>Combis: {summary.combi}</p>
                    <p>Total Ganado: ${summary.total}</p>
                </div>
            )}
        </div>
    );
};

export default WasherLog;
