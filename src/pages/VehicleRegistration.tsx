import React from 'react';
import VehicleForm from '../components/VehicleForm';
import VehicleList from '../components/VehicleList';

const VehicleRegistration: React.FC = () => {
    return (
        <div>
            <VehicleForm />
            <VehicleList />
        </div>
    );
};

export default VehicleRegistration;
