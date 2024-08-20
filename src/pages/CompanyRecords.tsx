import React, { useState, useEffect } from 'react';

const CompanyRecords: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [companyVehicles, setCompanyVehicles] = useState<any[]>([]);
    const [contactNumber, setContactNumber] = useState<string>('');

    useEffect(() => {
        const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        setVehicles(storedVehicles);
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            const filteredVehicles = vehicles.filter(vehicle => vehicle.companyName.toLowerCase() === selectedCompany.toLowerCase());
            setCompanyVehicles(filteredVehicles);
        }
    }, [selectedCompany, vehicles]);

    const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCompany(event.target.value);
    };

    const handleContactNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContactNumber(event.target.value);
    };

    const calculateTotalDebt = () => {
        return companyVehicles.reduce((total, vehicle) => total + getVehicleCost(vehicle.vehicleType), 0);
    };

    const getVehicleCost = (vehicleType: string) => {
        switch (vehicleType) {
            case 'auto':
                return 5500;
            case 'suv':
                return 6500;
            case '4x4':
                return 8500;
            case 'combi':
                return 10000;
            default:
                return 0;
        }
    };

    const generateWhatsAppMessage = () => {
        let message = `Este es su resumen semanal:\n\n`;
        companyVehicles.forEach((vehicle, index) => {
            message += `- Fecha: ${vehicle.date}, Patente: ${vehicle.licensePlate}, Cliente: ${vehicle.customerName}, Tipo: ${vehicle.vehicleType}, Lavado por: ${vehicle.washer}, Costo: $${getVehicleCost(vehicle.vehicleType)}\n`;
        });
        message += `\nTotal Deuda: $${calculateTotalDebt()}\n\nSi necesita factura, es +21%.`;
        return encodeURIComponent(message);
    };

    const whatsappLink = `https://wa.me/${contactNumber}?text=${generateWhatsAppMessage()}`;

    return (
        <div>
            <h2>Registro por Empresa</h2>
            <label>
                Seleccione Empresa:
                <select value={selectedCompany} onChange={handleCompanyChange}>
                    <option value="">Seleccione...</option>
                    {Array.from(new Set(vehicles.map(v => v.companyName.toLowerCase()))).map((company, index) => (
                        <option key={index} value={company}>{company}</option>
                    ))}
                </select>
            </label>
            {selectedCompany && (
                <div>
                    <h3>Vehículos de {selectedCompany}</h3>
                    <ul>
                        {companyVehicles.map((vehicle, index) => (
                            <li key={index}>
                                Fecha: {vehicle.date}, Patente: {vehicle.licensePlate}, Cliente: {vehicle.customerName},
                                Tipo: {vehicle.vehicleType}, Lavado por: {vehicle.washer}, Costo: ${getVehicleCost(vehicle.vehicleType)}
                            </li>
                        ))}
                    </ul>
                    <p>Total Deuda: ${calculateTotalDebt()}</p>
                    <label>
                        Ingrese número de contacto para mandar automáticamente su resumen vía WhatsApp:
                        <input type="text" value={contactNumber} onChange={handleContactNumberChange} placeholder="Ingrese número de contacto" />
                    </label>
                    <br />
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        Enviar Resumen por WhatsApp
                    </a>
                </div>
            )}
        </div>
    );
};

export default CompanyRecords;