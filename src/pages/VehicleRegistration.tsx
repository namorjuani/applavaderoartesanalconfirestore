import React from 'react';
import VehicleForm from '../components/VehicleForm';
import VehicleList from '../components/VehicleList';

const VehicleRegistration: React.FC = () => {
    return (
        <div>
            <h2>Registro de Vehículos Ingresados</h2>
            <VehicleForm />
            <VehicleList />
        </div>
    );
};

export default VehicleRegistration;
