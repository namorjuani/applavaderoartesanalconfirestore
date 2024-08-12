import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import VehicleRegistration from "./pages/VehicleRegistration";
import Washers from "./pages/Washers";
import VehicleSummary from "./pages/VehicleSummary"; // Importar el nuevo componente
import Navigation from "./components/Navigation";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigation />
          <Routes>
            <Route path="/" element={<VehicleRegistration />} />
            <Route path="/washers" element={<Washers />} />
            <Route path="/vehicle-summary" element={<VehicleSummary />} /> {/* Nueva ruta */}
          </Routes>
        </header>
      </div>
    </Router>
  );
};

export default App;
