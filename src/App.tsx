import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import VehicleRegistration from "./pages/VehicleRegistration";
import Washers from "./pages/Washers";
import VehicleSummary from "./pages/VehicleSummary";
import Navigation from "./components/Navigation";
import CompanyRecords from "./pages/CompanyRecords";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { collection, getDocs, addDoc } from "firebase/firestore"; // Importa getDocs
import { db } from './firebaseConfig';

const App: React.FC = () => {
  const migrateDataToFirebase = async () => {
    const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const vehiclesCollection = collection(db, 'vehicles');

    // Verifica si hay vehículos existentes en Firebase
    const existingVehiclesSnapshot = await getDocs(vehiclesCollection);
    const existingVehicles = existingVehiclesSnapshot.docs.map(doc => doc.data());

    // Filtra los vehículos que ya existen en Firebase
    const newVehicles = vehicles.filter(vehicle =>
      !existingVehicles.some(existing => existing.id === vehicle.id) // Asegúrate de tener una propiedad 'id' única
    );

    for (const vehicle of newVehicles) {
      try {
        await addDoc(vehiclesCollection, vehicle);
        console.log("Vehículo agregado:", vehicle);
      } catch (e) {
        console.error("Error al agregar vehículo:", e);
      }
    }

    // Limpiar localStorage si es necesario
    localStorage.removeItem('vehicles'); // O puedes vaciarlo si prefieres
  };

  useEffect(() => {
    migrateDataToFirebase();
  }, []); // Esto se ejecuta una vez al montar el componente

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigation />
          <Routes>
            <Route path="/" element={<VehicleRegistration />} />
            <Route path="/washers" element={<Washers />} />
            <Route path="/vehicle-summary" element={<VehicleSummary />} />
            <Route path="/company-records" element={<CompanyRecords />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
};

export default App;
